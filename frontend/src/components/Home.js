import React from "react";
import Header from "./Header";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <Table className="equal-columns-table">
        <tbody>
          <tr>
            <td>
              <Button className="btn btn-info" onClick={handleClick}>
                Đăng nhập
              </Button>
            </td>
            <td>
              <img src={require("../assets/noodles.png")} alt="Noodles" />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
