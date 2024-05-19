import axios from "./customize_axios";

const token = localStorage.access_token;

// products

const postCreateOrder = (
  orderID,
  productID,
  quantity,
  totalPrice,
  orderDate,
  customerID
) => {
  return axios.post("/customer_order", {
    orderID,
    productID,
    quantity,
    totalPrice,
    orderDate,
    customerID,
  });
};

const fetchRecommendData = async () => {
  try {
    const response = await fetch(
      "Customer-Behavior\\backend\\mba-data-mining-pj\\recommend_itemsets.json"
    );
    const jsonData = await response.json();
    // setData(jsonData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export { postCreateOrder, fetchRecommendData };
