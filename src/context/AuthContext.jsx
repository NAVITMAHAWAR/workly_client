import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        // If no stored credentials, auth is checked but user is not authenticated
        if (!storedToken || !storedUser) {
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // Parse stored user data
        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // Set temporary state while validating
        setToken(storedToken);
        setUser(parsedUser);
        // Keep loading=true during validation

        // Validate token with backend
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://10.121.52.123:8000";
          const response = await fetch(`${API_BASE_URL}/api/auth/getmyprofile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Token is valid, update with fresh data from server
            const freshUser = data.data || data.user || parsedUser;
            setUser(freshUser);
            setToken(storedToken);
          } else if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
          } else {
            // Server error, keep stored state but allow user to continue
            // (they can get re-authenticated on their first API call)
            setUser(parsedUser);
            setToken(storedToken);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // Network error, keep stored state
          // User can still access app but will get 401 on first failed API call
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        updateUser,
        logout,
        loading,
        authChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};