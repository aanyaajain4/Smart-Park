import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HeaderAfterLogin.css";
const HeaderAfterLogin = () => {
  const auth = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <Link className="link_btn" to="/">
            Parkeaze
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link className="link_btn" to="/user">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link className="link_btn" to="/driveout">
                  Drive Out
                </Link>
              </li>

              <li class="nav-item">
                <Link className="link_btn" to="/about">
                  About
                </Link>
              </li>
              <li class="nav-item">
                <Link className="link_btn" to="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
            <div class="d-flex" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link className="link_btn" to="/profile">
                    Profile
                  </Link>
                </li>
                <li class="nav-item">
                  <Link className="link_btn" onClick={logout} to="/">
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderAfterLogin;
