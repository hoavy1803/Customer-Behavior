import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { fetchAllProducts } from "../../services/data";
import Header from "../Header";
import { CartProvider } from "react-use-cart";
import Cart from "./Cart";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../../scss/ShowItems.scss";
import ReactPaginate from "react-paginate";
import { fetchRecommendData } from "../../services/CustomerService";

const ShowItems = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [searchResults, setSearchResults] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProducts / itemsPerPage));
  }, [totalProducts]);

  const getProducts = async (page) => {
    let res = await fetchAllProducts(page);
    console.log("res>>>", res);
    if (res && res.data) {
      setProducts(res.data);
      setTotalProducts(res.data.length); // Đây không phải là tổng số sản phẩm, mà là độ dài của mảng dữ liệu trả về
    }
  };

  const handleChange = (event) => {
    setSearchItem(event.target.value);
  };

  const getRecommendProduct = () => {
    let res = fetchRecommendData;

    console.log("check recommend >>>", res.data);
    if (res && res.data) {
      setSearchResults(res.data);
    }
  };

  const handlePageClick = (event) => {
    console.log("event_lib:", event);
    setCurrentPage(+event.selected + 1);
    getProducts(currentPage); // thêm dấu + ở đầu: convert str sang number
  };

  return (
    <>
      <Header />
      <CartProvider>
        <div
          className="d-sm-flex justify-content-between"
          style={{ marginBottom: "20px", marginTop: "20px" }}
        >
          <div>
            <span className="func-button">
              <Button onClick={getRecommendProduct}>
                <i className="fa fa-search"></i>
              </Button>
            </span>
          </div>
          <input
            className="form-control"
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={searchItem}
            onChange={handleChange}
          />
          <div className="func-button">
            {" "}
            <Button
              onClick={handleShow}
              className="btn btn-success"
              style={{ marginLeft: "auto" }}
            >
              <i className="fa fa-shopping-cart"></i>
            </Button>
          </div>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          size="lg"
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Giỏ hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-dialog-scrollable">
            <Cart />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <section className="py-3 container">
          <div className="row justify-content-center">
            {products &&
              products.length > 0 &&
              products.slice(startIndex, endIndex).map((item, index) => {
                return (
                  <ItemCard
                    img={item.Image}
                    title={item.ProductName}
                    price={item.Price}
                    item={item}
                    key={index}
                  />
                );
              })}
          </div>
        </section>
      </CartProvider>
      <div className="paginate d-flex justify-content-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </>
  );
};

export default ShowItems;
