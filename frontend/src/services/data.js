import axios from "./customize_axios";

const fetchAllProducts = (page) => {
  return axios.get(`/products?page=${page}`);
};
export { fetchAllProducts };
