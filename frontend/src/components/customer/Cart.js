import React, { useEffect, useState } from "react";
import { useCart, CartProvider } from "react-use-cart";
import { postCreateOrder } from "../../services/CustomerService";
import moment from "moment"; // hoặc import { format } from 'date-fns';
import { toast } from "react-toastify";

const Cart = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedDateTime = moment(currentTime).format(
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
  );
  //   console.log(localStorage.access_token);
  //   const decoded = jwtDecode(localStorage.access_token);

  let {
    items,
    isEmpty,
    totalItems,
    totalUniqueItems,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //   useEffect(() => {
  //     console.log(items);
  //   }, [items]);

  // const base64Image = items.item.image.$binary.base64;
  if (isEmpty) return <h1 className="text-center">Giỏ hàng đang trống</h1>;

  const payAll = async () => {
    // Tạo danh sách các id và danh sách số lượng
    const listID = items.map((item) => item.id);
    const listQuantity = items.map((item) => item.quantity);
    console.log("listID >>>", listID);
    console.log("listQ", listQuantity);

    // Gửi yêu cầu đặt hàng
    let res = await postCreateOrder(
      "",
      listID,
      listQuantity,
      cartTotal,
      formattedDateTime,
      localStorage.getItem("token")
    );
    console.log("res", res);

    // Xử lý kết quả
    if (res && res.data.message) {
      toast.success("Ordered sucess");
      emptyCart();
    } else {
      alert("Error while ordering");
    }
  };

  return (
    <>
      <CartProvider>
        <section className="py-4 container">
          <div className="row justify-content-center">
            <div className="col-12">
              <h5>Giỏ hàng ({totalUniqueItems})</h5>
              <table className="table table-light table-hover m-0">
                <tbody>
                  {items.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <img src={item.Image} style={{ height: "6rem" }} />
                        </td>
                        <td>{item.title}</td>
                        <td>Giá: {item.price}</td>
                        <td>Số lượng: {item.quantity}</td>
                        <td>
                          <button
                            className="btn btn-info ms-2"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <button
                            className="btn btn-info ms-2"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-auto ms-auto">
              {/* <h5>Tổng sản phẩm: {totalItems}</h5> */}
              <h2>Tổng tiền: {cartTotal}đ</h2>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-danger m-2"
                onClick={() => emptyCart()}
              >
                Xóa giỏ hàng
              </button>
              <button
                className="btn btn-primary m-2"
                onClick={() => {
                  payAll();
                }}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </section>
      </CartProvider>
    </>
  );
};
export default Cart;
