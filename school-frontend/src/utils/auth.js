// src/utils/auth.js

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // window.location.href = "/login"; // Uncomment if needed
};

export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
