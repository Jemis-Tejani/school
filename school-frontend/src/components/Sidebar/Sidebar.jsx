import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import menuConfig from "./menuConfig.jsx";
import { getUser } from "../../utils/storage.js";
import "./Sidebar.css";
import { FaSignOutAlt, FaUser, FaSchool } from "react-icons/fa";

const MenuItem = ({ item, isActive, onClick }) => (
  <div
    className={`menu-item ${isActive ? "active" : ""}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    aria-label={item.label}
  >
    <span className="menu-icon">{item.icon}</span>
    <span className="menu-label">{item.label}</span>
    {isActive && <div className="active-indicator" />}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const user = getUser();
  const role = user?.role?.name?.toLowerCase() || "user";
  const menuItems = menuConfig[role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FaSchool className="school-icon" />
        <h1>JK School</h1>
      </div>

      <div className="user-profile">
        <div className="avatar">
          {user?.username?.charAt(0).toUpperCase() || <FaUser />}
        </div>
        <div className="user-info">
          <strong className="username">{user?.username || "User"}</strong>
          <span className="user-role">{role}</span>
        </div>
      </div>

      <nav className="menu" aria-label="Main navigation">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      <button className="logout-btn" onClick={logout} aria-label="Logout">
        <FaSignOutAlt className="logout-icon" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
