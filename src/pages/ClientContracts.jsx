// src/pages/ClientContracts.jsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, clientAPI } from "../services/api";
import {
  Loader, X, Zap, Clock, CheckCircle2,
  Coins, CalendarCheck, Paperclip, AlertCircle, MapPin, User,
} from "lucide-react";
import { toast } from "react-toastify";

const fmtAmt = (a) =>
  a != null ? "₹" + parseFloat(a).toLocaleString("en-IN") : "—";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "N/A";

const initials = (name) =>
  name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?";

const STATUS_MAP = {
  ACTIVE: { label: "Active", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  WORK_SUBMITTED: { label: "Work submitted", cls: "bg-orange-50 text-orange-700 border border-orange-200" },
  COMPLETED: { label: "Completed", cls: "bg-green-50 text-green-700 border border-green-200" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-700 border border-red-200" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toUpperCase()] || { label: status, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Contract Card ────────────────────────────────────────────────────────────
function ContractCard({ contract, onOpen, onMarkComplete, marking }) {
  return (
    <div
      onClick={() => onOpen(contract)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 transition cursor-pointer px-5 py-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <img className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm flex items-center justify-center flex-shrink-0"
      src={`${import.meta.env.VITE_API_BASE_URL}${contract.freelancer.profile_image}`}
      />
        

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-slate-900 truncate mb-1">
          {contract.Job?.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <User size={11} /> {contract.freelancer?.name || "—"}
          </span>
          {contract.freelancer?.city && (
            <>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {contract.freelancer.city}
              </span>
            </>
          )}
          {contract.dueDate && (
            <>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <CalendarCheck size={11} /> Due {fmtDate(contract.dueDate)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-base font-bold text-slate-900">{fmtAmt(contract.amount)}</p>
        <StatusBadge status={contract.status} />
        {contract.status === "WORK_SUBMITTED" && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkComplete(contract.id); }}
            disabled={marking}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 transition flex items-center gap-1"
          >
            <CheckCircle2 size={12} />
            {marking ? "Processing..." : "Mark complete"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ContractModal({ contract, onClose, onMarkComplete, marking }) {
  const isSubmitted = contract.status?.toUpperCase() === "WORK_SUBMITTED";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-start gap-3">
          <div>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wide mb-2">
              Contract #{contract.id}
            </span>
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">
              {contract.Job?.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-5 max-h-[60vh] overflow-y-auto">

          {/* Freelancer row */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm flex items-center justify-center flex-shrink-0">
              {initials(contract.freelancer?.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {contract.freelancer?.name}
              </p>
              <p className="text-xs text-slate-500">
                {contract.freelancer?.title} · {contract.freelancer?.city}, {contract.freelancer?.country}
              </p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={contract.status} />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <Coins size={16} className="text-indigo-500 mb-2" />
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Contract amount</p>
              <p className="text-lg font-bold text-slate-900">{fmtAmt(contract.amount)}</p>
              <p className="text-xs text-slate-400 mt-1">Budget: {fmtAmt(contract.Job?.budget)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <Clock size={16} className="text-amber-500 mb-2" />
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Delivery</p>
              <p className="text-lg font-bold text-slate-900">
                {contract.deliveryDays ? `${contract.deliveryDays} days` : "N/A"}
              </p>
              <p className="text-xs text-slate-400 mt-1">{contract.Job?.budgetType}</p>
            </div>
          </div>

          {/* Dates */}
          {(contract.startDate || contract.dueDate) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <p className="text-xs text-slate-400 mb-1">Start date</p>
                <p className="text-sm font-semibold text-slate-900">{fmtDate(contract.startDate)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <p className="text-xs text-slate-400 mb-1">Due date</p>
                <p className="text-sm font-semibold text-slate-900">{fmtDate(contract.dueDate)}</p>
              </div>
            </div>
          )}

          {/* Submitted banner */}
          {isSubmitted && (
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-orange-900">Work submitted — pending your review</p>
                <p className="text-xs text-orange-700 mt-0.5">
                  Review the submission and mark as complete if satisfied.
                </p>
              </div>
            </div>
          )}

          {/* Submission message */}
          {contract.submissionMessage && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Submission message
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-600 leading-relaxed">
                {contract.submissionMessage}
              </div>
            </div>
          )}

          {/* Submission file */}
          {contract.submissionFile && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Submission file
              </p>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}${contract.submissionFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition"
              >
                <Paperclip size={14} /> Download file
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
          >
            <X size={13} /> Close
          </button>
          {isSubmitted && (
            <button
              onClick={() => onMarkComplete(contract.id)}
              disabled={marking}
              className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              {marking ? "Processing..." : "Mark as complete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedContract, setSelectedContract] = useState(null);
  const [marking, setMarking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMyContracts();
      setContracts(response.data.contracts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (contractId) => {
    try {
      setMarking(true);
      await clientAPI.completeContract(contractId);
      toast.success("Contract marked as complete!");
      await fetchContracts();
      setSelectedContract(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete contract");
    } finally {
      setMarking(false);
    }
  };

  const TABS = [
    { id: "active", label: "Active", icon: <Zap size={13} />, filter: (c) => c.status === "ACTIVE" },
    { id: "submitted", label: "Work submitted", icon: <Clock size={13} />, filter: (c) => c.status === "WORK_SUBMITTED" },
    { id: "completed", label: "Completed", icon: <CheckCircle2 size={13} />, filter: (c) => c.status === "COMPLETED" },
  ];

  const filtered = contracts.filter(TABS.find((t) => t.id === activeTab)?.filter || (() => true));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">My contracts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your active and completed projects</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-slate-200 mb-5">
          {TABS.map((tab) => {
            const count = contracts.filter(tab.filter).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
            <p className="text-slate-400 text-sm">No {activeTab} contracts yet</p>
            <button
              onClick={() => navigate("/browse-jobs")}
              className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Browse jobs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c) => (
              <ContractCard
                key={c.id}
                contract={c}
                onOpen={setSelectedContract}
                onMarkComplete={handleMarkComplete}
                marking={marking}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedContract && (
        <ContractModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
          onMarkComplete={handleMarkComplete}
          marking={marking}
        />
      )}
    </div>
  );
}