// src/pages/MyJobs.jsx
import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, X, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const navigate = useNavigate();

  const fetchMyJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://10.121.52.123:8000/api/client/getmyjobs",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setJobs(response.data.jobs || response.data.data || response.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setSelectedProposal(null);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setSelectedProposal(null);
  };

  const viewProposal = async (proposalId) => {
    setProposalLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://10.121.52.123:8000/api/client/getjobproposalsbyid?proposalId=${proposalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const proposal =
        response.data.data || response.data.proposal || response.data;

      setSelectedProposal(proposal);
      setStatus(proposal.status || "");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load proposal details");
    } finally {
      setProposalLoading(false);
    }
  };

  const closeProposalModal = () => setSelectedProposal(null);

  const handleEdit = (jobId) => navigate(`/edit-job/${jobId}`);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://10.121.52.123:8000/api/client/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) closeJobModal();
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "OPEN":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
      case "ACTIVE":
        return "bg-blue-100 text-blue-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "CLOSED":
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const updateProposalStatus = async () => {
    try {
      setStatusLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.patch(
        "http://10.121.52.123:8000/api/client/updateproposalstatus",
        {
          proposalId: selectedProposal._id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Proposal status updated successfully");

      setSelectedProposal((prev) => ({
        ...prev,
        status,
      }));
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to update proposal status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Jobs</h1>
          <button
            onClick={() => navigate("/PostJob")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            <Plus size={20} />
            Post New Job
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8">
            {error}
          </div>
        )}

        {jobs.length === 0 && !error ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <p className="text-xl text-slate-500">No jobs found</p>
            <button
              onClick={() => navigate("/PostJob")}
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-slate-500 mt-1">
                      Budget: ₹{(job.budget || 0).toLocaleString()} •{" "}
                      {job.budgetType}
                    </p>
                    <span
                      className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${getStatusBadge(job.status)}`}
                    >
                      {job.status || "PENDING"}
                    </span>
                  </div>

                  <div className="flex gap-3 self-start">
                    <button
                      onClick={() => openJobDetails(job)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(job.id)}
                      className="p-3 bg-yellow-100 hover:bg-yellow-200 rounded-xl transition"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
              <button
                onClick={closeJobModal}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh] space-y-6">
              {/* ... Job details same as before ... */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500">Budget</p>
                  <p className="font-semibold text-xl">
                    ₹{parseFloat(selectedJob.budget).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedJob.budgetType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-semibold">{selectedJob.duration}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Skills Required</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 px-4 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-3">
                  Proposals Received
                </p>
                {selectedJob.Proposals?.length > 0 ? (
                  selectedJob.Proposals.map((prop, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/proposal/${prop.id}`)}
                      className="bg-slate-50 p-4 rounded-2xl mb-3 cursor-pointer hover:bg-slate-100 transition"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Proposal {i + 1}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${prop.status === "ACCEPTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-lg font-semibold mt-1">
                        Bid: ₹{parseFloat(prop.bidAmount).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No proposals yet</p>
                )}
              </div>
            </div>

            <div className="border-t p-6 flex gap-3">
              <button
                onClick={closeJobModal}
                className="flex-1 py-3 border border-slate-300 rounded-2xl font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedJob.id);
                  closeJobModal();
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PROPOSAL DETAIL MODAL (Updated) ==================== */}
      {selectedProposal && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-6">Proposal Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Freelancer Name</p>
              <p className="font-semibold">
                {selectedProposal.freelancer?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Cover Letter</p>
              <p>{selectedProposal.coverLetter}</p>
            </div>

            <div>
              <p className="text-gray-500">Bid Amount</p>
              <p className="font-semibold">₹{selectedProposal.bidAmount}</p>
            </div>

            <div>
              <p className="text-gray-500">Current Status</p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedProposal.status === "ACCEPTED"
                    ? "bg-green-100 text-green-700"
                    : selectedProposal.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedProposal.status}
              </span>
            </div>

            <div>
              <label className="block mb-2 font-medium">Update Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Status</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <button
              onClick={updateProposalStatus}
              disabled={statusLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
            >
              {statusLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
