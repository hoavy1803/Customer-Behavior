import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { fetchAllOrder } from "../../services/AdminService";
import ReactPaginate from "react-paginate";
import ManageChoice from "./ManageChoice";
import Header from "../Header";
// import '../../../scss/Table.scss'

const TableOrder = () => {
  const [listOrders, setListOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [originList, setOriginList] = useState([]);
  const [totalOrder, setTotalOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [query, setQuery] = useState("");

  useEffect(() => {
    getOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalOrder / itemsPerPage));
  }, [totalOrder]);

  const getOrders = async (page) => {
    let res = await fetchAllOrder(page);
    console.log("res >>>", res);
    if (res && res.data) {
      // setTotalPages(res.data.length);
      setTotalOrders(res.data.length);
      setListOrders(res.data);
      setOriginList(res.data);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
    getOrders(currentPage);
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
                    <th>Mã đơn hàng</th>
                    <th>Mã khách hàng</th>
                    <th>Mã sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                    <th>Ngày đặt hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {listOrders &&
                    listOrders.length > 0 &&
                    listOrders
                      .filter((post) => {
                        if (query === "") {
                          return post;
                        } else if (
                          post.DeliveryDate.toLowerCase().includes(
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
                            <td>{item.OrderID}</td>
                            <td>{item.CustomerID}</td>
                            <td>{item.ProductID}</td>
                            <td>{item.QuantityOrder}</td>
                            <td>{item.TotalPrice}</td>
                            <td>{item.DeliveryDate}</td>
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
export default TableOrder;
