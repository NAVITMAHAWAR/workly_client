// src/pages/ProposalDetails.jsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  Wallet,
  CalendarCheck,
  Coins,
  Check,
  X,
} from "lucide-react";

const getStatusBadge = (status) => {
  const map = {
    PENDING: {
      label: "Pending review",
      cls: "bg-orange-50 text-orange-700 border border-orange-200",
    },
    ACCEPTED: {
      label: "Accepted",
      cls: "bg-green-50 text-green-700 border border-green-200",
    },
    REJECTED: {
      label: "Rejected",
      cls: "bg-red-50 text-red-700 border border-red-200",
    },
  };
  const s = map[status?.toUpperCase()] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${s.cls}`}
    >
      <Clock size={12} />
      {s.label}
    </span>
  );
};

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/client/getjobproposalsbyid?proposalId=${proposalId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProposal(
          response.data?.data || response.data?.proposal || response.data
        );
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId, navigate]);

  const updateProposalStatus = async (nextStatus) => {
    if (!proposal) return;
    try {
      setStatusLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      const pid = proposal._id || proposal.id || proposal.proposalId;

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/client/updateproposalstatus`,
        { proposalId: pid, status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data?.message || "Status updated");
      setProposal((prev) => prev ? { ...prev, status: nextStatus } : prev);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-sm w-full">
          <p className="text-red-500 text-sm mb-4">{error || "Proposal not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const bidAmount = proposal.bidAmount;
  const bidText =
    bidAmount == null || bidAmount === ""
      ? "—"
      : `₹${parseFloat(bidAmount).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to my jobs
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-green-50 text-green-700 uppercase tracking-wide mb-3">
              Proposal details
            </span>
            <h1 className="text-xl font-semibold text-slate-900 leading-snug mb-1">
              {proposal.Job?.title || "Proposal"}
            </h1>
            {proposal.Job?.User?.name && (
              <p className="text-sm text-slate-500">
                Client:{" "}
                <span className="text-slate-900 font-medium">
                  {proposal.Job.User.name}
                </span>
              </p>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6">

            {/* Status + ID row */}
            <div className="flex items-center justify-between mb-6">
              {getStatusBadge(proposal.status)}
              <span className="text-xs text-slate-400">
                ID: #{proposal.id || proposal._id}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <Coins size={18} className="text-blue-500 mb-2" />
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Client bid
                </p>
                <p className="text-xl font-bold text-slate-900">{bidText}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <Wallet size={18} className="text-green-500 mb-2" />
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Job budget
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {proposal.Job?.budget
                    ? `₹${Number(proposal.Job.budget).toLocaleString("en-IN")}`
                    : "—"}
                </p>
              </div>

              {proposal.deliveryDays && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <CalendarCheck size={18} className="text-amber-500 mb-2" />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                    Delivery
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {proposal.deliveryDays} days
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 mb-6" />

            {/* Cover letter */}
            {proposal.coverLetter && (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Cover letter
                </p>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                  {proposal.coverLetter}
                </div>
              </>
            )}

            {/* Details */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-400 mb-1">Freelancer ID</p>
                <p className="text-sm font-semibold text-slate-900">
                  {proposal.freelancerId || "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-400 mb-1">Job ID</p>
                <p className="text-sm font-semibold text-slate-900">
                  {proposal.jobId || "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 col-span-2">
                <p className="text-xs text-slate-400 mb-1">Submitted on</p>
                <p className="text-sm font-semibold text-slate-900">
                  {proposal.createdAt
                    ? new Date(proposal.createdAt).toLocaleString("en-IN")
                    : "—"}
                </p>
              </div>
            </div>

          </div>

          {/* Accept / Reject */}
          <div className="grid grid-cols-2 gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => updateProposalStatus("ACCEPTED")}
              disabled={statusLoading}
              className="h-11 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Check size={15} />
              {statusLoading ? "Updating..." : "Accept proposal"}
            </button>
            <button
              onClick={() => updateProposalStatus("REJECTED")}
              disabled={statusLoading}
              className="h-11 rounded-xl bg-white hover:bg-red-50 disabled:opacity-60 text-red-600 text-sm font-semibold border border-red-200 transition flex items-center justify-center gap-2"
            >
              <X size={15} />
              Reject proposal
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-slate-100">
            <button
              onClick={() => navigate(-1)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Go back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;