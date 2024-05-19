import "./App.scss";
import Header from "../src/components/Header";
import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import AppRoutes from "./routers/AppRoutes";

function App() {
  const { user, loginContext } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(
        localStorage.getItem("email"),
        localStorage.getItem("token")
      );
    }
  }, []);
  return (
    <div className="app-container">
      {/* <Header /> */}
      <Container>
        <AppRoutes></AppRoutes>
      </Container>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}

export default App;
