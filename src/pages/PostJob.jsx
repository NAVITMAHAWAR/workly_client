// src/pages/PostJob.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, AlignLeft, LayoutGrid, Tag,
   Lock, Clock, Star, Calendar, Send, X,
} from "lucide-react";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Web Development", "Mobile Development", "UI/UX Design",
  "Graphic Design", "Content Writing",
];

const DURATIONS = ["1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months"];

const EXP_LEVELS = [
  { value: "BEGINNER", label: "Beginner", sub: "0–2 years" },
  { value: "INTERMEDIATE", label: "Intermediate", sub: "2–5 years" },
  { value: "EXPERT", label: "Expert", sub: "5+ years" },
];

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
    
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {children}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function InputWrap({ icon: Icon, children }) {
  return (
    <div className="relative">
      
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100";

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    budgetType: "FIXED",
    experienceLevel: "INTERMEDIATE",
    duration: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = skillInput.trim();
    if (val && !skills.includes(val)) setSkills([...skills, val]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (skills.length === 0) {
    console.log("2. No Skills");
    toast.error("Add at least one skill");
    return;
  }

  const token = localStorage.getItem("token");


  const payload = {
    ...formData,
    skills,
    budget: Number(formData.budget),
  };


  try {
    setLoading(true);


    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/client/createjobs`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Job posted successfully!");
    navigate("/MyJobs");
  } catch (err) {
    console.log("7. Error:", err);
    toast.error(err.response?.data?.message || "Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wide mb-2">
            New listing
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">Post a job</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details to find the right freelancer
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-6">

              {/* ── Basics ── */}
              <div className="mb-7">
                <SectionLabel icon={Briefcase}>Job basics</SectionLabel>

                <Field label="Job title">
                  <InputWrap icon={Briefcase}>
                    <input
                      name="title" value={formData.title} onChange={handleChange}
                      required placeholder="e.g. Need React Developer"
                      className={`${inputCls} h-11 pl-9 pr-4`}
                    />
                  </InputWrap>
                </Field>

                <Field label="Description">
                  <div className="relative">
                    <AlignLeft size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <textarea
                      name="description" value={formData.description} onChange={handleChange}
                      required rows={4}
                      placeholder="Describe the project, deliverables, and any specific requirements..."
                      className={`${inputCls} pl-9 pr-4 py-3`}
                    />
                  </div>
                </Field>

                <Field label="Category">
                  <InputWrap icon={LayoutGrid}>
                    <select
                      name="category" value={formData.category} onChange={handleChange}
                      required className={`${inputCls} h-11 pl-9 pr-4`}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </InputWrap>
                </Field>
              </div>

              {/* ── Skills ── */}
              <div className="mb-7">
                <SectionLabel icon={Tag}>Skills required</SectionLabel>

                <Field label="Add skills" hint="Press Enter after each skill">
                  <InputWrap icon={Tag}>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="e.g. React, Node.js, Tailwind CSS"
                      className={`${inputCls} h-11 pl-9 pr-4`}
                    />
                  </InputWrap>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600"
                        >
                          {s}
                          <button
                            type="button" onClick={() => removeSkill(s)}
                            className="text-indigo-400 hover:text-indigo-700"
                            aria-label={`Remove ${s}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Field>
              </div>

              {/* ── Budget ── */}
              <div className="mb-7">
                <SectionLabel >Budget</SectionLabel>

                <Field label={formData.budgetType === "FIXED" ? "Fixed budget (₹)" : "Hourly rate (₹/hr)"}>
                  <InputWrap >
                    <input
                      type="number" name="budget" value={formData.budget} onChange={handleChange}
                      required min="1" placeholder="e.g. 15000"
                      className={`${inputCls} h-11 pl-9 pr-4`}
                    />
                  </InputWrap>
                </Field>
              </div>

              {/* ── Experience & Timeline ── */}
              <div className="mb-2">
                <SectionLabel icon={Star}>Experience and timeline</SectionLabel>

                <Field label="Experience level">
                  <div className="grid grid-cols-3 gap-2">
                    {EXP_LEVELS.map(({ value, label, sub }) => (
                      <button
                        key={value} type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: value })}
                        className={`py-2.5 rounded-xl text-sm border transition text-center ${
                          formData.experienceLevel === value
                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {label}
                        <span className={`block text-xs mt-0.5 font-normal ${
                          formData.experienceLevel === value ? "text-indigo-400" : "text-slate-400"
                        }`}>
                          {sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Duration">
                  <InputWrap icon={Calendar}>
                    <select
                      name="duration" value={formData.duration} onChange={handleChange}
                      required className={`${inputCls} h-11 pl-9 pr-4`}
                    >
                      <option value="">Select duration</option>
                      {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </InputWrap>
                </Field>
              </div>

            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50">
              <button
                type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Send size={15} />
                {loading ? "Posting job..." : "Post job"}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}