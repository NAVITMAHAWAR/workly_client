import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientAPI } from "../services/api";
import {
  Search,
  MapPin,
  Star,
  Briefcase,
  MessageCircle,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";

export default function FreelancersList() {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getFreelancers();
      const freelancersData = response.data.freelancers || response.data.data || [];
      setFreelancers(freelancersData);
      setFilteredFreelancers(freelancersData);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load freelancers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = freelancers.filter(
        (freelancer) =>
          freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          freelancer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          freelancer.country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFreelancers(filtered);
    } else {
      setFilteredFreelancers(freelancers);
    }
  }, [searchTerm, freelancers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading freelancers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Hire Freelancers</h1>
          <p className="text-slate-600 mt-2">
            {filteredFreelancers.length} talented freelancers available
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, skill, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Freelancers Grid */}
        {filteredFreelancers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-slate-500">No freelancers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Header with Avatar */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-24 relative">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${freelancer.profile_image} ` || "https://via.placeholder.com/150"}
                    alt={freelancer.name}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                </div>

                {/* Content */}
                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {freelancer.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mt-1">
                    {freelancer.title || "Freelancer"}
                  </p>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 text-slate-600 mt-2">
                    <MapPin size={16} />
                    <span className="text-sm">
                      {freelancer.city}, {freelancer.country}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                    {freelancer.bio || "No bio available"}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {freelancer.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills?.length > 3 && (
                      <span className="text-slate-500 text-xs">
                        +{freelancer.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Rating (if available) */}
                  <div className="flex items-center justify-center gap-1 mt-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < Math.round(Number(freelancer.averageRating || 0))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>

                    <span className="text-sm text-slate-600 ml-2">
                      ({Number(freelancer.averageRating || 0).toFixed(1)}) •{" "}
                      {freelancer.totalReviews || 0}{" "}
                      {(freelancer.totalReviews || 0) === 1 ? "Review" : "Reviews"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        navigate(`/freelancer-detail/${freelancer.id}`)
                      }
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
                    >
                      <Briefcase size={16} />
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/freelancer-detail/${freelancer.id}?tab=contact`
                        )
                      }
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
