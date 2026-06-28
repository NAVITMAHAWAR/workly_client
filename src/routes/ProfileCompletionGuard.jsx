import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProfileCompletionGuard Component
 * 
 * Used internally - not typically used directly
 * Checks if user has completed their profile
 */
export const ProfileCompletionGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for authentication to be resolved
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Loading...</h2>
          <p className="text-slate-600 mt-2">Verifying your authentication</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile not completed
  if (!user.profile_completed) {
    const role = user.role?.toLowerCase() || "freelancer";
    return (
      <Navigate
        to={`/create-profile?role=${role}`}
        replace
      />
    );
  }

  return children;
};

/**
 * ProtectedRouteWithProfileCheck Component
 * 
 * Main protection wrapper for pages that require:
 * 1. User to be authenticated
 * 2. User to have completed their profile
 * 3. User to have the correct role (if specified)
 * 
 * Used for: Dashboard, Jobs, Contracts, Proposals, Chat, Notifications, etc.
 */
export const ProtectedRouteWithProfileCheck = ({
  children,
  role = null,
}) => {
  const { user, loading } = useAuth();

  // Wait for authentication to be resolved
  // This is CRITICAL - without this check, redirects happen before auth loads
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Loading...</h2>
          <p className="text-slate-600 mt-2">Verifying your authentication</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Profile not completed - redirect to profile completion
  if (!user.profile_completed) {
    const userRole = user.role?.toLowerCase() || "freelancer";
    return (
      <Navigate
        to={`/create-profile?role=${userRole}`}
        replace
      />
    );
  }

  // All checks passed - render protected content
  return children;
};

export default ProfileCompletionGuard;