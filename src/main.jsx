import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        {/* <Toaster position="top-right" /> */}
        {/* <Toaster richColors /> */}
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
