import React from "react";
import Header from "../Header";
import ManageChoi from "../manager/ManageChoice";

const Visualize = () => {
  return (
    <div>
      <Header />
      <table>
        <tbody>
          <tr>
            <td>
              <ManageChoi />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Visualize;
