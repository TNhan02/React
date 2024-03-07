import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import {Context} from "./Context";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./components/HomePage";
import AdminPage from "./components/admin/AdminPage";
import UserPage from "./components/worker/WorkerPage";

const RootComponent = () => {
    const {user}  = useAuth();

    return (
        <Context.Provider value = {{user}} >
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin/*" element={<AdminPage />} />
                    <Route path="/worker/*" element={<UserPage />} />
                </Routes>
            </BrowserRouter>
        </Context.Provider>
    );
};

export default RootComponent;