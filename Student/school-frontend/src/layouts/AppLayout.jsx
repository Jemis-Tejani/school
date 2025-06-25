import React from "react";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "./AppLayout.css"; // Import this CSS

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
