import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { policyService } from "../services/api";
import { toast } from "react-toastify";
import Aurora from "../components/Aurora";
import { getUser } from "../utils/auth";

const Policies = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (user) {
      fetchPolicies();
    }
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyService.getPoliciesByCustomer(user.id);
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPolicy = async (policyId) => {
    if (!window.confirm("Are you sure you want to cancel this policy?")) {
      return;
    }

    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      await policyService.cancelPolicy(policyId, reason);
      toast.success("Policy cancelled successfully");
      fetchPolicies();
    } catch (error) {
      console.error("Error cancelling policy:", error);
      toast.error("Failed to cancel policy");
    }
  };

  const getPolicyTypeColor = (type) => {
    const colors = {
      LIFE: "bg-purple-500",
      HEALTH: "bg-green-500",
      AUTO: "bg-blue-500",
      HOME: "bg-orange-500",
      BUSINESS: "bg-indigo-500",
      TRAVEL: "bg-pink-500",
      DISABILITY: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      INACTIVE: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      EXPIRED: { color: "bg-red-100 text-red-800", icon: XCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Calendar },
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <IconComponent size={14} />
        {status}
      </span>
    );
  };

  const filteredPolicies = policies.filter(
    (policy) => filter === "ALL" || policy.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Insurance Policies</h1>
          <p className="text-gray-300">Manage and view all your insurance policies</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["ALL", "ACTIVE", "PENDING", "EXPIRED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === status
                  ? "bg-primary-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Policies Grid */}
        {filteredPolicies.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center">
            <Shield size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Policies Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "ALL"
                ? "You don't have any insurance policies yet."
                : `No policies with status: ${filter}`}
            </p>
            <button
              onClick={() => navigate("/browse-policies")}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Browse Available Policies
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all"
              >
                <div className={`${getPolicyTypeColor(policy.type)} h-2`}></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {policy.policyName}
                      </h3>
                      <p className="text-sm text-gray-500">{policy.policyNumber}</p>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Shield size={18} className="mr-2 text-gray-400" />
                      <span className="text-sm">
                        Coverage: ${policy.coverageAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign size={18} className="mr-2 text-gray-400" />
                      <span className="text-sm">
                        Premium: ${policy.premium.toLocaleString()}/month
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar size={18} className="mr-2 text-gray-400" />
                      <span className="text-sm">
                        {new Date(policy.startDate).toLocaleDateString()} -{" "}
                        {new Date(policy.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {policy.agentName && (
                      <div className="flex items-center text-gray-700">
                        <FileText size={18} className="mr-2 text-gray-400" />
                        <span className="text-sm">Agent: {policy.agentName}</span>
                      </div>
                    )}
                  </div>

                  {policy.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {policy.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/policies/${policy.id}`)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                    >
                      View Details
                    </button>
                    {policy.status === "ACTIVE" && (
                      <button
                        onClick={() => handleCancelPolicy(policy.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
