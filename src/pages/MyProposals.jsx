import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { freelancerAPI } from "../services/api";
import {
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Eye,
  X,
  Briefcase,
  Search
} from "lucide-react";
import { toast } from "react-toastify";

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await freelancerAPI.getMyProposals();
      const proposalsData = response.data.proposals || response.data.data || [];
      setProposals(proposalsData);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock size={14} />
            Pending
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle size={14} />
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle size={14} />
            Rejected
          </span>
        );
      default:
        return <span className="text-slate-500 text-sm">{status}</span>;
    }
  };

  const filteredProposals = proposals.filter(
    (proposal) =>
      filterStatus === "all" ||
      proposal.status?.toUpperCase() === filterStatus.toUpperCase()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading your proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">My Proposals</h1>
          <p className="text-slate-600 mt-2">
            Track all your submitted proposals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex gap-4 flex-wrap">
          {["all", "pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {status === "all" ? "All Proposals" : status}
              {status !== "all" && (
                <span className="ml-2">
                  ({proposals.filter((p) => p.status?.toUpperCase() === status.toUpperCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-600 text-sm">Total Proposals</p>
            <p className="text-3xl font-bold mt-2">{proposals.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {proposals.filter((p) => p.status?.toUpperCase() === "PENDING").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-600 text-sm">Accepted</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {proposals.filter((p) => p.status?.toUpperCase() === "ACCEPTED").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-600 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {proposals.filter((p) => p.status?.toUpperCase() === "REJECTED").length}
            </p>
          </div>
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-slate-500">
              {filterStatus === "all"
                ? "You haven't submitted any proposals yet"
                : `No ${filterStatus} proposals`}
            </p>
            <button
              onClick={() => navigate("/browse-jobs")}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      {proposal.Job?.title || "Job Title"}
                    </h2>
                    <p className="text-slate-600 mt-2 line-clamp-2">
                      {proposal.Job?.description || "Job description"}
                    </p>

                    {/* Proposal Details */}
                    <div className="flex flex-wrap gap-6 mt-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>Bid: ₹{proposal.bidAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Submitted:{" "}
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>{proposal.deliveryDays} days delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-end">
                    {getStatusBadge(proposal.status)}
                    <button
                      onClick={() => setSelectedProposal(proposal)}
                      className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proposal Details Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/25 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">

            {/* Header */}
            <div className="bg-white px-7 py-6 border-b border-slate-100 flex justify-between items-start gap-4">
              <div>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-blue-50 text-blue-500 uppercase tracking-wide mb-2">
                  Proposal
                </span>
                <h2 className="text-xl font-semibold text-slate-900 leading-snug mb-1">
                  {selectedProposal.Job?.title}
                </h2>
                <p className="text-sm text-slate-500">
                  Client: <span className="text-slate-900 font-medium">{selectedProposal.Job?.User?.name}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedProposal(null)}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 max-h-[420px] overflow-y-auto bg-white">

              {/* Status Badge */}
              <div className="mb-5">
                {getStatusBadge(selectedProposal.status)}
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <DollarSign className="text-blue-500 mb-2" size={18} />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Your bid</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{Number(selectedProposal.bidAmount).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <Briefcase className="text-green-500 mb-2" size={18} />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Budget</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{Number(selectedProposal.Job?.budget).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <Clock className="text-orange-500 mb-2" size={18} />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Delivery</p>
                  <p className="text-xl font-bold text-slate-900">
                    {selectedProposal.deliveryDays} days
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 mb-6" />

              {/* Cover Letter */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Your proposal
              </p>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm text-slate-600 leading-relaxed mb-6">
                {selectedProposal.coverLetter}
              </div>

              {/* Job Details */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Job details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1">Budget type</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProposal.Job?.budgetType}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1">Job status</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProposal.Job?.status}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1">Submitted</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedProposal.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1">Proposal ID</p>
                  <p className="text-sm font-semibold text-slate-900">#{selectedProposal.id}</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProposal(null)}
                className="px-5 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedProposal(null);
                  navigate("/browse-jobs");
                }}
                className="px-5 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition flex items-center gap-2"
              >
                <Search size={15} />
                Browse more jobs
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
