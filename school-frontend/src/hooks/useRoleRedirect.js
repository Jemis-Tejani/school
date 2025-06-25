// src/hooks/useRoleRedirect.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import routes from "../constants/routes"; // centralized route config

const useRoleRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const role = user?.role?.name?.toLowerCase();

    // Use centralized route mapping
    switch (role) {
      case "student":
        setTimeout(() => navigate(routes.studentDashboard), 100);
        break;
      case "teacher":
        setTimeout(() => navigate(routes.teacherDashboard), 100);
        break;
      case "principal":
        setTimeout(() => navigate(routes.principalDashboard), 100);
        break;
      default:
        console.warn("Unknown role:", role);
        setTimeout(() => navigate("/"), 100);
        break;
    }

    // optional cleanup (placeholder, if needed later)
    return () => {};
  }, [user, navigate]);
};

export default useRoleRedirect;
