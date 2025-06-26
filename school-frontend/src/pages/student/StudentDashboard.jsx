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

  const division = student?.division?.division_name ?? "-";
  const standard = student?.standard?.standard_name ?? "-";
  const subjects = Array.isArray(student?.subjects) ? student.subjects : [];

  return (
    <div className="student-container">
      <h1 className="student-heading">
        🎓 Welcome, {student?.username ?? "-"}
      </h1>
      <p className="student-subtext">Here's your academic info:</p>

      <InfoCard title="Student Info" icon="👤">
        <Table
          columns={["Name", "Email", "Standard", "Division"]}
          rows={[
            [
              student?.username ?? "-",
              student?.email ?? "-",
              standard,
              division,
            ],
          ]}
        />
      </InfoCard>

      <InfoCard title="Subjects Enrolled" icon="📘">
        <Table
          columns={["Subject", "Teacher"]}
          rows={subjects.map((sub) => [
            sub.subject_name ?? "-",
            sub.teacher?.teacher_name ?? "Unknown",
          ])}
        />
      </InfoCard>
    </div>
  );
};

export default StudentDashboard;
