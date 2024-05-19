import { useContext, useEffect, useState } from "react";
import "../scss/Login.scss";
import { loginApi } from "../services/AdminService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const { loginContext } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userName || !password) {
      toast.error("Email/Password is required!");
      return;
    }
    setLoadingApi(true);
    let res = await loginApi(userName.trim(), password.trim());
    if (res && res.data) {
      localStorage.setItem("token", res.data.UserID);

      if (res.data.UserID.includes("@ladh")) {
        navigate("/manage_products");
      } else {
        navigate("/show_items");
      }
    } else {
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingApi(false);
  };
  const handleEnter = (e) => {
    if (e && e.key === "Enter") {
      handleLogin();
    }
  };
  const handleGoBack = async () => {
    navigate("/");
  };
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  //   setShowIcon(!showIcon);
  // };
  return (
    <div className="login-container col-12 col-sm-4 ">
      <span className="title">LOGIN</span>
      <div className="text">Username</div>
      <input
        placeholder="username"
        className="form-control"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={(e) => handleEnter(e)}
      />

      <input
        placeholder="password"
        className="form-control"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => handleEnter(e)}
      />

      <button
        className={userName && password ? "active" : ""}
        disabled={userName && password ? false : true}
        onClick={handleLogin}
      >
        {loadingApi && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        Login
      </button>
      <span>
        <i className="fa-solid fa-angles-left" />
        <span onClick={handleGoBack}> Back</span>
      </span>
    </div>
  );
};
export default Login;
