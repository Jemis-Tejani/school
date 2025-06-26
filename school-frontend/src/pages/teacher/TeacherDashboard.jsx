// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // same axios instance with token
import "./TeacherDashboard.css";

// ✅ Reusable InfoCard component
const InfoCard = ({ title, icon, children }) => (
  <div className="info-card">
    <h3 className="info-title">
      {icon} {title}
    </h3>
    {children}
  </div>
);

// ✅ Reusable Table component
const Table = ({ columns = [], rows = [] }) => {
  if (!Array.isArray(columns) || !Array.isArray(rows)) return null;

  return (
    <div className="table-wrapper">
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
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data available.
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
        setError("🚫 Failed to load teacher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  if (loading)
    return <p className="loading-text">⏳ Loading teacher dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!teacher) return <p>No teacher data found.</p>;

  const subjects = Array.isArray(teacher?.subjects) ? teacher.subjects : [];

  return (
    <div className="teacher-container">
      <h1 className="teacher-heading">
        🎓 Welcome, {teacher?.username ?? "-"}
      </h1>
      <p className="teacher-subtext">This is your personalized dashboard.</p>

      <InfoCard title="Teacher Info" icon="👤">
        <Table
          columns={["Name", "Email"]}
          rows={[[teacher?.username ?? "-", teacher?.email ?? "-"]]}
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
    </div>
  );
};

export default TeacherDashboard;
