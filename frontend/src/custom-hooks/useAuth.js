// export default useAuth;
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastVisitedPage, setLastVisitedPage] = useState("/");
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(
    sessionStorage.getItem("token") || null
  );

  const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
      if (error.response && error.response.status === 401) {
        toast.danger("Token expired. Silahkan Login Kembali");
        logout();
      } else {
        console.error("Error fetching user data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized! Token might be expired.");
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        setAuthToken(storedToken);
        setLastVisitedPage(sessionStorage.getItem("lastVisitedPage") || "/");
        await fetchUserData();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [authToken]);

  const handleTokenRefresh = async (refreshToken) => {
    try {
      const response = await axios.post(`${baseURL}/auth/token`, {
        refreshToken: refreshToken,
      });

      if (response.data.accessToken) {
        const newAccessToken = response.data.accessToken;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        sessionStorage.setItem("token", newAccessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        console.log("Token refreshed successfully.");
      } else {
        console.error(
          "Invalid access token in refresh response:",
          response.data
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      navigate("/login");
    }
  };

  // const login = async (email, password) => {
  //   try {
  //     const response = await axios.post(`${baseURL}/auth/login`, {
  //       email,
  //       password,
  //     });

  //     // console.log("Server Response:", response.data);

  //     const token = response.data.accessToken;
  //     if (token) {
  //       // console.log("Received Token:", token);
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("lastVisitedPage", lastVisitedPage);
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //       await fetchUserData();
  //       // console.log("Login Successful. Redirecting to", lastVisitedPage);
  //       navigate(lastVisitedPage);
  //     } else {
  //       console.error("No access token received from the server");
  //     }
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //   }
  // };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      });
      // console.log("Server Response:", response.data);

      const { accessToken, refreshToken } = response.data;
      if (accessToken) {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        setAuthToken(accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        await fetchUserData();
        return true;
      } else {
        console.error("No access token received from the server");
        return false;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    setAuthToken(null);
    setCurrentUser(null);
    navigate("/login");
    toast.info("Anda telah logout karena sesi berakhir.");
  };

  const updateLastVisitedPage = (page) => {
    sessionStorage.setItem("lastVisitedPage", page);
    setLastVisitedPage(page);
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    handleTokenRefresh,
    setLastVisitedPage: updateLastVisitedPage,
  };
};

export default useAuth;
