import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const baseURL = import.meta.env.VITE_API_BASE_URL;

        // Step 1: Logged-in user info
        const userRes = await axios.get(`${baseURL}/api/users/me`, {
          headers,
        });
        const userEmail = userRes.data.email;

        // Step 2: Fetch teacher by email
        const teacherRes = await axios.get(
          `${baseURL}/api/teachers?filters[email][$eq]=${userEmail}&populate=division,subjects`,
          { headers }
        );

        const teacherData = teacherRes.data?.data?.[0];

        if (!teacherData) {
          setError("❌ No matching teacher found for this user.");
          return;
        }

        setTeacher(teacherData);
      } catch (err) {
        console.error("Fetch teacher failed:", err);
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
  if (!teacher?.attributes)
    return <p className="error-text">Teacher data is incomplete.</p>;

  const { name, email, division, subjects } = teacher.attributes;

  return (
    <div className="teacher-container">
      <h1 className="teacher-heading">📘 Welcome, {name}!</h1>
      <p className="teacher-subtext">This is your personalized dashboard.</p>

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
        <h2>📚 Subjects You Teach</h2>
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

export default TeacherDashboard;
