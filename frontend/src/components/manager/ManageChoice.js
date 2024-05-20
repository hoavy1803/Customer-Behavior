import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../scss/ManageChoice.scss";

const ManageChoice = () => {
  const navigate = useNavigate();

  const handleProducts = async () => {
    navigate("/manage_products");
  };

  const handleOrders = async () => {
    navigate("/table_orders");
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
            <td className="button-contain">
              <button
                className=" text-black custom-button"
                onClick={() => {
                  handleClick(1);
                  handleProducts();
                }}
                style={{
                  backgroundColor: selectedButton === 1 ? "#debb9c" : "white",
                }}
              >
                Sản phẩm
              </button>

              <button
                className="text-black custom-button"
                onClick={() => {
                  handleClick(2);
                  handleOrders();
                }}
                style={{
                  backgroundColor: selectedButton === 2 ? "#debb9c" : "white",
                }}
              >
                Đơn hàng
              </button>

              <button
                className="text-black custom-button"
                onClick={() => {
                  handleClick(3);
                  handleStatistic();
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
