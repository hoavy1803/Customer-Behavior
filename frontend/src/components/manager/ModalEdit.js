import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { postEditProduct } from "../../services/AdminService";
import { toast } from "react-toastify";

const ModalEdit = (props) => {
  const [show, setShow] = useState(false);
  const [productID, setID] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [dataProductEdit, setDataProductEdit] = useState([]);

  const { item, handleUpdateTableFromModal } = props;
  const handleEditProduct = (item) => {
    console.log(item);
    setDataProductEdit(item);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    handleEditProduct(item);
  };

  const handleEditProductInfo = async () => {
    let res = await postEditProduct(productName, productID, price, image);
    if (res && res.createdAt) {
      handleUpdateTableFromModal({
        name: productName,
        productId: dataProductEdit.ProductID,
        price: price,
        image: image,
      });
      console.log(">>id: ", dataProductEdit.ProductID);
      handleClose();
      toast.success("An Product Updated");
    }
  };
  useEffect(() => {
    if (show) {
      setID(dataProductEdit.ProductID);
      setProductName(dataProductEdit.ProductName);
      setPrice(dataProductEdit.Price);
      setImage(dataProductEdit.Image);
    }
  }, [dataProductEdit]);
  return (
    <>
      <Button onClick={handleShow} className="btn btn-warning mx-3">
        <i className="fa fa-pen-square"></i>
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mã sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={productID}
                onChange={(event) => setID(event.target.value)}
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
            onClick={() => handleEditProductInfo()}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEdit;
