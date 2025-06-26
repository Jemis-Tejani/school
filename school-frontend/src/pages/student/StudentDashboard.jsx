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

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const studentRes = await axios.get("/users/me?populate=*");
        setStudent(studentRes?.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
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

  if (!student)
    return (
      <div className="no-data-container">
        <div className="no-data-icon">📭</div>
        <p className="no-data-text">No student data found.</p>
        <p className="no-data-subtext">Please contact your administrator.</p>
      </div>
    );

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="avatar">
            {student?.username?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="header-text">
            <p className="greeting">Hello,</p>
            <h1 className="dashboard-title">
              <span className="student-name">
                {student?.username ?? "Student"}
              </span>
            </h1>
            <p className="dashboard-subtitle">Here's your academic summary</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-grid">
          <InfoCard title="Student Information" icon="👤">
            <Table
              columns={["Field", "Value"]}
              rows={[
                ["Full Name", student?.student?.student_name ?? "-"],
                ["Email", student?.student?.student_email ?? "-"],
                ["Roll Number", student?.student?.student_roll_number ?? "-"],
                ["User ID", student?.id ?? "-"],
              ]}
            />
          </InfoCard>

          <InfoCard title="Assigned Teacher" icon="🧑‍🏫">
            <Table
              columns={["Field", "Value"]}
              rows={[
                ["Name", student?.teacher?.teacher_name ?? "-"],
                ["Email", student?.teacher?.teacher_email ?? "-"],
                ["Teacher ID", student?.teacher?.id ?? "-"],
              ]}
            />
          </InfoCard>

          <InfoCard title="Account Details" icon="📝">
            <div className="account-details">
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">
                  {new Date(student?.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Created:</span>
                <span className="detail-value">
                  {new Date(student?.createdAt).toLocaleDateString()}
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

export default StudentDashboard;
