// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios.js";
import "./Login.css";
import { setToken, setUser } from "../../utils/storage.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    try {
      const res = await axios.post("/auth/local", {
        identifier: email,
        password,
      });

      const { jwt } = res.data;
      if (!jwt) throw new Error("JWT not received from server");

      setToken(jwt);

      const meRes = await axios.get("/users/me?populate=role", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const user = meRes.data;
      setUser(user);

      const role = user?.role?.name?.toLowerCase();

      if (!role) {
        setError("No role assigned to this user. Please contact admin.");
        return;
      }

      switch (role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "principal":
          navigate("/admin-dashboard");
          break;
        default:
          setError("Unknown role assigned to user.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">School Login</h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="login-input-group">
            <label htmlFor="email" className="login-label">
              Email:
            </label>
            <input
              id="email"
              type="email"
              className={`login-input ${emailError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {emailError && <p className="field-error">{emailError}</p>}
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">
              Password:
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`login-input ${passwordError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {passwordError && <p className="field-error">{passwordError}</p>}

            <div className="show-password-toggle">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
