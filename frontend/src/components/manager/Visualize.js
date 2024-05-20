import React, { useState } from "react";
import Header from "../Header";
import ManageChoi from "../manager/ManageChoice";

const Visualize = () => {
  return (
    <div>
      <Header />
      <table>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }}>
              <ManageChoi />
            </td>
            <td>
              <img
                src={require(`../../assets/tong_san_pham_theo_thang.png`)}
                className="mx-auto"
              />

              <img src={require("../../assets/so_sanh.png")}></img>
              <img src={require("../../assets/top10products.png")}></img>
              <img src={require("../../assets/top10jan.png")}></img>
              <img src={require("../../assets/top10feb.png")}></img>
              <img src={require("../../assets/top10mar.png")}></img>
              <img src={require("../../assets/top10apr.png")}></img>
              <img src={require("../../assets/top10may.png")}></img>
              <img src={require("../../assets/top10customers.png")}></img>
              <img src={require("../../assets/bot10customers.png")}></img>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Visualize;
