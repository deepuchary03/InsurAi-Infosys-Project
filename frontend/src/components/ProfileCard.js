import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './ProfileCard.css';

function ProfileCard({ user, onUpdate, userType }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ...user,
    password: '' // Empty password field for security
  });
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // First try to get the complete user data
        const response = await userAPI.getUserById(user.id);
        const userData = response.data;
        
        // Update the profile data state
        setProfileData(userData);
        
        // Update form data with all available user information
        setFormData(prev => ({
          ...prev,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          fullName: userData.fullName,
          // Include any additional fields from user data
          ...userData
        }));
        
        console.log('Fetched user data:', userData); // For debugging
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update the user data
      await userAPI.updateUser(user.id, formData);
      
      // Fetch the updated data
      const response = await userAPI.getUserById(user.id);
      const updatedData = response.data;
      
      // Update local state
      setProfileData(updatedData);
      setFormData(prev => ({
        ...prev,
        ...updatedData,
        password: '' // Reset password field
      }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-card glass-card">
        <div className="loader">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-card auth-form glass-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileData?.name ? profileData.name[0].toUpperCase() : user.username[0].toUpperCase()}
        </div>
        <h2>{userType} Profile</h2>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="auth-form profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="auth-input"
              disabled
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="auth-input"
              placeholder="Enter phone number"
            />
          </div>

          {userType === 'Agent' && (
            <>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              <div className="form-group">
                <label>Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  value={formData.workingHours || ''}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability || 'yes'}
                  onChange={handleChange}
                  className="auth-input"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>New Password (Optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password will remain unchanged if empty"
              className="auth-input"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details auth-form">
          <div className="detail-group">
            <label>Username</label>
            <div className="detail-value">{user.username}</div>
          </div>
          <div className="detail-group">
            <label>Email</label>
            <div className="detail-value">
              {profileData?.email ? (
                <>
                  {profileData.email}
                  {profileData.emailVerified && (
                    <span className="email-verified">✓ Verified</span>
                  )}
                </>
              ) : (
                'Not set'
              )}
            </div>
          </div>
          <div className="detail-group">
            <label>Phone</label>
            <div className="detail-value">{profileData?.phone || 'Not set'}</div>
          </div>
          {userType === 'Agent' && (
            <>
              <div className="detail-group">
                <label>Specialization</label>
                <div className="detail-value">{profileData?.specialization || 'Not set'}</div>
              </div>
              <div className="detail-group">
                <label>Working Hours</label>
                <div className="detail-value">{profileData?.workingHours || 'Not set'}</div>
              </div>
              <div className="detail-group">
                <label>Availability</label>
                <div className="detail-value">
                  <span className={`availability ${profileData?.availability === 'yes' ? 'available' : 'unavailable'}`}>
                    {profileData?.availability === 'yes' ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </>
          )}
          <div className="form-actions">
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;