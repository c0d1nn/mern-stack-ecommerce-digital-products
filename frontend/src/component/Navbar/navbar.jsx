import React from "react";
import "./navbar-style.css";
import { Navbar as BootstrapNavbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/img/logo.png";
import useAuth from "../../custom-hooks/useAuth";

import { toast } from "react-toastify";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    console.log("Logged out.");
    navigate("/login");
    toast.success("Success Logout");
  };
  return (
    <>
      <BootstrapNavbar bg="light" expand="lg" className="d-flex flex-column">
        <div className="container-fluid">
          <BootstrapNavbar.Brand id="logo">
            <Link to="/">
              <img
                style={{
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  width: "100px",
                  height: "50px",
                }}
                src={logo}
                alt="Logo"
              />
            </Link>
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="navbarNavAltMarkup" />
          <BootstrapNavbar.Collapse id="navbarNavAltMarkup">
            <Nav className="navbar-nav mx-auto">
              <Link
                to="/"
                className="nav-link fw-bold"
                activeClassName="active"
              >
                ADMIN
              </Link>
              <Link
                to="/article"
                className="nav-link fw-bold"
                activeClassName="active"
              >
                ARTICLE
              </Link>
              <Link
                to="/document"
                className="nav-link fw-bold"
                activeClassName="active"
              >
                DOCUMENT
              </Link>
              <Link
                to="/shareholders"
                className="nav-link fw-bold"
                activeClassName="active"
              >
                SHARE HOLDER
              </Link>
            </Nav>
            <Nav>
              <button className="nav-link fw-bold" onClick={handleLogout}>
                LOGOUT
              </button>
            </Nav>
          </BootstrapNavbar.Collapse>
        </div>
      </BootstrapNavbar>
    </>
  );
};
export default Navbar;
