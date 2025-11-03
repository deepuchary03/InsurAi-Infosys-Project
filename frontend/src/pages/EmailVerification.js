import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    verifyEmailToken(token);
  }, [searchParams]);

  const verifyEmailToken = async (token) => {
    try {
      const response = await userAPI.verifyEmail(token);

      if (response.data.success === "true" || response.data.success === true) {
        setStatus("success");
        setMessage(
          "Email verified successfully! You can now log in to your account."
        );

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(
          response.data.message ||
            "Email verification failed. The link may be invalid or expired."
        );
      }
    } catch (error) {
      setStatus("error");
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage(
          "Email verification failed. The link may be invalid or expired."
        );
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <h1 className="app-heading">InsurAI</h1>
      <div className="login-box visible">
        <div className="verification-content">
          {status === "verifying" && (
            <div className="verification-loading">
              <div className="spinner"></div>
              <h2>Verifying Email</h2>
              <p>{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="verification-success">
              <div className="success-icon">✅</div>
              <h2>Email Verified!</h2>
              <p>{message}</p>
              <p className="redirect-info">
                Redirecting to login page in 3 seconds...
              </p>
              <button className="btn" onClick={handleBackToLogin}>
                Go to Login Now
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="verification-error">
              <div className="error-icon">❌</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <div className="action-buttons">
                <button className="btn" onClick={handleBackToLogin}>
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
