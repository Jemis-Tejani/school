// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userRes = await axios.get("/users/me");
        const userId = userRes.data.id;

        const studentRes = await axios.get(
          `http://localhost:1337/api/students/psab5eomez3trrxk23dtngac`
        );

        const studentData = studentRes.data?.data?.[0];
        setStudent(studentData || null);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("🚫 Failed to load student data.");
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

  const { name, email, division, subjects } = student.attributes;

  return (
    <div className="student-container">
      <h1 className="student-heading">🎓 Welcome, {name}!</h1>
      <p className="student-subtext">Here's your academic info:</p>

      <div className="info-section">
        <h2>👤 Profile</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Division:</strong>{" "}
          {division?.data?.attributes?.name ?? "Not Assigned"}
        </p>
      </div>

      <div className="info-section">
        <h2>📘 Subjects You're Enrolled In</h2>
        <ul>
          {subjects?.data?.length > 0 ? (
            subjects.data.map((sub) => (
              <li key={sub.id}>{sub.attributes.title}</li>
            ))
          ) : (
            <li>No subjects assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
