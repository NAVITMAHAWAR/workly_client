import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterWithOTP from "./pages/RegisterWithOTP";

// Client Pages
import ClientDashboard from "./pages/ClientDashboard";
import PostJobs from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import ClientContracts from "./pages/ClientContracts";
import ProposalDetails from "./pages/ProposalDetails";
import FreelancersList from "./pages/FreelancersList";
import FreelancerDetails from "./pages/FreelancerDetails";
import CreateClientProfile from "./pages/CreateClientProfile";
import ClientProfilePage from "./pages/ClientProfilePage"

// Freelancer Pages
import BrowseJobs from "./pages/BrowseJobs";
import MyProposals from "./pages/MyProposals";
import MyContracts from "./pages/MyContracts";
import SavedJobs from "./pages/SavedJobs";
import CreateFreelancerProfile from "./pages/CreateFreelancerProfile";

// Shared Pages
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";

// Freelancer Components
import FreelancerProfile from "./freelancer/FreelancerProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import { ProtectedRouteWithProfileCheck } from "./routes/ProfileCompletionGuard";
import FreelancerDashboard from "./freelancer/FreelancerDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-with-otp" element={<RegisterWithOTP />} />

        {/* Profile Completion Routes (Protected but allow incomplete profiles) */}
        <Route
          path="/create-profile"
          element={
            <ProtectedRoute>
              {/* Route to correct profile completion page based on role */}
              <CreateProfileRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-profile"
          element={
            <ProtectedRoute role="CLIENT">
              {/* Route to correct profile completion page based on role */}
              <ClientProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-client-profile"
          element={
            <ProtectedRoute role="CLIENT">
              <CreateClientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-freelancer-profile"
          element={
            <ProtectedRoute role="FREELANCER">
              <CreateFreelancerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancerdashboard"
          element={
            <ProtectedRoute role="FREELANCER">
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENT Protected Routes (with profile completion check) */}
        <Route
          path="/clientDashboard"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <ClientDashboard />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/PostJob"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <PostJobs />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/MyJobs"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <MyJobs />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/my-contracts"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <ClientContracts />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/proposal/:proposalId"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <ProposalDetails />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/freelancers"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <FreelancersList />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/freelancer-detail/:freelancerId"
          element={
            <ProtectedRouteWithProfileCheck role="CLIENT">
              <FreelancerDetails />
            </ProtectedRouteWithProfileCheck>
          }
        />

        {/* FREELANCER Protected Routes (with profile completion check) */}
        <Route
          path="/browse-jobs"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <BrowseJobs />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/job/:jobId"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <BrowseJobs />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/my-proposals"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <MyProposals />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/my-contracts-freelancer"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <MyContracts />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <SavedJobs />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/freelancerProfile"
          element={
            <ProtectedRouteWithProfileCheck role="FREELANCER">
              <FreelancerProfile />
            </ProtectedRouteWithProfileCheck>
          }
        />

        {/* SHARED Protected Routes (Both Client and Freelancer, with profile completion check) */}
        <Route
          path="/chat"
          element={
            <ProtectedRouteWithProfileCheck>
              <Chat />
            </ProtectedRouteWithProfileCheck>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRouteWithProfileCheck>
              <Notifications />
            </ProtectedRouteWithProfileCheck>
          }
        />
      </Routes>
    </>
  );
}

/**
 * Router component to redirect to appropriate profile creation page based on role
 */
const CreateProfileRouter = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role?.toLowerCase() || "freelancer";

  if (role === "client") {
    return <CreateClientProfile />;
  } else {
    return <CreateFreelancerProfile />;
  }
};

export default App;
