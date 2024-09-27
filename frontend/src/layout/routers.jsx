//routers.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Admin from "../pages/Admin/admin";
import Article from "../pages/Article/article";
import Document from "../pages/Document/document";
import Login from "../pages/Login/login";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../custom-hooks/useAuth";
import ShareHolders from "../pages/shareHolders/shareHolders";

const Routers = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/admin" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/article"
        element={
          <ProtectedRoute>
            <Article />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document"
        element={
          <ProtectedRoute>
            <Document />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shareholders"
        element={
          <ProtectedRoute>
            <ShareHolders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
