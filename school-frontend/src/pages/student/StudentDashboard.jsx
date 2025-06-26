import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./StudentDashboard.css";

const InfoCard = ({ title, icon, children }) => (
  <div className="info-card">
    <h3 className="info-title">
      {icon} {title}
    </h3>
    {children}
  </div>
);

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
                No data found.
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
    const fetchStudent = async () => {
      try {
        const studentRes = await axios.get("/users/me?populate=*");
        setStudent(studentRes?.data);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading)
    return <p className="loading-text">⏳ Loading student dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <div className="student-container">
      <h1 className="student-heading">
        🎓 Welcome, {student?.username ?? "-"}
      </h1>
      <p className="student-subtext">Here's your academic info:</p>

      <InfoCard title="Student Info" icon="👤">
        <Table
          columns={["Name", "Email", "Roll Number", "User ID"]}
          rows={[
            [
              student?.student?.student_name ?? "-",
              student?.student?.student_email ?? "-",
              student?.student?.student_roll_number ?? "-",
              student?.id ?? "-",
            ],
          ]}
        />
      </InfoCard>

      {/* Teacher Info Card */}
      <InfoCard title="Assigned Teacher" icon="🧑‍🏫">
        <Table
          columns={["Name", "Email", "ID"]}
          rows={[
            [
              student?.teacher?.teacher_name ?? "-",
              student?.teacher?.teacher_email ?? "-",
              student?.teacher?.id ?? "-",
            ],
          ]}
        />
      </InfoCard>
    </div>
  );
};

export default StudentDashboard;
