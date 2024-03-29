import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null; // Return null instead of throwing an error
      }
      const { data } = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post("/auth/login", data);
      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const userData = await getUser();
        if (userData) {
          alert("Login success");
          navigate("/");
        } else {
          throw new Error("Failed to fetch user data after login");
        }
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("An error occurred during login.");
      }
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post("/auth/register", formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const userData = await getUser();
        if (userData) {
          navigate("/");
        } else {
          throw new Error("Failed to fetch user data after registration");
        }
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data.message) {
        setSignUpError(error.response.data.message);
      } else {
        setSignUpError("An error occurred during registration.");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loginError, signUpError, getUser, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
