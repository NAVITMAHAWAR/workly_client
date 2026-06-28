import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  IndianRupee,
  Star,
  Bell,
  Loader,
} from "lucide-react";
import { useEffect, useState } from "react";
import { freelancerAPI } from "../services/api";
import { toast } from "react-toastify";

export default function FreelancerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats and contracts
      const dashboardResponse = await freelancerAPI.getFreelancerDashboard();
      setDashboardData(dashboardResponse.data.data);

      // Fetch recent notifications
      const notificationsResponse = await freelancerAPI.getNotifications(5, 0);
      setNotifications(notificationsResponse.data.data.notifications || []);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error loading dashboard</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats ? [
    {
      title: "Active Contracts",
      value: dashboardData.stats.activeContracts,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Proposals",
      value: dashboardData.stats.totalProposals,
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Earnings",
      value: `₹${(dashboardData.stats.totalEarnings || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-green-500",
    },
    {
      title: "Rating",
      value: dashboardData.stats.averageRating || "0",
      icon: Star,
      color: "bg-yellow-500",
    },
  ] : [];

  const activeContracts = dashboardData?.activeContracts || [];
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome 👋</h1>
          <p className="text-gray-500">
            Manage your freelance work here.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow p-5"
            >
              <div
                className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
              >
                <Icon size={22} />
              </div>

              <p className="text-gray-500">{item.title}</p>

              <h2 className="text-2xl font-bold mt-2">
                {item.value}
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Active Contracts */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-bold text-lg mb-4">
            Active Contracts
          </h2>

          {activeContracts.length > 0 ? (
            <div className="space-y-3">
              {activeContracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-3 hover:bg-slate-50 transition">
                  <h3 className="font-semibold">{contract.jobTitle}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{contract.amount?.toLocaleString()} • {contract.status}
                  </p>
                  {contract.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {new Date(contract.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active contracts</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <Bell size={20} />
            Recent Notifications
          </h2>

          {recentNotifications.length > 0 ? (
            <ul className="space-y-3 text-gray-600">
              {recentNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-2 rounded ${
                    notification.isRead
                      ? "bg-gray-50"
                      : "bg-indigo-50 border-l-4 border-indigo-600"
                  }`}
                >
                  <p className="font-semibold text-sm">{notification.title}</p>
                  <p className="text-xs">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}