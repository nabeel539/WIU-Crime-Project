/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = "http://localhost:4081";
  const [token, setToken] = useState("");
  const [Username, SetUsername] = useState("");
  const [profileEmail, SetProfileEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, [token, isAdmin]);
  const contextvalue = {
    backendUrl,
    token,
    setToken,
    isAdmin,
    setIsAdmin,
    Username,
    SetUsername,
    profileEmail,
    SetProfileEmail,
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
