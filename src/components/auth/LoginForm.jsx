import React, { useState } from "react";
import { Button } from "primereact";
import { InputText } from "primereact/inputtext";
import CurrentDateTime from "../CurrentDateTime";
import useAuth from "../../hooks/useAuth";
import products from "../auth/Products.png"
import "../../styles/LoginForm.css"

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  }

  return (
    <div className="login-page">
      <div className="login-pic">
        <img src={products}></img>
      </div>

      <div className="login-form">
        <div className="field">
          <CurrentDateTime />
        </div>
        <form onSubmit={handleLogin}>
          <div className="field">
            <div className="field">Username<br></br></div>
            <InputText
              style={{ borderRadius: "8px" }}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <div className="field">Password<br></br></div>
            <InputText
              style={{ borderRadius: "8px" }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <Button style={{ borderRadius: "10px", backgroundColor: "#00FFFF", width: "150px", justifyContent: "center" }} variant="primary" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;