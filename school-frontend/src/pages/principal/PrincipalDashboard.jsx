import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const InfoCard = ({ title, icon, count, children }) => (
  <div className="info-card">
    <div className="card-header">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">
        {title} ({count})
      </h3>
    </div>
    <div className="card-content">{children}</div>
  </div>
);

const Table = ({ headers, rows }) => (
  <div className="table-container">
    <table className="info-table">
      <thead>
        <tr>
          {headers.map((h, idx) => (
            <th key={idx}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PrincipalDashboard = () => {
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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">⏳ Loading principal dashboard...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <p className="error-text">{error}</p>
      </div>
    );

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="avatar">P</div>
          <div className="header-text">
            <p className="greeting">Welcome</p>
            <h1 className="dashboard-title">Principal</h1>
            <p className="dashboard-subtitle">Here’s your school summary:</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-grid">
          <InfoCard title="Teachers" icon="👩‍🏫" count={teachers.length}>
            <Table
              headers={["Name", "Email", "Subjects"]}
              rows={teachers.map((t) => [
                t?.teacher_name ?? "Unnamed",
                t?.teacher_email ?? "No Email",
                Array.isArray(t.subjects) && t.subjects.length > 0
                  ? t.subjects.map((s) => s.subject_name).join(", ")
                  : "Not allotted",
              ])}
            />
          </InfoCard>

          <InfoCard title="Students" icon="👨‍🎓" count={students.length}>
            <Table
              headers={[
                "Name",
                "Email",
                "Roll No",
                "Standard",
                "Division",
                "Subjects",
              ]}
              rows={students.map((s) => [
                s?.student_name ?? "Unnamed",
                s?.student_email ??
                  s?.users_permissions_user?.email ??
                  "No Email",
                s?.student_roll_number ?? "-",
                s?.standard?.standard_name ?? "-",
                s?.division?.division_name ?? "-",
                Array.isArray(s.subjects) && s.subjects.length > 0
                  ? s.subjects.map((sub) => sub.subject_name).join(", ")
                  : "Not allotted",
              ])}
            />
          </InfoCard>

          <InfoCard title="Subjects" icon="📘" count={subjects.length}>
            <Table
              headers={["Subject", "Teacher", "Standards", "Students"]}
              rows={subjects.map((sub) => [
                sub.subject_name ?? "Untitled",
                sub.teacher?.teacher_name ?? "Unknown",
                Array.isArray(sub.standards) && sub.standards.length > 0
                  ? sub.standards.map((std) => std.standard_name).join(", ")
                  : "Not assigned",
                Array.isArray(sub.students) && sub.students.length > 0
                  ? sub.students.map((s) => s.student_name).join(", ")
                  : "No students",
              ])}
            />
          </InfoCard>

          <InfoCard title="Divisions" icon="🏫" count={divisions.length}>
            <Table
              headers={["Division", "Standards", "Students"]}
              rows={divisions.map((d) => [
                d.division_name ?? "Unnamed",
                Array.isArray(d.standards) && d.standards.length > 0
                  ? d.standards.map((std) => std.standard_name).join(", ")
                  : "Not assigned",
                Array.isArray(d.students) && d.students.length > 0
                  ? d.students.map((s) => s.student_name).join(", ")
                  : "No students",
              ])}
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
