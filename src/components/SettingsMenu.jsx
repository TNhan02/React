import React, { useContext, useRef } from "react";
import { Context } from "../Context";
import useAuth from "../hooks/useAuth";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import "../styles/Page.css";

const SettingsMenu = () => {
    const settingsMenu = useRef(null);
    const { user } = useContext(Context);
    const { logout } = useAuth();

    const items = [
        {
            label: user.data.name,
            items: [
                {
                    label: "Change Password",
                    icon: "pi pi-id-card",
                    command: () => {
                        window.location.href = "/user/" + user.data.id + "/change_password";
                    }
                },
                {
                    label: (
                        <Button
                            label="Logout"
                            icon = "pi pi-sign-out"
                            onClick = {logout}
                            style = {{
                                backgroundColor:"white",
                                fontSize: "medium",
                                display: "auto",
                                padding: "0px",
                                border: "none",
                                textAlign: "center",
                            }}
                        />
                    )
                }
            ]
        }
    ];

    return (
        <div className="card flex justify-content-center">
            <Menu model={items} className="settings-menu" popup ref={settingsMenu} popupAlignment="right"/>
            <Button 
                label = "Settings"
                onClick = {(event) => settingsMenu.current.toggle(event)}
                className="settings-button"
            />
        </div>
    );
};

export default SettingsMenu;