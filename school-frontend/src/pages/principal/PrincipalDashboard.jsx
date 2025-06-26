// src/pages/PrincipalDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./PrincipalDashboard.css";

const InfoCard = ({ title, icon, count, children }) => (
  <div className="info-card">
    <h3 className="info-title">
      {icon} {title} ({count})
    </h3>
    {children}
  </div>
);

const PrincipalDashboard = () => {
  // Initialize as empty arrays
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, sRes, subjRes, dRes] = await Promise.all([
          axios.get("/teachers?populate=*"),
          axios.get("/students?populate=*"),
          axios.get("/subjects?populate=*"),
          axios.get("/divisions?populate=*"),
        ]);

        // Use .data.data for Strapi v4 response structure
        setTeachers(tRes?.data?.data || []);
        setStudents(sRes?.data?.data || []);
        setSubjects(subjRes?.data?.data || []);
        setDivisions(dRes?.data?.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading)
    return <p className="loading-text">⏳ Loading principal dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="principal-container">
      <h1 className="principal-heading">🏫 Welcome, Principal!</h1>
      <p className="principal-subtext">Here’s your school summary:</p>

      <InfoCard title="Teachers" icon="👩‍🏫" count={teachers.length}>
        <ul className="info-list">
          {teachers.length > 0 ? (
            teachers.map((t) => (
              <li key={t.id}>
                <div>
                  <strong>Teacher Name:</strong> {t?.teacher_name ?? "Unnamed"}{" "}
                  |<strong> Email:</strong> {t?.teacher_email ?? "No Email"} |
                  <strong> Subjects:</strong>{" "}
                  {Array.isArray(t.subjects) && t.subjects.length > 0
                    ? t.subjects.map((s) => s.subject_name).join(", ")
                    : "Not allotted"}
                </div>
              </li>
            ))
          ) : (
            <li>No teachers found</li>
          )}
        </ul>
      </InfoCard>

      <InfoCard title="Students" icon="👨‍🎓" count={students.length}>
        <ul className="info-list">
          {students.length > 0 ? (
            students.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>Name:</strong> {s?.student_name ?? "Unnamed"} |
                  <strong> Email:</strong>{" "}
                  {s?.student_email ??
                    s?.users_permissions_user?.email ??
                    "No Email"}{" "}
                  |<strong> Roll No:</strong> {s?.student_roll_number ?? "-"} |
                  <strong> Standard:</strong>{" "}
                  {s?.standard?.standard_name ?? "-"} |
                  <strong> Division:</strong>{" "}
                  {s?.division?.division_name ?? "-"} |
                  <strong> Subjects:</strong>{" "}
                  {Array.isArray(s.subjects) && s.subjects.length > 0
                    ? s.subjects.map((sub) => sub.subject_name).join(", ")
                    : "Not allotted"}
                </div>
              </li>
            ))
          ) : (
            <li>No students found</li>
          )}
        </ul>
      </InfoCard>

      <InfoCard title="Subjects" icon="📘" count={subjects.length}>
        <ul className="info-list">
          {subjects.length > 0 ? (
            subjects.map((sub) => (
              <li key={sub.id}>
                <div>
                  <strong>Subject:</strong> {sub.subject_name ?? "Untitled"} |
                  <strong> Teacher:</strong>{" "}
                  {sub.teacher?.teacher_name ?? "Unknown"} |
                  <strong> Standards:</strong>{" "}
                  {Array.isArray(sub.standards) && sub.standards.length > 0
                    ? sub.standards.map((std) => std.standard_name).join(", ")
                    : "Not assigned"}{" "}
                  |<strong> Students:</strong>{" "}
                  {Array.isArray(sub.students) && sub.students.length > 0
                    ? sub.students.map((s) => s.student_name).join(", ")
                    : "No students"}
                </div>
              </li>
            ))
          ) : (
            <li>No subjects found</li>
          )}
        </ul>
      </InfoCard>

      <InfoCard title="Divisions" icon="🏫" count={divisions.length}>
        <ul className="info-list">
          {divisions.length > 0 ? (
            divisions.map((d) => (
              <li key={d.id}>
                <div>
                  <strong>Division:</strong> {d.division_name ?? "Unnamed"} |
                  <strong> Standards:</strong>{" "}
                  {Array.isArray(d.standards) && d.standards.length > 0
                    ? d.standards.map((std) => std.standard_name).join(", ")
                    : "Not assigned"}{" "}
                  |<strong> Students:</strong>{" "}
                  {Array.isArray(d.students) && d.students.length > 0
                    ? d.students.map((s) => s.student_name).join(", ")
                    : "No students"}
                </div>
              </li>
            ))
          ) : (
            <li>No divisions found</li>
          )}
        </ul>
      </InfoCard>
    </div>
  );
};

export default PrincipalDashboard;
