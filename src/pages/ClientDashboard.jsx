import { useEffect, useState } from "react";
import {
  Search,
  Code,
  PenTool,
  Video,
  Palette,
  ArrowRight,
  TrendingUp,
  Briefcase,
  CheckCircle,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { clientAPI } from "../services/api";

export default function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getClientDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <AlertCircle className="text-red-600 mb-2" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {};
  const activeContracts = dashboardData?.activeContracts || [];
  const recentProposals = dashboardData?.recentProposals || [];
  const topFreelancers = dashboardData?.topFreelancers || [];

  const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 text-${color}-600`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <Icon className={`text-${color}-600`} size={32} />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Client Dashboard</h1>
          <p className="text-indigo-100">Manage your projects, contracts, and team</p>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Briefcase}
            label="Total Jobs"
            value={stats.totalJobs || 0}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Open Jobs"
            value={stats.openJobs || 0}
            color="yellow"
          />
          <StatCard
            icon={Users}
            label="Active Contracts"
            value={stats.activeContracts || 0}
            color="green"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completedJobs || 0}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            label="Finished Contracts"
            value={stats.completedContracts || 0}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={`₹${stats.totalSpent?.toLocaleString("en-IN") || 0}`}
            color="indigo"
          />
        </div>
      </section>

      {/* Active Contracts */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Contracts</h2>
          <Link
            to="/my-contracts"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {activeContracts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {activeContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {contract.freelancer.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {contract.freelancer.title}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    {contract.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-indigo-600">
                      ₹{contract.amount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="text-sm">
                      {contract.dueDate
                        ? new Date(contract.dueDate).toLocaleDateString("en-IN")
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(contract)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No active contracts yet</p>
            <Link
              to="/BrowseJobs"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Find Freelancers
            </Link>
          </div>
        )}
      </section>

      {/* Recent Proposals */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Recent Proposals</h2>

        {recentProposals.length > 0 ? (
          <div className="space-y-4">
            {recentProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{proposal.jobTitle}</h3>
                    <p className="text-gray-600">
                      From: {proposal.freelancer.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${proposal.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : proposal.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {proposal.coverLetter?.substring(0, 100)}...
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600">
                    ₹{proposal.bidAmount?.toLocaleString("en-IN")}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(proposal.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No proposals received yet</p>
          </div>
        )}
      </section>

      {/* Top Freelancers */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Your Top Freelancers</h2>

        {topFreelancers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center"
              >
                {/* Profile Image */}
                <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full border-4 border-indigo-100">
                  <img
                    src={
                      freelancer.profile_image
                        ? `${import.meta.env.VITE_API_BASE_URL}${freelancer.profile_image}`
                        : "/default-avatar.png"
                    }
                    alt={freelancer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-slate-800">
                  {freelancer.name}
                </h3>

                {/* Title */}
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                  {freelancer.title}
                </p>

                {/* Rating */}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No freelancers worked with yet</p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/PostJob"
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition text-center"
          >
            <Briefcase className="mx-auto text-indigo-600 mb-4" size={40} />
            <h3 className="font-bold text-lg">Post a Job</h3>
            <p className="text-gray-600 text-sm mt-2">
              Create a new job posting and find talent
            </p>
          </Link>

          <Link
            to="/freelancers"
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition text-center"
          >
            <Search className="mx-auto text-green-600 mb-4" size={40} />
            <h3 className="font-bold text-lg">Browse Freelancers</h3>
            <p className="text-gray-600 text-sm mt-2">
              Discover and hire top talent
            </p>
          </Link>

          <Link
            to="/MyJobs"
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition text-center"
          >
            <TrendingUp className="mx-auto text-purple-600 mb-4" size={40} />
            <h3 className="font-bold text-lg">My Jobs</h3>
            <p className="text-gray-600 text-sm mt-2">
              Manage and track your job postings
            </p>
          </Link>
        </div>
      </section>

      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedContract.freelancer.name}
                </h2>
                <p className="text-indigo-100">
                  {selectedContract.freelancer.title}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-3xl hover:rotate-90 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Contract Amount</p>
                  <p className="text-xl font-bold text-indigo-600">
                    ₹{selectedContract.amount?.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Status</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    {selectedContract.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Start Date</p>
                  <p>
                    {selectedContract.startDate
                      ? new Date(selectedContract.startDate).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Due Date</p>
                  <p>
                    {selectedContract.dueDate
                      ? new Date(selectedContract.dueDate).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>

              </div>

              {selectedContract.job?.title && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Job Title</p>
                  <h3 className="font-bold text-lg">
                    {selectedContract.job.title}
                  </h3>
                </div>
              )}

              {selectedContract.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600 leading-7">
                    {selectedContract.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-5 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
