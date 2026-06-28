import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * 
 * Handles basic authentication checks:
 * - Waits for auth initialization (loading state)
 * - Validates token exists
 * - Checks user role if specified
 * - Shows loading splash until auth is resolved
 */
export default function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth();

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

  // No token or user - redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // All checks passed - render protected content
  return children;
}
