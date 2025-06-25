/* eslint-disable no-undef */
// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentRes = await axios.get(
          `http://localhost:1337/api/users/me`
        );
        setStudent(studentRes.data || null); // Data is in studentRes.data
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

  return (
    <div className="student-container">
      {/* Use student.username instead of undefined 'name' variable */}
      <h1 className="student-heading">🎓 Welcome, {student.username}!</h1>
      <p className="student-subtext">Here's your academic info:</p>

      <div className="info-section">
        <h2>👤 Profile</h2>
        {/* Access email directly from student object */}
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        {/* Division needs to be implemented separately */}
        <p>
          <strong>Division:</strong> Not Implemented
        </p>
      </div>

      <div className="info-section">
        <h2>📘 Subjects You're Enrolled In</h2>
        {/* Subjects needs to be implemented separately */}
        <ul>
          <li>Subject data not implemented</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
