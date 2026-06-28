import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Building,
  Mail,
  Phone,
  Globe,
  Briefcase,
  MapPin,
  Loader,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ClientProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    designation: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    website: "",
    companySize: "",
    linkedIn: "",
    bio: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Marketing",
    "Consulting",
    "Other",
  ];

  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/client`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { profile: profileData, user: userData } = response.data.data;
        setProfile(profileData);

        setFormData({
          companyName: profileData?.companyName || "",
          industry: profileData?.industry || "",
          designation: profileData?.designation || "",
          phone: userData?.phone || profileData?.phone || "",
          country: userData?.country || profileData?.country || "",
          state: profileData?.state || "",
          city: userData?.city || profileData?.city || "",
          website: profileData?.website || "",
          companySize: profileData?.companySize || "",
          linkedIn: profileData?.linkedIn || "",
          bio: userData?.bio || profileData?.bio || "",
        });

        if (userData?.profile_image || profileData?.profileImage) {
          setImagePreview(
            `${API_BASE_URL}${userData?.profile_image || profileData?.profileImage}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    setSaving(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/profile/client`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setProfileImage(null);
        
        // Refresh profile data
        await fetchProfile();

        // Update user in context
        window.dispatchEvent(new Event("authChange"));
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    fetchProfile(); // Reset form data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Building size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {isEditing ? "Edit Profile" : "My Profile"}
                </h1>
                <p className="text-slate-500 mt-1">
                  {user?.role === "CLIENT" ? "Client Account" : "Account"}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-blue-200 flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}

              {isEditing && (
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-3 cursor-pointer hover:bg-blue-700 transition shadow-lg"
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Edit2 size={18} className="text-white" />
                </label>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-3 font-medium">
              {user?.name || "User Name"}
            </p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Building
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company name"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Building size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.companyName || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select an industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Briefcase size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.industry || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Designation
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Your role"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Briefcase size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.designation || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.phone || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                {isEditing ? (
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
                      placeholder="Country"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.country || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.city || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Globe
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : formData.website ? (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <Globe size={18} className="text-blue-600" />
                    <span className="text-blue-600 hover:underline">
                      {formData.website}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Globe size={18} className="text-slate-400" />
                    <span className="text-slate-700">Not provided</span>
                  </div>
                )}
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Size
                </label>
                {isEditing ? (
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Building size={18} className="text-slate-400" />
                    <span className="text-slate-700">
                      {formData.companySize
                        ? `${formData.companySize} employees`
                        : "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                ) : formData.linkedIn ? (
                  <a
                    href={formData.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <span className="text-blue-600 hover:underline">
                      {formData.linkedIn}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Not provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your company..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {formData.bio || "No bio provided"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail size={18} className="text-slate-400" />
                <span className="text-slate-700">{user?.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Type
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Briefcase size={18} className="text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {user?.role || "CLIENT"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientProfilePage;
