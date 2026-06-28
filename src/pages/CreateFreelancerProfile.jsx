import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Users,
  Plus,
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Languages,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const CreateFreelancerProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    skills: [],
    experience: "",
    hourlyRate: "",
    languages: [],
    country: "",
    state: "",
    city: "",
    github: "",
    linkedIn: "",
    portfolioLinks: [],
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const experienceOptions = [
    1,
    2,
    3,
    4,
  ];

  const predefinedLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Hindi",
    "Arabic",
    "Portuguese",
    "Russian",
  ];

  const predefinedSkills = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "Java",
    "PHP",
    "Vue.js",
    "Angular",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "UI/UX Design",
    "Mobile App Development",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      if (formData.skills.includes(newSkill.trim())) {
        toast.error("Skill already added");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addLanguage = (lang) => {
    if (!formData.languages.includes(lang)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, lang],
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const addPortfolioLink = () => {
    if (!newPortfolioLink.trim()) return;

    setFormData((prev) => ({
      ...prev,
      portfolioLinks: [
        ...prev.portfolioLinks,
        newPortfolioLink,
      ],
    }));

    setNewPortfolioLink("");
  }




  const removePortfolioLink = (linkToRemove) => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter(
        (link) => link !== linkToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.headline.trim() ||
      formData.skills.length === 0 ||
      !formData.experience ||
      !formData.hourlyRate ||
      !formData.country.trim() ||
      !formData.city.trim() ||
      formData.languages.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }


    if (parseFloat(formData.hourlyRate) <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Add text fields
      data.append("headline", formData.headline);
      data.append("bio", formData.bio);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("experience", formData.experience);
      data.append("hourlyRate", formData.hourlyRate);
      data.append("languages", JSON.stringify(formData.languages));
      data.append("country", formData.country);
      data.append("city", formData.city);
      data.append("github", formData.github);
      data.append("linkedIn", formData.linkedIn);

      if (formData.portfolioLinks.length > 0) {
        data.append("portfolioLinks", JSON.stringify(formData.portfolioLinks));
      }

      // Add image if selected
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      console.log("[handleSubmit] Sending request to:", `${API_BASE_URL}/api/profile/complete-freelancer-profile`);
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/complete-freelancer-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't explicitly set Content-Type, let axios handle it for FormData
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile completed successfully!");

        // Update user state with new profile_completed status
        const updatedUserData = response.data.data.user;

        // Update both localStorage and context
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        updateUser(updatedUserData);

        // Dispatch authChange event to sync all listeners
        window.dispatchEvent(new Event("authChange"));

        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          navigate("/FreelancerDashboard", { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("[handleSubmit] Error:", error);
      console.error("[handleSubmit] Error response:", error.response?.data);
      console.error("[handleSubmit] Error status:", error.response?.status);

      let message = "Failed to complete profile";

      if (error.response) {
        // Server responded with error
        if (error.response.status === 403) {
          message = error.response.data?.message || "Profile already completed";
        } else if (error.response.status === 400) {
          // Validation error
          const errors = error.response.data?.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            message = errors[0];
          } else {
            message = error.response.data?.message || "Validation failed";
          }
        } else if (error.response.status === 404) {
          message = error.response.data?.message || "User or profile not found";
        } else if (error.response.status === 500) {
          message = error.response.data?.message || "Server error occurred";
        } else {
          message = error.response.data?.message || error.message || message;
        }
      } else if (error.request) {
        // Request made but no response received
        message = "No response from server. Please check your connection.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            Complete Your Profile
          </h1>
          <p className="text-slate-600 mt-2">
            Showcase your skills and get hired faster
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-emerald-200 flex items-center justify-center">
                    <Users size={40} className="text-slate-400" />
                  </div>
                )}
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition"
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-white text-sm">✎</span>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                JPG, PNG or GIF (max 5MB)
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Headline */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g., Full Stack Developer | React & Node.js Expert"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Experience Level *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select your experience</option>
                  {experienceOptions.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="California"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about yourself, your expertise, and what makes you unique..."
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Skills *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill (e.g., React)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Suggested Skills */}
              {formData.skills.length === 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-2">
                    Popular skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSkills.slice(0, 6).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          if (!formData.skills.includes(skill)) {
                            setFormData((prev) => ({
                              ...prev,
                              skills: [...prev.skills, skill],
                            }));
                          }
                        }}
                        className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 px-3 py-1 rounded-full transition"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      <Briefcase size={14} />
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-emerald-600"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Languages *
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select a language</option>
                  {predefinedLanguages
                    .filter((lang) => !formData.languages.includes(lang))
                    .map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => addLanguage(newLanguage)}
                  disabled={!newLanguage}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Selected Languages */}
              {formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang) => (
                    <motion.div
                      key={lang}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      <Languages size={14} />
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="hover:text-emerald-600"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Portfolio Links */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Portfolio Links
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newPortfolioLink}
                  onChange={(e) =>
                    setNewPortfolioLink(e.target.value)
                  }
                  placeholder="https://your-portfolio.com"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addPortfolioLink}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Portfolio Links List */}
              {formData.portfolioLinks.length > 0 && (
                <div className="space-y-2">
                  {formData.portfolioLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-sm truncate"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => removePortfolioLink(link)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </motion.button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800">
            💡 A complete profile attracts better job opportunities. Add as
            much detail as possible to stand out from other freelancers.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateFreelancerProfile;
