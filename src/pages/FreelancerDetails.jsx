import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAPI } from "../services/api";
import MessageButton from "../components/MessageButton";
import {
  MapPin,
  Star,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  Award,
  ExternalLink,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";

export default function FreelancerDetails() {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState([])
  const [completedJobs, setCompletedJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");


  useEffect(() => {
    fetchFreelancerDetails();
  }, [freelancerId]);

  const fetchFreelancerDetails = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getFreelancerById(freelancerId);
      setFreelancer(response.data.freelancer);
      setPortfolio(response.data.portfolio || []);
      setReviews(response.data.reviews || []);
      setCompletedJobs(response.data.completedJobs || 0);
      setAverageRating(response.data.
        averageRating
      )
    } catch (error) {
      console.error(error);
      toast.error("Failed to load freelancer details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  console.log(averageRating)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading freelancer profile...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-500">Freelancer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${freelancer.profile_image}` || "https://via.placeholder.com/150"}
              alt={freelancer.name}
              className="absolute bottom-0 left-8 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>

          {/* Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900">
                  {freelancer.name}
                </h1>
                <p className="text-2xl text-indigo-600 font-semibold mt-2">
                  {freelancer.title}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-600 mt-3">
                  <MapPin size={18} />
                  <span>
                    {freelancer.city}, {freelancer.country}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${i < Math.round(Number(averageRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>

                  <span className="font-semibold">
                    {Number(averageRating).toFixed(1)}
                  </span>

                  <span className="text-slate-600">
                    ({reviews?.length || 0} {reviews?.length === 1 ? "Review" : "Reviews"})
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-6">
                  <div>
                    <p className="text-slate-600 text-sm">Completed Jobs</p>
                    <p className="text-2xl font-bold">{completedJobs}</p>
                  </div>

                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <MessageButton freelancerId={parseInt(freelancerId)} />
                <button
                  onClick={() => navigate("/PostJob")}
                  className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <Briefcase size={18} />
                  Hire Freelancer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300">
          {["overview", "portfolio", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition ${activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed">
                {freelancer.bio || "No bio provided"}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Placeholder skills - in real app these would come from DB */}
                {["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS", "REST APIs"].map(
                  (skill, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-50 border border-indigo-200 px-4 py-3 rounded-lg text-indigo-700 font-medium"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-3">
                {freelancer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="text-indigo-600" size={20} />
                    <span>{freelancer.email}</span>
                  </div>
                )}
                {freelancer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-indigo-600" size={20} />
                    <span>{freelancer.phone}</span>
                  </div>
                )}
                {freelancer.portfolioWebsite && (
                  <div className="flex items-center gap-3">
                    <Globe className="text-indigo-600" size={20} />
                    <a
                      href={freelancer.portfolioWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Portfolio Website
                    </a>
                  </div>
                )}
                {freelancer.github && (
                  <div className="flex items-center gap-3">
                    <Github className="text-indigo-600" size={20} />
                    <a
                      href={freelancer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {freelancer.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="text-indigo-600" size={20} />
                    <a
                      href={freelancer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
            {portfolio.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No portfolio items yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="border rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-slate-600 text-sm mt-1">
                        {item.description}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline text-sm font-medium mt-2 flex items-center gap-1"
                        >
                          View Live <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold">{review.clientName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-slate-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
