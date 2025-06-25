import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import menuConfig from "./menuConfig.jsx";
import { getUser } from "../../utils/storage.js";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const user = getUser();
  const role = user?.role?.name?.toLowerCase();
  const menuItems = menuConfig[role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-header">School System</div>
      <p className="user-role-label">{role}</p>

      <nav className="menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
