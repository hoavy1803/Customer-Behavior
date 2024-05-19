import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../scss/Header.scss";

const Header = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logouted");
  };

  return (
    <div>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            LA'DH
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="header-section">
              {!localStorage.getItem("token") && (
                <Nav.Link className=".nav-link" href="/login">
                  Đăng nhập
                </Nav.Link>
              )}
              {!localStorage.getItem("token") && (
                <Nav.Link className=".nav-link" href="/register">
                  Đăng ký
                </Nav.Link>
              )}
              {localStorage.getItem("token") && (
                <Nav.Link className=".nav-link" href="#">
                  Hello, {localStorage.getItem("UserName")}!
                </Nav.Link>
              )}
              {localStorage.getItem("token") && (
                <Nav.Link className=".nav-link" href="/" onClick={handleLogout}>
                  Đăng xuất
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
