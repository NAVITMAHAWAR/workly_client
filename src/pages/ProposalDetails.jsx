// src/pages/ProposalDetails.jsx
// src/pages/ProposalDetails.jsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, User } from "lucide-react";

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
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://10.121.52.123:8000/api/client/getjobproposalsbyid?proposalId=${proposalId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setProposal(
          response.data?.data || response.data?.proposal || response.data,
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
      if (!token) {
        navigate("/login");
        return;
      }

      const pid = proposal._id || proposal.id || proposal.proposalId;

      const response = await axios.patch(
        "http://10.121.52.123:8000/api/client/updateproposalstatus",
        {
          proposalId: pid,
          status: nextStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(response.data?.message || "Proposal status updated");
      setProposal((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update proposal status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl text-center">
          <p className="text-red-600">{error || "Proposal not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const bidAmount = proposal.bidAmount;
  const bidText =
    bidAmount === undefined || bidAmount === null || bidAmount === ""
      ? ""
      : `₹${parseFloat(bidAmount).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to My Jobs
        </button>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-green-600 text-white p-8">
            <h1 className="text-3xl font-bold">Proposal Details</h1>
            <p className="text-green-100 mt-2">
              Proposal ID: #{proposal.id || proposal._id}
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-green-50 p-6 rounded-2xl">
              <p className="text-green-700 font-semibold text-lg">Status</p>
              <p className="text-4xl font-bold mt-1">{bidText}</p>
              <p className="text-lg font-medium text-green-600 mt-1">
                {proposal.status}
              </p>
            </div>

            {proposal.deliveryDays && (
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl">
                <Calendar size={28} className="text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Delivery Time</p>
                  <p className="font-semibold text-xl">
                    {proposal.deliveryDays} Days
                  </p>
                </div>
              </div>
            )}

            {proposal.coverLetter && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User size={22} /> Cover Letter
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {proposal.coverLetter}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-500">Freelancer ID</p>
                <p className="font-medium">{proposal.freelancerId}</p>
              </div>
              <div>
                <p className="text-slate-500">Job ID</p>
                <p className="font-medium">{proposal.jobId}</p>
              </div>
              <div>
                <p className="text-slate-500">Created At</p>
                <p className="font-medium">
                  {proposal.createdAt
                    ? new Date(proposal.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => updateProposalStatus("ACCEPTED")}
                disabled={statusLoading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-2xl font-medium transition"
              >
                {statusLoading ? "Updating..." : "Accept"}
              </button>
              <button
                onClick={() => updateProposalStatus("REJECTED")}
                disabled={statusLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-2xl font-medium transition"
              >
                Reject
              </button>
            </div>
          </div>

          <div className="border-t p-6 flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-slate-300 rounded-2xl font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
