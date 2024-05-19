import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import TableProducts from "../components/manager/TableProducts";
import TableOrder from "../components/manager/TableOder";
import Visualize from "../components/manager/Visualize";
import Login from "../components/Login";
import ShowItems from "../components/customer/ShowItems";
import Cart from "../components/customer/Cart";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/manage_products" element={<TableProducts />} />
        <Route path="/table_orders" element={<TableOrder />} />
        <Route path="/visualize" element={<Visualize />} />

        <Route path="/show_items" element={<ShowItems />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
