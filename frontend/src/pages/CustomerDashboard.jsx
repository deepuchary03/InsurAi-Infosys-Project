import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { appointmentService, agentService, policyService } from "../services/api";
import { getUser } from "../utils/auth";
import { Calendar, Clock, User, TrendingUp, Shield } from "lucide-react";
import { formatDateTime } from "../utils/dateFormatter";
import { appointmentStatusColors } from "../utils/constants";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, agentsRes, policiesRes] = await Promise.all([
        appointmentService.getCustomerAppointments(user.id),
        agentService.getTopAgents(),
        policyService.getPoliciesByCustomer(user.id),
      ]);
      setAppointments(appointmentsRes.data);
      setAgents(agentsRes.data);
      setPolicies(policiesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(
      (apt) =>
        new Date(apt.appointmentDateTime) > new Date() &&
        apt.status !== "CANCELLED" &&
        apt.status !== "COMPLETED"
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Upcoming",
      value: appointments.filter(
        (a) =>
          new Date(a.appointmentDateTime) > new Date() &&
          a.status !== "CANCELLED" &&
          a.status !== "COMPLETED"
      ).length,
      icon: Clock,
      color: "bg-green-500",
    },
    {
      label: "Active Policies",
      value: policies.filter((p) => p.status === "ACTIVE").length,
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      label: "Available Agents",
      value: agents.length,
      icon: User,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user.fullName}!
          </h1>
          <p className="text-white/80 mt-1">
            Manage your insurance needs in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/book-appointment" className="btn btn-primary">
              Book Appointment
            </Link>
            <Link to="/browse-policies" className="btn btn-primary">
              Browse Policies
            </Link>
            <Link to="/agents" className="btn btn-secondary">
              View All Agents
            </Link>
            <Link to="/ai-assistant" className="btn btn-secondary">
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* My Policies */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              My Policies
            </h2>
            <Link
              to="/policies"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {policies.length === 0 ? (
            <div className="text-center py-8">
              <Shield size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No policies yet</p>
              <Link to="/browse-policies" className="btn btn-primary inline-block">
                Browse Available Policies
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.slice(0, 3).map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {policy.policyName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {policy.type} • ${policy.monthlyPremium}/month
                      </p>
                      <p className="text-sm text-gray-500">
                        Coverage: ${policy.coverageAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      policy.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : policy.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : policy.status === "EXPIRED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No upcoming appointments
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.agentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.agentSpecialization}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(appointment.appointmentDateTime)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointmentStatusColors[appointment.status]
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          {upcomingAppointments.length > 0 && (
            <Link
              to="/appointments"
              className="block text-center text-primary-600 hover:text-primary-700 mt-4"
            >
              View all appointments →
            </Link>
          )}
        </div>

        {/* Top Agents */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top Rated Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.slice(0, 3).map((agent) => (
              <div
                key={agent.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="text-primary-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {agent.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {agent.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp size={14} className="text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {agent.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({agent.totalAppointments} sessions)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
