import React, { useState } from "react";
import { useCart } from "react-use-cart";
import { toast } from "react-toastify";

const ItemCard = (props) => {
  const { addItem, items } = useCart();
  // console.log('check props >>> ', props);

  // const base64Image = props.img.$binary.base64;

  const handleAddCart = () => {
    addItem({
      item: props.item,
      id: props.item.ProductID,
      price: props.price,
      title: props.title,
    });
    console.log("check cart >>>", items);

    toast.success("Thêm giỏ hàng thành công!");
  };

  return (
    <div className="col-11 col-md-6 col-lg-3 mx-0 mb-4">
      <div className="card p-0 overflow-hidden h-100 shadow">
        <div className="card-body text-center">
          {/* {base64Image && (
                        <img src={`data:image/png;base64,${base64Image}`} alt={props.title} className="card-img-top img-fluid" style={{ alignSelf: "center", maxWidth: "200px", maxHeight: "150px" }} />
                    )} */}
          <img
            src={props.img}
            alt={props.title}
            className="card-img-top img-fluid"
            style={{
              alignSelf: "center",
              maxWidth: "200px",
              maxHeight: "150px",
            }}
          />
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-title">{props.price}đ</p>
        </div>
        <div className="card-body text-center">
          <button className="btn btn-success" onClick={() => handleAddCart()}>
            <i className="fa fa-cart-plus"></i>
          </button>
          <span>Thêm vào giỏ</span>
        </div>
      </div>
    </div>
  );
};
export default ItemCard;
