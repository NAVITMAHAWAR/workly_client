import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ClientDashboard from "./pages/ClientDashboard";
import PostJobs from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import ProposalDetails from "./pages/ProposalDetails";

import CreateProfile from "./freelancer/CreateProfile";
import FreelancerProfile from "./freelancer/FreelancerProfile";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/clientDashboard"
          element={
            <ProtectedRoute role="CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/PostJob"
          element={
            <ProtectedRoute role="CLIENT">
              <PostJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/MyJobs"
          element={
            <ProtectedRoute role="CLIENT">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-profile"
          element={
            <ProtectedRoute role="FREELANCER">
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/freelancerProfile"
          element={
            <ProtectedRoute role="FREELANCER">
              <FreelancerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proposal/:proposalId"
          element={
            <ProtectedRoute role="CLIENT">
              <ProposalDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
