import axios from "./customize_axios";
//get method

const token = localStorage.access_token;

const fetchAllProducts = () => {
  return axios.get("/products");
};

const fetchAllOrder = () => {
  return axios.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//post method
const postNewProduct = (name, id, price, image) => {
  //{"ProductName" : product.name, "ProductID" : product.id, "Price" : product.price, "Image": product.image}
  return axios.post(
    "/add_product",
    { name, id, price, image },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const postEditProduct = (name, id, price, image) => {
  return axios.post(
    "/edit_product",
    { name, id, price, image },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//delete method

const deleteProduct = (id) => {
  return axios.delete(`/products${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const loginApi = (userId, password) => {
  return axios.post("/login", { userId, password });
};

export {
  fetchAllProducts,
  fetchAllOrder,
  postNewProduct,
  postEditProduct,
  deleteProduct,
  loginApi,
};
