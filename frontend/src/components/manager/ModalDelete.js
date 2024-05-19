import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteProduct } from "../../services/AdminService";
import { toast } from "react-toastify";

const ModalDelete = (props) => {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [dataProductDelete, setDataProductDelete] = useState([]);

  const { item, handleDeleteTableFromModal } = props;
  const handleEditProduct = (item) => {
    console.log(item);
    setDataProductDelete(item);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    handleEditProduct(item);
  };

  const handleDeleteProduct = async () => {
    let res = await deleteProduct(dataProductDelete.id);
    console.log(">>res: ", res);
    if (res && +res.statusCode === 204) {
      handleDeleteTableFromModal(dataProductDelete);
      handleClose();
      let string = "Del id=" + String(dataProductDelete.id);
      toast.success(string);
    }
  };
  useEffect(() => {
    if (show) {
      setProductName(dataProductDelete.name);
      setPrice(dataProductDelete.price);
      setImage(dataProductDelete.image);
    }
  }, [dataProductDelete]);
  return (
    <>
      <Button onClick={handleShow} className="btn btn-danger">
        <div>
          <i className="fa fa-trash"></i>
        </div>
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>Bạn có chắc muốn xóa không?</form>
          <br />
          <b>Tên = {productName}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => handleDeleteProduct()}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDelete;
