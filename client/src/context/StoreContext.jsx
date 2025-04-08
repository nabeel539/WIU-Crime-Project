/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = "http://localhost:4082";
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (role) {
      localStorage.setItem("role", role);
    }
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, [token, role]);
  const contextvalue = {
    backendUrl,
    token,
    setToken,
    role,
    setRole,
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
