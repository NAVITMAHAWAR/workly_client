// src/components/layout/Navbar.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Briefcase,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { createIcons, user } from "lucide";

import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const { logout } = useAuth();

  const navigate = useNavigate();

  // Improved auth check function
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (e) {
        console.error("Invalid user data");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for changes (important for login from other tabs)
    window.addEventListener("storage", checkAuth);

    // Also listen for custom login event
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/clientDashboard" },
    { name: "Post Jobs", href: "/PostJob" },
    { name: "Categories", href: "/Category" },
    { name: "Messages", href: "/messages" },
    { name: "Payments", href: "/payments" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">FreeLincer</h1>
              <p className="text-xs text-slate-500">Freelance Marketplace</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-slate-600 transition hover:text-green-600"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn && user ? (
              /* Avatar + Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 rounded-2xl p-1 hover:bg-slate-100 transition"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white font-medium text-lg border-2 border-white shadow">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-slate-800">
                          {user.name || "User"}
                        </p>
                        <p className="text-sm text-slate-500">{user.role}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/FreelancerProfile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700"
                        >
                          <User size={18} />
                          profile
                        </Link>
                        <Link
                          to="/clientDashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to="/Myjobs"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700"
                        >
                          <Briefcase size={18} />
                          My Jobs
                        </Link>
                      </div>

                      <div className="border-t pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login & Signup */
              <>
                <button className="rounded-xl px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100">
                  <Link to="/login">Login</Link>
                </button>
                <button className="rounded-xl bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700">
                  <Link to="/Register">Sign Up</Link>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl lg:hidden"
            >
              {/* ... Mobile menu content same as before ... */}
              {/* Header, Navigation, Bottom section same */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
