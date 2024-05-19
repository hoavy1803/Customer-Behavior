import React from "react";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import "../scss/Home.scss";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Header />

      <table className="grid grid-cols-2">
        <tr>
          <td className="col-span-1 center-button">
            <h1 className="text-center">LA'DH</h1>
            <h6 className="text-center">
              Mua sắm dễ dàng, vận chuyển nhanh chóng
            </h6>
            <button className="custom-button" onClick={handleClick}>
              Đăng nhập
            </button>
          </td>
          <td className="col-span-1">
            <img src={require("../assets/noodles.png")} alt="Noodles" />
          </td>
        </tr>
      </table>
    </>
  );
};

export default Home;
