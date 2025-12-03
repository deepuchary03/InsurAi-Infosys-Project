import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Heart,
  Car,
  Home,
  Briefcase,
  Plane,
  Users,
  Check,
  DollarSign,
} from "lucide-react";
import { policyService } from "../services/api";
import { toast } from "react-toastify";
import Aurora from "../components/Aurora";
import { getUser } from "../utils/auth";

const BrowsePolicies = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    durationMonths: 12,
  });

  const policyTemplates = [
    {
      type: "LIFE",
      name: "Life Insurance",
      icon: Heart,
      color: "purple",
      description:
        "Protect your family's financial future with comprehensive life insurance coverage",
      coverageOptions: [250000, 500000, 1000000],
      monthlyPremium: [50, 90, 150],
      benefits: [
        "Death benefit payout",
        "Critical illness rider",
        "Accidental death coverage",
        "Premium waiver on disability",
      ],
    },
    {
      type: "HEALTH",
      name: "Health Insurance",
      icon: Shield,
      color: "green",
      description:
        "Comprehensive medical coverage for you and your family with cashless hospitalization",
      coverageOptions: [100000, 300000, 500000],
      monthlyPremium: [80, 150, 250],
      benefits: [
        "Cashless hospitalization",
        "Pre and post hospitalization",
        "Day care procedures",
        "Ambulance charges",
      ],
    },
    {
      type: "AUTO",
      name: "Auto Insurance",
      icon: Car,
      color: "blue",
      description:
        "Complete protection for your vehicle with comprehensive and collision coverage",
      coverageOptions: [25000, 50000, 100000],
      monthlyPremium: [40, 70, 120],
      benefits: [
        "Collision coverage",
        "Comprehensive coverage",
        "Liability protection",
        "Roadside assistance",
      ],
    },
    {
      type: "HOME",
      name: "Home Insurance",
      icon: Home,
      color: "orange",
      description:
        "Protect your home and belongings against damages and theft",
      coverageOptions: [150000, 300000, 500000],
      monthlyPremium: [60, 110, 180],
      benefits: [
        "Property damage coverage",
        "Contents insurance",
        "Liability protection",
        "Natural disaster coverage",
      ],
    },
    {
      type: "BUSINESS",
      name: "Business Insurance",
      icon: Briefcase,
      color: "indigo",
      description:
        "Comprehensive coverage for your business assets and operations",
      coverageOptions: [100000, 250000, 500000],
      monthlyPremium: [100, 200, 350],
      benefits: [
        "Property coverage",
        "Liability protection",
        "Business interruption",
        "Workers compensation",
      ],
    },
    {
      type: "TRAVEL",
      name: "Travel Insurance",
      icon: Plane,
      color: "pink",
      description:
        "Stay protected during your travels with medical and trip coverage",
      coverageOptions: [50000, 100000, 200000],
      monthlyPremium: [30, 50, 80],
      benefits: [
        "Medical emergencies",
        "Trip cancellation",
        "Lost baggage coverage",
        "Emergency evacuation",
      ],
    },
    {
      type: "DISABILITY",
      name: "Disability Insurance",
      icon: Users,
      color: "red",
      description:
        "Income protection in case of disability or inability to work",
      coverageOptions: [50000, 100000, 150000],
      monthlyPremium: [45, 80, 130],
      benefits: [
        "Monthly income replacement",
        "Partial disability coverage",
        "Rehabilitation benefits",
        "Cost of living adjustments",
      ],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        hover: "hover:bg-purple-50",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        hover: "hover:bg-green-50",
      },
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        hover: "hover:bg-blue-50",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-orange-600",
        hover: "hover:bg-orange-50",
      },
      indigo: {
        bg: "bg-indigo-500",
        text: "text-indigo-600",
        hover: "hover:bg-indigo-50",
      },
      pink: {
        bg: "bg-pink-500",
        text: "text-pink-600",
        hover: "hover:bg-pink-50",
      },
      red: { bg: "bg-red-500", text: "text-red-600", hover: "hover:bg-red-50" },
    };
    return colors[color] || colors.blue;
  };

  const handlePurchase = (template) => {
    setSelectedPolicy(template);
    setPurchaseData({
      ...purchaseData,
      type: template.type,
      policyName: template.name,
      coverageAmount: template.coverageOptions[0],
      premium: template.monthlyPremium[0],
    });
    setShowPurchaseModal(true);
  };

  const submitPurchase = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        customerId: user.id,
        policyName: purchaseData.policyName,
        type: purchaseData.type,
        premium: purchaseData.premium,
        coverageAmount: purchaseData.coverageAmount,
        startDate: new Date().toISOString().split("T")[0],
        durationMonths: purchaseData.durationMonths,
        description: selectedPolicy.description,
        benefits: selectedPolicy.benefits.join(", "),
      };

      await policyService.purchasePolicy(requestData);
      toast.success("Policy purchased successfully!");
      setShowPurchaseModal(false);
      navigate("/policies");
    } catch (error) {
      console.error("Error purchasing policy:", error);
      toast.error("Failed to purchase policy. Please try again.");
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-2">
            Browse Insurance Policies
          </h1>
          <p className="text-gray-300">
            Choose the perfect insurance coverage for your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policyTemplates.map((template) => {
            const IconComponent = template.icon;
            const colorClasses = getColorClasses(template.color);

            return (
              <div
                key={template.type}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all"
              >
                <div className={`${colorClasses.bg} h-2`}></div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${colorClasses.bg} p-3 rounded-xl`}>
                      <IconComponent size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Starting at ${template.monthlyPremium[0]}/month
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">
                    {template.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Coverage Options:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {template.coverageOptions.map((amount, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          ${amount.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Key Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {template.benefits.slice(0, 3).map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600 text-xs"
                        >
                          <Check size={14} className="mr-2 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePurchase(template)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPolicy && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPurchaseModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Purchase {selectedPolicy.name}
            </h2>

            <form onSubmit={submitPurchase} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coverage Amount
                </label>
                <select
                  value={purchaseData.coverageAmount}
                  onChange={(e) => {
                    const index = selectedPolicy.coverageOptions.indexOf(
                      parseInt(e.target.value)
                    );
                    setPurchaseData({
                      ...purchaseData,
                      coverageAmount: parseInt(e.target.value),
                      premium: selectedPolicy.monthlyPremium[index],
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {selectedPolicy.coverageOptions.map((amount, index) => (
                    <option key={index} value={amount}>
                      ${amount.toLocaleString()} - $
                      {selectedPolicy.monthlyPremium[index]}/month
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Policy Duration
                </label>
                <select
                  value={purchaseData.durationMonths}
                  onChange={(e) =>
                    setPurchaseData({
                      ...purchaseData,
                      durationMonths: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year</option>
                  <option value={24}>2 Years</option>
                  <option value={36}>3 Years</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Monthly Premium:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${purchaseData.premium}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Coverage Amount:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${purchaseData.coverageAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Purchase Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePolicies;
