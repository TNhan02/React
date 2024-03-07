import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact";
import { editEntityById } from "../services/api";
import { Password } from "primereact/password";
import { Context } from "../Context";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useContext(Context);
  const toast = useRef(null);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("React_USERDATA"));
    editEntityById("User", userData.id, { password: newPassword }, user.token).then(() => {
      toast.current.show({ severity: "success", summary: s.toastSuccesful, detail: "Changed password successfully", life: 3000 });
      setPassword("");
      setNewPassword("");
    });
  };

  const footer = (
    <>
      <Divider />
    </>
  );

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="login-card">
        <form className="passwordform" onSubmit={handlePasswordChange}>
          <div className="field">
            <Password
              style={{ borderRadius: "8px" }}
              placeholder= "New password"
              footer={footer}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <Password
              className="password2"
              style={{ borderRadius: "8px" }}
              placeholder="Confirm new password"
              footer={footer}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div>{password !== newPassword && <small className="p-error">Password doesn't match</small>}</div>
          </div>
          <div className="field">
            <Button
              disabled={password != newPassword}
              style={{ borderRadius: "10px", backgroundColor: "#ff7a00", width: "200px", justifyContent: "center" }}
              variant="primary"
              type="submit"
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
