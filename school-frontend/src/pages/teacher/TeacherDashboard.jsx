import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const InfoCard = ({ title, icon, children }) => (
  <div className="info-card">
    <div className="card-header">
      <span className="card-icon">{icon}</span>
      <h3 className="card-title">{title}</h3>
    </div>
    <div className="card-content">{children}</div>
  </div>
);

const Table = ({ columns = [], rows = [] }) => {
  if (!Array.isArray(columns) || !Array.isArray(rows)) return null;

  return (
    <div className="table-container">
      <table className="info-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">
                <div className="no-data-content">
                  <span className="no-data-icon">📭</span>
                  <span>No data available</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get("/users/me?populate=*");
        setTeacher(res?.data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
        setError("Failed to load teacher data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );

  if (!teacher)
    return (
      <div className="no-data-container">
        <div className="no-data-icon">📭</div>
        <p className="no-data-text">No teacher data found.</p>
        <p className="no-data-subtext">Please contact your administrator.</p>
      </div>
    );

  const subjects = Array.isArray(teacher?.subjects) ? teacher.subjects : [];

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="avatar">
            {teacher?.username?.charAt(0).toUpperCase() || "T"}
          </div>
          <div className="header-text">
            <p className="greeting">Welcome,</p>
            <h1 className="dashboard-title">
              <span className="student-name">
                {teacher?.username ?? "Teacher"}
              </span>
            </h1>
            <p className="dashboard-subtitle">
              This is your personalized dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-grid">
          <InfoCard title="Teacher Info" icon="👤">
            <Table
              columns={["Name", "Email", "User ID"]}
              rows={[
                [
                  teacher?.teacher?.teacher_name ?? teacher?.username ?? "-",
                  teacher?.teacher?.teacher_email ?? teacher?.email ?? "-",
                  teacher?.id ?? "-",
                ],
              ]}
            />
          </InfoCard>

          <InfoCard title="Subjects You Teach" icon="📘">
            <Table
              columns={["Subject", "Standard", "Division"]}
              rows={subjects.map((sub) => [
                sub.subject_name ?? "-",
                sub.standard?.standard_name ?? "-",
                sub.division?.division_name ?? "-",
              ])}
            />
          </InfoCard>

          <InfoCard title="Account Details" icon="📝">
            <div className="account-details">
              <div className="detail-item">
                <span className="detail-label">Account Created:</span>
                <span className="detail-value">
                  {new Date(teacher?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">
                  {new Date(teacher?.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-note">
                <span className="note-icon">ℹ️</span>
                More features coming soon as we expand our API endpoints
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
