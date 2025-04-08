import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // const validateToken = async (token) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/api/auth/validate`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setUser(response.data.user);
  //   } catch (error) {
  //     console.error("Token validation failed:", error.message);
  //     // localStorage.removeItem("token");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      setUser({ role });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
