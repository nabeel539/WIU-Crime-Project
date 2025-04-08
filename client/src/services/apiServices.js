import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4082";

// Set token in axios defaults
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const adminLogin = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
      email,
      password,
      role,
    });
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const userLogin = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
      role,
    });
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const userSignup = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/signup`,
      userData
    );
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  setAuthToken(null);
};
