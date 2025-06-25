// PrincipalDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [tRes, sRes, subjRes, dRes] = await Promise.all([
          axios.get("http://localhost:1337/api/teachers?populate=*", {
            headers,
          }),
          axios.get("http://localhost:1337/api/students?populate=*", {
            headers,
          }),
          axios.get("http://localhost:1337/api/subjects?populate=*", {
            headers,
          }),
          axios.get("http://localhost:1337/api/divisions?populate=*", {
            headers,
          }),
        ]);

        setTeachers(tRes.data?.data || []);
        setStudents(sRes.data?.data || []);
        setSubjects(subjRes.data?.data || []);
        setDivisions(dRes.data?.data || []);
      } catch (err) {
        console.error("Error loading data", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="loading-text" role="status">
        ⏳ Loading principal dashboard data...
      </p>
    );
  if (error)
    return (
      <p className="error-text" role="alert">
        {error}
      </p>
    );

  return (
    <div className="principal-container">
      <h1 className="principal-heading">🏫 Welcome, Principal!</h1>
      <p className="principal-subtext">Your school summary overview:</p>

      <InfoCard title="Teachers" icon="👩‍🏫" count={teachers.length}>
        <ul className="info-list" role="list">
          {teachers.map((t, idx) => (
            <li key={t.id || idx} role="listitem">
              {t.attributes?.name ?? "Unnamed"} |{" "}
              {t.attributes?.email ?? "No Email"}
            </li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title="Students" icon="👨‍🎓" count={students.length}>
        <ul className="info-list" role="list">
          {students.map((s, idx) => (
            <li key={s.id || idx} role="listitem">
              {s.attributes?.name ?? "Unnamed"} |{" "}
              {s.attributes?.email ?? "No Email"}
            </li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title="Subjects" icon="📚" count={subjects.length}>
        <ul className="info-list" role="list">
          {subjects.map((sub, idx) => (
            <li key={sub.id || idx} role="listitem">
              {sub.attributes?.title ?? "Untitled"}
            </li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title="Divisions" icon="🏨️" count={divisions.length}>
        <ul className="info-list" role="list">
          {divisions.map((d, idx) => (
            <li key={d.id || idx} role="listitem">
              {d.attributes?.name ?? "Unnamed"}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
};

export default PrincipalDashboard;
