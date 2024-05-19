import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../services/AdminService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";
import Header from "../Header";
import ManageChoice from "../manager/ManageChoice";
// import '../../../scss/Table.scss'

const TableProducts = () => {
  const [listProducts, setListProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [originList, setOriginList] = useState([]);
  const [totalProduct, setTotalProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [query, setQuery] = useState("");

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProduct / itemsPerPage));
  }, [totalProduct]);

  const getProducts = async (page) => {
    let res = await fetchAllProducts(page);
    console.log("res >>>", res);
    if (res && res.data) {
      // setTotalPages(res.data.length);
      setTotalProducts(res.data.length);
      setListProducts(res.data);
      setOriginList(res.data);
    }
  };

  const _ = require("lodash");

  const handleUpdateTable = (item) => {
    setListProducts([item, ...listProducts]);
  };
  const handleUpdateTableFromModal = (item) => {
    let cloneListProducts = _.cloneDeep(listProducts);
    let index = listProducts.findIndex(
      (item) => item.ProductID === item.ProductID
    );
    cloneListProducts[index].ProductName = item.ProductName;
    setListProducts(cloneListProducts);
    console.log(">>edit index", index);
    console.log("Check clone>> :", cloneListProducts);
  };
  const handleDeleteTableFromModal = (item) => {
    let cloneListProducts = _.cloneDeep(listProducts);
    cloneListProducts = cloneListProducts.filter(
      (item) => item.ProductID !== item.ProductID
    );
    setListProducts(cloneListProducts);
    console.log("Deleted clone>> :", cloneListProducts);
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    getProducts(currentPage);
  };

  return (
    <>
      <Header />

      <div
        className="d-sm-flex justify-content-between"
        style={{ marginBottom: "20px", marginTop: "20px" }}
      >
        <span>
          <input
            className="form-control"
            placeholder="Tìm kiếm..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </span>
        <div className="func-button">
          <ModalAddNew handleUpdateTable={handleUpdateTable} />
        </div>
      </div>
      <div className="customize-table">
        <Table>
          <tr>
            <td>
              <ManageChoice />
            </td>
            <td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listProducts &&
                    listProducts.length > 0 &&
                    listProducts
                      .filter((post) => {
                        if (query === "") {
                          return post;
                        } else if (
                          post.ProductName.toLowerCase().includes(
                            query.toLowerCase()
                          )
                        ) {
                          return post;
                        }
                      })
                      .slice(startIndex, endIndex)
                      .map((item, index) => {
                        return (
                          <tr key={`item${index}`}>
                            <td>{item.ProductID}</td>
                            <td>{item.ProductName}</td>
                            <td>{item.Price}</td>
                            <td>
                              <ModalEdit
                                item={item}
                                handleUpdateTable={handleUpdateTable}
                                handleUpdateTableFromModal={
                                  handleUpdateTableFromModal
                                }
                              />
                              <ModalDelete
                                item={item}
                                handleUpdateTable={handleUpdateTable}
                                handleDeleteTableFromModal={
                                  handleDeleteTableFromModal
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </Table>
            </td>
          </tr>
        </Table>
      </div>
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
export default TableProducts;
