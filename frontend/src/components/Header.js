import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
const Header = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.removeItem();
    navigate("/");
    toast.success("Logouted");
  };

  return (
    <div>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#" className="mr-auto">
            LA'DH
          </Navbar.Brand>
          {/* Sử dụng mr-auto để đẩy sang bên trái */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto header-section">
              {/* Sử dụng ml-auto để đẩy sang bên phải */}
              {/* {localStorage.getItem("token") === "123456789" && (
          <Nav.Link href="/cart">Giỏ hàng</Nav.Link>
        )} */}
              {!localStorage.getItem("token") && (
                <Nav.Link href="/login">Đăng nhập</Nav.Link>
              )}
              {!localStorage.getItem("token") && (
                <Nav.Link href="/register">Đăng ký</Nav.Link>
              )}
              {localStorage.getItem("token") && (
                <Nav.Link href="#">
                  Hello, {localStorage.getItem("UserName")}!
                </Nav.Link>
              )}
              {localStorage.getItem("token") && (
                <Nav.Link href="/" onClick={handleLogout}>
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
