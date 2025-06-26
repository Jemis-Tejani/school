// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // same axios instance with token
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacherRes = await axios.get(
          `http://localhost:1337/api/users/me`
        );
        setTeacher(teacherRes?.data);
      } catch (err) {
        console.error("Error fetching student:", err);
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
  if (!teacher) return <p>No Teacher data found.</p>;

  return (
    <div className="teacher-container">
      <h1 className="teacher-heading">
        🎓 Welcome, {teacher?.username ?? "-"}
      </h1>
      <p className="teacher-subtext">This is your personalized dashboard.</p>

      <div className="info-section">
        <h2>👤 Teacher</h2>
        <p>
          <strong>Name:</strong> {teacher?.username ?? "-"}
        </p>
        <p>
          <strong>Email:</strong> {teacher?.email ?? "-"}
        </p>
      </div>

      <div className="info-section">
        <h2>📘 Subjects You Teach</h2>
        <ul>
          <li>No subjects assigned</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
