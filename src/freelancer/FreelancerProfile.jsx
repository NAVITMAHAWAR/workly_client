import { useEffect, useState } from "react";
import { MapPin, X, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../services/api";

export default function FreelancerProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    skills: [],
    experience: "",
    hourlyRate: "",
    languages: [],
    country: "",
    city: "",
    github: "",
    linkedIn: "",
    portfolioLinks: [],
  });

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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getFreelancerProfile();
      setProfile(response.data.data);
      console.log(profile)
      populateFormData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (profileData) => {
    let portfolioLinks = [];
    if (profileData.FreelancerProfile?.portfolioWebsite) {
      try {
        if (typeof profileData.FreelancerProfile.portfolioWebsite === "string") {
          // Try to parse as JSON array first
          if (profileData.FreelancerProfile.portfolioWebsite.startsWith("[")) {
            portfolioLinks = JSON.parse(profileData.FreelancerProfile.portfolioWebsite);
          } else {
            // If it's a single URL string, wrap it in an array
            portfolioLinks = [profileData.FreelancerProfile.portfolioWebsite];
          }
        } else if (Array.isArray(profileData.FreelancerProfile.portfolioWebsite)) {
          portfolioLinks = profileData.FreelancerProfile.portfolioWebsite;
        }
      } catch (error) {
        console.error("Error parsing portfolio links:", error);
        // If parsing fails, treat as a single URL
        portfolioLinks = [profileData.FreelancerProfile.portfolioWebsite];
      }
    }

    setFormData({
      headline: profileData.title || "",
      bio: profileData.bio || "",
      skills: profileData.FreelancerProfile?.skills || [],
      experience: profileData.FreelancerProfile?.experienceYears || "",
      hourlyRate: profileData.hourly_rate || "",
      languages: profileData.FreelancerProfile?.languages || [],
      country: profileData.country || "",
      city: profileData.city || "",
      github: profileData.FreelancerProfile?.github || "",
      linkedIn: profileData.FreelancerProfile?.linkedin || "",
      portfolioLinks: portfolioLinks,
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = (lang) => {
    if (!formData.languages.includes(lang)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, lang],
      }));
    }
  };

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim()) {
      setFormData((prev) => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, newPortfolioLink.trim()],
      }));
      setNewPortfolioLink("");
    }
  };

  const removePortfolioLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.headline.trim()) {
        toast.error("Headline is required");
        return;
      }
      if (formData.skills.length === 0) {
        toast.error("At least one skill is required");
        return;
      }
      if (!formData.country.trim()) {
        toast.error("Country is required");
        return;
      }
      if (!formData.city.trim()) {
        toast.error("City is required");
        return;
      }

      const data = new FormData();
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
      data.append("portfolioLinks", JSON.stringify(formData.portfolioLinks));

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await profileAPI.updateFreelancerProfile(data);

      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        updateUser(updatedUser);
        setProfile(updatedUser);
        setEditing(false);
        setProfileImage(null);
        setImagePreview(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    populateFormData(profile);
    setProfileImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold text-red-600">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      {/* Premium Banner */}
      <div className="h-64 bg-gradient-to-r from-slate-950 via-indigo-900 to-purple-800"></div>

      <div className="max-w-6xl mx-auto px-4 -mt-24">
        {/* Header Card - Display Mode */}
        {!editing && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <img
                src={
                  profile.profile_image
                    ? `${import.meta.env.VITE_API_BASE_URL}${profile.profile_image}`
                    : "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                }
                alt="profile"
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-2xl"
              />

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900">
                      {profile.name || "Not Added"}
                    </h1>

                    <p className="text-xl text-indigo-600 mt-2">
                      {profile.title || "Not Added"}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-gray-500">
                      <MapPin size={18} />
                      {profile.city || "Not Added"}, {profile.country || "Not Added"}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-medium">
                        {profile.status || "Not Available"}
                      </span>

                      <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-medium">
                        {profile.role || "Not Added"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl h-fit mt-4 lg:mt-0 font-medium transition"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm">Experience</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {profile.FreelancerProfile?.experienceYears || 0}
                    </h3>
                    <p className="text-sm text-gray-400">Years</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm">Skills</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {profile.FreelancerProfile?.skills?.length || 0}
                    </h3>
                    <p className="text-sm text-gray-400">Technologies</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm">Verified</p>
                    <h3 className="text-xl font-bold mt-2">
                      {profile.is_verified ? "Yes" : "No"}
                    </h3>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm">Hourly Rate</p>
                    <h3 className="text-lg font-bold mt-2">
                      ${profile.hourly_rate || "0"}/hr
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Card */}
        {editing && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-8">Edit Profile</h2>

            {/* Profile Image Section */}
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                Profile Image
              </label>
              <div className="flex gap-8 flex-col lg:flex-row">
                <img
                  src={
                    imagePreview ||
                    (profile.profile_image
                      ? `${import.meta.env.VITE_API_BASE_URL}${profile.profile_image}`
                      : "https://api.dicebear.com/7.x/avataaars/svg?seed=default")
                  }
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-600"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g., Senior React Developer"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Your country"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about yourself..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addSkill}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Predefined Skills */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        setNewSkill(skill);
                        if (!formData.skills.includes(skill)) {
                          setFormData((prev) => ({
                            ...prev,
                            skills: [...prev.skills, skill],
                          }));
                        }
                      }}
                      type="button"
                      className={`px-3 py-1 text-sm rounded-full transition ${
                        formData.skills.includes(skill)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="hover:bg-indigo-700 p-1 rounded-full transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Languages */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages
              </label>
              <select
                multiple
                value={formData.languages}
                onChange={(e) => {
                  const selectedLanguage = e.target.value;
                  if (selectedLanguage) {
                    addLanguage(selectedLanguage);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select languages</option>
                {predefinedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Languages */}
            {formData.languages.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      {lang}
                      <button
                        onClick={() => removeLanguage(index)}
                        className="hover:bg-purple-700 p-1 rounded-full transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Portfolio Links
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  onKeyPress={(e) => e.key === "Enter" && addPortfolioLink()}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addPortfolioLink}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Portfolio Links List */}
              <div className="flex flex-wrap gap-2">
                {formData.portfolioLinks.map((link, index) => (
                  <div
                    key={index}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 max-w-xs"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {link.replace("https://", "")}
                    </a>
                    <button
                      onClick={() => removePortfolioLink(index)}
                      className="hover:bg-blue-700 p-1 rounded-full transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-medium transition"
              >
                {saving ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* About - Display Mode */}
        {!editing && profile.bio && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-gray-600 leading-8">{profile.bio || "Not Added"}</p>
          </div>
        )}

        {/* Skills - Display Mode */}
        {!editing && profile.FreelancerProfile?.skills?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {profile.FreelancerProfile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Professional Details - Display Mode */}
        {!editing && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Professional Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Experience</p>
                <p className="font-semibold mt-2">
                  {profile.FreelancerProfile?.experienceYears || 0} Years
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Languages</p>
                <p className="font-semibold mt-2">
                  {profile.FreelancerProfile?.languages?.length > 0
                    ? profile.FreelancerProfile.languages.join(", ")
                    : "Not Added"}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Hourly Rate</p>
                <p className="font-semibold mt-2">
                  ${profile.hourly_rate || "0"}/hr
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact - Display Mode */}
        {!editing && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{profile.email || "Not Added"}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{profile.phone || "Not Added"}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">
                  {profile.city || "Not Added"}, {profile.country || "Not Added"}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold">{profile.role || "Not Added"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Social Links - Display Mode */}
        {!editing && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Social Links</h2>
            <div className="flex flex-wrap gap-4">
              {profile.FreelancerProfile?.github && (
                <a
                  href={profile.FreelancerProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                >
                  GitHub
                </a>
              )}

              {profile.FreelancerProfile?.linkedin && (
                <a
                  href={profile.FreelancerProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  LinkedIn
                </a>
              )}

              {profile.FreelancerProfile?.portfolioWebsite && (() => {
                let portfolioLinks = [];
                try {
                  if (typeof profile.FreelancerProfile.portfolioWebsite === "string") {
                    if (profile.FreelancerProfile.portfolioWebsite.startsWith("[")) {
                      portfolioLinks = JSON.parse(profile.FreelancerProfile.portfolioWebsite);
                    } else {
                      portfolioLinks = [profile.FreelancerProfile.portfolioWebsite];
                    }
                  } else if (Array.isArray(profile.FreelancerProfile.portfolioWebsite)) {
                    portfolioLinks = profile.FreelancerProfile.portfolioWebsite;
                  }
                } catch (error) {
                  console.error("Error parsing portfolio links:", error);
                  portfolioLinks = [profile.FreelancerProfile.portfolioWebsite];
                }
                return portfolioLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Portfolio
                  </a>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
