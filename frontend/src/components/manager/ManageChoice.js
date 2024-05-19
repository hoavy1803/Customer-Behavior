import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../scss/ManageChoice.scss";

const ManageChoice = () => {
  const navigate = useNavigate();

  const handleProducts = async () => {
    navigate("/manage_products");
  };

  const handleOrders = async () => {
    navigate("/orders");
  };

  const handleStatistic = async () => {
    navigate("/visualize");
  };

  const [selectedButton, setSelectedButton] = useState(null);

  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>
              <button
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 active:bg-brown-500 active:text-white border-spacing-2 "
                onClick={() => {
                  handleProducts();
                  handleClick(1);
                }}
                style={{
                  backgroundColor: selectedButton === 1 ? "#debb9c" : "white",
                }}
              >
                Sản phẩm
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                className="buttonchoice"
                onClick={() => {
                  handleOrders();
                  handleClick(2);
                }}
                style={{
                  backgroundColor: selectedButton === 2 ? "#debb9c" : "white",
                }}
              >
                Đơn hàng
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                className="buttonchoice"
                onClick={() => {
                  handleStatistic();
                  handleClick(3);
                }}
                style={{
                  backgroundColor: selectedButton === 3 ? "#debb9c" : "white",
                }}
              >
                Thống kê
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ManageChoice;
