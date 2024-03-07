import React from "react";
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import AdminHeader from "./AdminHeader";
import { Route, Routes } from "react-router-dom";
import "../../styles/Page.css";

const AdminPage = () => {
    return (
        <div>
            <AdminHeader />
            <Routes>
                <Route path="users" element={<UserTable />} />
                <Route path="products" element={<ProductTable />} />
            </Routes>
        </div>
    );
}

export default AdminPage;