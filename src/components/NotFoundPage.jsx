import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const redirectToHomePage = () => {
        navigate("/");
    }

    return (
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <h1 style={{ fontSize: "4em" }}></h1>
            <span style={{ cursor: "pointer" }} onClick={() => redirectToHomePage()}>
            </span>
        </div>
    );
};

export default NotFoundPage;