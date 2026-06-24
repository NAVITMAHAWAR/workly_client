import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://10.121.52.123:8000/api/auth/register",
        formData,
      );

      console.log(res.data);
      toast.success("Registration Successful");

      // Redirect to Login Page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UserPlus size={30} className="text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white">Create Account</h1>

            <p className="text-gray-300 mt-2">
              Join Workly and start your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Narendra Mahawar"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Email</label>

              <input
                type="email"
                name="email"
                placeholder="narendra@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Register As
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-400"
              >
                <option value="freelancer" className="text-black">
                  Freelancer
                </option>
                <option value="client" className="text-black">
                  Client
                </option>
              </select>
            </div>

            {/* Error */}
            {error ? (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </div>
            ) : null}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <span className="text-indigo-400 cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
