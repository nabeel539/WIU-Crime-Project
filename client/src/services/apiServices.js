import axios from "axios";

const API_BASE_URL = "http://localhost:4000"; // Replace with your backend URL

export const adminLogin = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userLogin = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userSignup = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/signup`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
