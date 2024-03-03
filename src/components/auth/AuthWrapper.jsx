import React, {useContext} from "react";
import LoginForm from "./LoginForm";
import { Context } from "../../Context";
import { Navigate } from "react-router-dom";

const AuthWrapper = () => {
    const {user} = useContext(Context);

    if(user?.data?.role === "Admin") {
        return <Navigate to = "/admin/users"/>
    }
    if(user?.data?.role === "User") {
        return <Navigate to = "/user/"/>
    }
    return <LoginForm />;
};

export default AuthWrapper;