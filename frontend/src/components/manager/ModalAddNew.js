import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { postNewProduct } from "../../services/AdminService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
  const { handleUpdateTable } = props;
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");

  const handleSaveChange = async () => {
    let res = await postNewProduct(productName, productID, price, image);

    console.log(">>>> check res: ", res);
    if (res && res.id) {
      handleClose();
      setProductName("");
      setProductID("");
      setPrice(0);
      setImage("");
      toast.success("Thêm sản phẩm thành công");
      handleUpdateTable({
        name: productName,
        id: productID,
        price: price,
        image: image,
      });
    } else {
      alert("Lỗi");
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="btn btn-success">
        <i className="fa-solid fa-circle-plus" />
        Thêm sản phẩm
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Tên sản phẩm
              </label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
            </div>

            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Mã sản phẩm
              </label>
              <input
                type="text"
                className="form-control"
                value={productID}
                onChange={(event) => setProductID(event.target.value)}
              />
            </div>

            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Đơn giá
              </label>
              <input
                type="text"
                className="form-control"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>

            <div className="mb-3 form-check">
              <label for="exampleInputPassword1" className="form-label">
                Link ảnh
              </label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => handleSaveChange()}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddNew;
