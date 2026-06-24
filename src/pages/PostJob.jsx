import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  IndianRupee,
  Code,
  Clock,
  Award,
  Layers,
} from "lucide-react";

export default function PostJob() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
    budget: "",
    budgetType: "FIXED",
    experienceLevel: "INTERMEDIATE",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      budget: Number(formData.budget),
      budgetType: formData.budgetType,
      experienceLevel: formData.experienceLevel,
      duration: formData.duration,
    };

    console.log("Payload:", payload);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://10.121.52.123:8000/api/client/createjobs",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      alert("Job Posted Successfully");

      setFormData({
        title: "",
        description: "",
        category: "",
        skills: "",
        budget: "",
        budgetType: "FIXED",
        experienceLevel: "INTERMEDIATE",
        duration: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block mb-2 font-medium">Job Title</label>

            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Need React Developer"
                required
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Build a dashboard using React and Node.js"
                required
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium">Category</label>

            <div className="relative">
              <Layers
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Content Writing">Content Writing</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block mb-2 font-medium">Skills</label>

            <div className="relative">
              <Code size={18} className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Tailwind CSS"
                required
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Budget */}
            <div>
              <label className="block mb-2 font-medium">Budget</label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="block mb-2 font-medium">Budget Type</label>

              <select
                name="budgetType"
                value={formData.budgetType}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="FIXED">Fixed Price</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Experience Level */}
            <div>
              <label className="block mb-2 font-medium">Experience Level</label>

              <div className="relative">
                <Award
                  size={18}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-2 font-medium">Duration</label>

              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-4 text-gray-400"
                />

                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Duration</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
