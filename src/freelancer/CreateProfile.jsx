import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  User,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Languages,
} from "lucide-react";
// import { FaGithub } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa";
import axios from "axios";

export default function CreateProfile() {
  const auth = useAuth();
  const token = auth?.token;
  const [formData, setFormData] = useState({
    // fullName: "",
    title: "",
    bio: "",
    skills: "",
    experienceYears: "",
    phone: "",
    country: "",
    city: "",
    availability: "FULL_TIME",
    github: "",
    linkedin: "",
    portfolioWebsite: "",
    languages: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (
      !formData.phone ||
      !formData.country ||
      !formData.city ||
      !formData.title
    ) {
      setError("Phone, Country, City, and Title are required.");
      return false;
    }

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setError("At least one skill is required.");
      return false;
    }

    if (!formData.experienceYears || Number(formData.experienceYears) < 0) {
      setError("Valid experience years are required.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const formPayload = new FormData();

    // Text fields
    // formPayload.append("fullName", formData.fullName);
    formPayload.append("title", formData.title);
    formPayload.append("bio", formData.bio);
    formPayload.append("phone", formData.phone);
    formPayload.append("country", formData.country);
    formPayload.append("city", formData.city);
    formPayload.append("availability", formData.availability);
    formPayload.append("github", formData.github);
    formPayload.append("linkedin", formData.linkedin);
    formPayload.append("portfolioWebsite", formData.portfolioWebsite);
    formPayload.append("languages", formData.languages);
    formPayload.append("experienceYears", formData.experienceYears.toString());

    // Skills as array
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    skillsArray.forEach((skill) => {
      formPayload.append("skills[]", skill);
    });

    // Profile image
    if (profileImage) {
      formPayload.append("profile_image", profileImage);
    }

    try {
      const response = await axios.post(
        "http://10.121.52.123:8000/api/auth/completeprofile",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        },
      );

      console.log("Profile created:", response.data);
      alert("Profile Saved Successfully!");

      // Optional: redirect
      // window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      console.log("Error Response:", err.response);
      console.log("Error Data:", err.response?.data);
      console.log("Error Message:", err.response?.data?.message);
      setError(
        err.response?.data?.message ||
          "Failed to save profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Complete Your Freelancer Profile
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image */}
          <div>
            <label className="block font-medium mb-3 text-gray-700">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              {imagePreview && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, max 5MB
            </p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          {/* Full Name
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div> */}

          {/* Phone */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          {/* </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Country
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                City
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                min="0"
                placeholder="3"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Professional Title
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior MERN Stack Developer"
                className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Tell clients about your expertise..."
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Skills{" "}
              <span className="text-sm text-gray-500">(comma separated)</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, TypeScript"
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Languages{" "}
              <span className="text-sm text-gray-500">(comma separated)</span>
            </label>
            <div className="relative">
              <Languages
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Hindi"
                className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}

          {/* <div>
              <label className="block font-medium mb-2 text-gray-700">
                Availability
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="AS_NEEDED">As Needed</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>
            </div> */}

          {/* Portfolio */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Portfolio Website
            </label>
            <div className="relative">
              <Globe
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="url"
                name="portfolioWebsite"
                value={formData.portfolioWebsite}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GitHub */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                GitHub Profile
              </label>
              <div className="relative">
                {/* <FaGithub
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                /> */}
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                LinkedIn Profile
              </label>
              <div className="relative">
                {/* <FaLinkedin
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                /> */}
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full border border-gray-300 rounded-lg pl-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                Saving Profile...
              </>
            ) : (
              "Save & Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
