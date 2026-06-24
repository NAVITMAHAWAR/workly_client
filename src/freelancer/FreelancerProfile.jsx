import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Briefcase, Globe } from "lucide-react";

export default function FreelancerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://10.121.52.123:8000/api/auth/getmyprofile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h bg-slate-100 pb-10">
      {/* Premium Cover Banner (gradient only) */}
      {/* <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.95)_0deg,rgba(168,85,247,0.95)_90deg,rgba(236,72,153,0.95)_180deg,rgba(99,102,241,0.95)_360deg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/55" />

        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 shadow">
            Available For Work
          </span>
        </div>
      </div> */}
      <div className="min-h-screen bg-slate-100 pb-10">
        {/* Premium Banner */}
        <div className="h-64 bg-gradient-to-r from-slate-950 via-indigo-900 to-purple-800"></div>

        <div className="max-w-6xl mx-auto px-4 -mt-24">
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <img
                src={`http://10.121.52.123:8000${profile.profile_image}`}
                alt="profile"
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-2xl"
              />

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900">
                      {profile.name}
                    </h1>

                    <p className="text-xl text-indigo-600 mt-2">
                      {profile.title}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-gray-500">
                      <MapPin size={18} />
                      {profile.city}, {profile.country}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-medium">
                        {profile.status}
                      </span>

                      <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-medium">
                        {profile.role}
                      </span>
                    </div>
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl h-fit mt-4 lg:mt-0">
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm">Experience</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {profile.FreelancerProfile?.experienceYears}
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
                    <p className="text-gray-500 text-sm">Availability</p>
                    <h3 className="text-lg font-bold mt-2">
                      {profile.FreelancerProfile?.availability || "Available"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>

            <p className="text-gray-600 leading-8">{profile.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Skills</h2>

            <div className="flex flex-wrap gap-3">
              {profile.FreelancerProfile?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Professional Details</h2>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Experience</p>

                <p className="font-semibold mt-2">
                  {profile.FreelancerProfile?.experienceYears} Years
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Languages</p>

                <p className="font-semibold mt-2">
                  {profile.FreelancerProfile?.languages}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-gray-500 text-sm">Availability</p>

                <p className="font-semibold mt-2">
                  {profile.FreelancerProfile?.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Contact Information</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-semibold">{profile.email}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Phone</p>

                <p className="font-semibold">{profile.phone}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Location</p>

                <p className="font-semibold">
                  {profile.city}, {profile.country}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl">
                <p className="text-sm text-gray-500">Role</p>

                <p className="font-semibold">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-5">Social Links</h2>

            <div className="flex flex-wrap gap-4">
              <a
                href={profile.FreelancerProfile?.github}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                GitHub
              </a>

              <a
                href={profile.FreelancerProfile?.linkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                LinkedIn
              </a>

              <a
                href={profile.FreelancerProfile?.portfolioWebsite}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
