// src/utils/auth.js

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user data:", err);
    return null;
  }
};

export const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
