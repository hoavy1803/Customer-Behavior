import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../services/AdminService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";
import Header from "../Header";
// import '../../../scss/Table.scss'

const TableProducts = () => {
  const [listProducts, setListProducts] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [originList, setOriginList] = useState([]);
  const [findProductName, setFindProductName] = useState("");
  // const [sortBy,setSortBy]=useState('asc');
  const [totalProduct, setTotalProducts] = useState([]);
  // const [sortField,setSortField]=useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    getProducts(1);
  }, []);
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
  // const handleSort= (sortBy,sortField)=>{
  //   setSortBy(sortBy);
  //   setSortField(sortField);

  //   const _ = require('lodash');
  //   let cloneListProducts = _.cloneDeep(listProducts);
  //   cloneListProducts= _.orderBy( cloneListProducts,[sortField],[sortBy])
  //   setListProducts(cloneListProducts)
  // }

  const handleSearch = _.debounce((event) => {
    let term = event.target.value.toLowerCase();
    console.log("check term: ", term);

    if (term) {
      const _ = require("lodash");
      let cloneListProducts = _.cloneDeep(originList);
      cloneListProducts = cloneListProducts.filter((item) =>
        item.ProductName.toLowerCase().includes(term)
      );
      setListProducts(cloneListProducts);
    } else {
      getProducts(1);
    }
  }, 2000);

  const getProducts = async (page) => {
    let res = await fetchAllProducts(page);
    console.log("res >>>", res);
    if (res && res.data) {
      setTotalPages(res.total_pages);
      setTotalProducts(res.total);
      setListProducts(res.data);
      setOriginList(res.data);
    }
  };
  // const itemsPerPage=6
  // const endOffset = itemOffset + itemsPerPage;
  // const currentProduct = totalProducts.slice(itemOffset, endOffset);
  // const pageCount = Math.ceil(totalProducts.length / itemsPerPage);

  const handlePageClick = (event) => {
    getProducts(+event.selected + 1);
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProduct / itemsPerPage));
  }, [totalProduct]);

  return (
    <>
      <Header />
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="Search by name"
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <div className="d-sm-flex justify-content-between">
        <span>List Product:</span>
        <div className="func-button">
          <ModalAddNew handleUpdateTable={handleUpdateTable} />
        </div>
      </div>
      <div className="customize-table">
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
              listProducts.slice(startIndex, endIndex).map((item, index) => {
                return (
                  <tr key={`item${index}`}>
                    <td>{item.ProductID}</td>
                    <td>{item.ProductName}</td>
                    <td>{item.Price}</td>
                    <td>
                      <ModalEdit
                        item={item}
                        handleUpdateTable={handleUpdateTable}
                        handleUpdateTableFromModal={handleUpdateTableFromModal}
                      />
                      <ModalDelete
                        item={item}
                        handleUpdateTable={handleUpdateTable}
                        handleDeleteTableFromModal={handleDeleteTableFromModal}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <div className="paginate">
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
