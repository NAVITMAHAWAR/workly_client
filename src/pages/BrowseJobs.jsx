import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { freelancerAPI } from "../services/api";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Award,
  ChevronRight,
  Loader,
  Heart,
} from "lucide-react";
import { toast } from "react-toastify";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [proposalJob, setProposalJob] = useState(null);
  const [detailsJob, setDetailsJob] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const handleViewJob = (job) => {
    setDetailsJob(job);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await freelancerAPI.getJobs();
      const jobsData = response.data.jobs || response.data.data || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await freelancerAPI.getSavedJobs();
      const jobIds = response.data.jobs?.map(item => item.jobId) || [];
      setSavedJobs(new Set(jobIds));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      if (savedJobs.has(jobId)) {
        await freelancerAPI.unsaveJob(jobId);
        const newSet = new Set(savedJobs);
        newSet.delete(jobId);
        setSavedJobs(newSet);
        toast.success("Job unsaved");
      } else {
        await freelancerAPI.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const isSaved = (jobId) => savedJobs.has(jobId);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((job) => job.category === categoryFilter);
    }

    // Budget filter
    if (budgetFilter === "low") {
      filtered = filtered.filter((job) => job.budget < 5000);
    } else if (budgetFilter === "mid") {
      filtered = filtered.filter((job) => job.budget >= 5000 && job.budget < 20000);
    } else if (budgetFilter === "high") {
      filtered = filtered.filter((job) => job.budget >= 20000);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, categoryFilter, budgetFilter, jobs]);

  const handleSubmitProposal = async () => {
    if (!bidAmount || !coverLetter || !deliveryDays) {
      toast.error("Please fill in all fields");
      return;
    }

    const days = parseInt(deliveryDays);
    if (isNaN(days) || days < 1 || days > 365) {
      toast.error("Delivery days must be between 1 and 365");
      return;
    }

    try {
      setSubmittingProposal(true);
      await freelancerAPI.createProposal({
        jobId: proposalJob.id,
        bidAmount: parseFloat(bidAmount),
        coverLetter,
        deliveryDays: days,
      });
      toast.success("Proposal submitted successfully!");
      navigate("/my-proposals")
      setProposalJob(null);
      setBidAmount("");
      setCoverLetter("");
      setDeliveryDays("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit proposal");
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading available jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Available Jobs</h1>
          <p className="text-slate-600 mt-2">
            {filteredJobs.length} jobs matching your search
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
            </select>

            {/* Budget Filter */}
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Budgets</option>
              <option value="low">Under ₹5,000</option>
              <option value="mid">₹5,000 - ₹20,000</option>
              <option value="high">Above ₹20,000</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setBudgetFilter("");
              }}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-slate-500">
              No jobs found matching your criteria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h2>
                        <p className="text-slate-600 mt-2 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${job.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {job.status || "OPEN"}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills?.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 4 && (
                        <span className="text-slate-500 text-sm">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 mt-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>₹{job.budget?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{job.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={16} />
                        <span>{job.experienceLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-3 justify-between">
                    <button
                      onClick={() => setProposalJob(job)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
                    >
                      Submit Proposal <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={(e) => handleSaveJob(job.id, e)}
                      className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                      title={isSaved(job.id) ? "Unsave job" : "Save job"}
                    >
                      <Heart
                        size={18}
                        fill={isSaved(job.id) ? "currentColor" : "none"}
                        color={isSaved(job.id) ? "#ef4444" : "#9ca3af"}
                      />
                      {isSaved(job.id) ? "Saved" : "Save Job"}
                    </button>
                    <button
                      onClick={() => handleViewJob(job)}
                      className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proposal Modal */}
     {proposalJob && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl">

      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-8 text-white">

        <button
          onClick={() => setProposalJob(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-2xl"
        >
          ×
        </button>

        <p className="uppercase tracking-[4px] text-indigo-200 text-sm">
          Submit Proposal
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {proposalJob.title}
        </h2>

        <p className="text-indigo-100 mt-2 max-w-2xl">
          Write a compelling proposal that explains your experience,
          approach and why you're the right freelancer for this project.
        </p>

      </div>

      {/* Body */}
      <div className="p-8 space-y-8">

        {/* Project Info */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="rounded-2xl bg-indigo-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Budget
            </p>

            <h3 className="mt-2 text-xl font-bold text-indigo-700">
              ₹{Number(proposalJob.budget).toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Duration
            </p>

            <h3 className="mt-2 font-bold text-green-700">
              {proposalJob.duration}
            </h3>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Experience
            </p>

            <h3 className="mt-2 font-bold text-orange-600">
              {proposalJob.experienceLevel}
            </h3>
          </div>

          <div className="rounded-2xl bg-sky-50 p-5">
            <p className="text-xs uppercase text-slate-500">
              Category
            </p>

            <h3 className="mt-2 font-bold text-sky-700">
              {proposalJob.category}
            </h3>
          </div>

        </div>

        {/* Bid & Delivery */}
        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block font-semibold mb-2">
              Your Bid Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-3 text-lg font-bold text-slate-500">
                ₹
              </span>

              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Delivery Days
            </label>

            <input
              type="number"
              min="1"
              max="365"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

          </div>

        </div>

        {/* Cover Letter */}
        <div>

          <div className="flex justify-between mb-2">

            <label className="font-semibold">
              Cover Letter
            </label>

            <span className="text-sm text-slate-500">
              {coverLetter.length}/1000
            </span>

          </div>

          <textarea
            rows={8}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Hi, I have worked on similar projects before. Explain your experience, your development process, estimated timeline and why the client should hire you..."
            className="w-full rounded-2xl border border-slate-300 p-5 resize-none outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-sm text-slate-500 mt-2">
            A detailed proposal increases your chances of getting hired.
          </p>

        </div>

        {/* Skills */}
        {proposalJob.skills?.length > 0 && (

          <div>

            <h3 className="font-semibold mb-3">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2">

              {proposalJob.skills.map((skill, index) => (

                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        )}

      </div>

      {/* Footer */}
      <div className="border-t bg-slate-50 px-8 py-6 flex justify-end gap-4">

        <button
          onClick={() => setProposalJob(null)}
          className="px-8 py-3 rounded-xl border border-slate-300 hover:bg-white font-semibold transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmitProposal}
          disabled={submittingProposal}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold transition disabled:opacity-50"
        >
          {submittingProposal ? (
            <div className="flex items-center gap-2">
              <Loader size={18} className="animate-spin" />
              Submitting...
            </div>
          ) : (
            "Submit Proposal"
          )}
        </button>

      </div>

    </div>
  </div>
)}

      {detailsJob  && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {detailsJob.title}
                </h2>
                <p className="text-indigo-100 mt-1">
                  Posted by {detailsJob.User?.name}
                </p>
              </div>

              <button
                onClick={() => setDetailsJob(null)}
                className="text-3xl hover:rotate-90 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Budget</p>
                  <h3 className="font-bold text-indigo-600 text-lg">
                    ₹{Number(detailsJob.budget).toLocaleString("en-IN")}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Budget Type</p>
                  <h3 className="font-semibold">
                    {detailsJob.budgetType}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Experience</p>
                  <h3 className="font-semibold">
                    {detailsJob.experienceLevel}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Duration</p>
                  <h3 className="font-semibold">
                    {detailsJob.duration}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Category</p>
                  <h3 className="font-semibold">
                    {detailsJob.category}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Status</p>
                  <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                    {detailsJob.status}
                  </span>
                </div>

              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Job Description
                </h3>

                <p className="text-slate-600 leading-7">
                  {detailsJob.description}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-bold text-lg mb-3">
                  Required Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {detailsJob.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t">

                <button
                 onClick={() => setDetailsJob(null)}
                  className="px-6 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
                >
                  Close
                </button>

                <button
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Apply Now
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
