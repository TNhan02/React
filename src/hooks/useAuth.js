import { useEffect, useState } from "react";
import { getToken } from "../services/api";
import { jwtDecode } from "jwt-decode";
import storage from "../storage";

const TOKEN_KEY = storage.TOKEN_KEY;
const USERDATA_KEY = storage.USERDATA_KEY;

const useAuth = () => {
    const [user, setUser] = useState({ token: null, data: {} });

    // Login
    const login = async (username, password) => {
        const token = await getToken(username, password);
        if (token) {
            const tokenData = jwtDecode(token);
            const data = { id: tokenData["User Id"], name: tokenData["Name"], role: tokenData["Role"] };
            setUser({ ...user, token, data });
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USERDATA_KEY, JSON.stringify(data));
            window.location.href = "/";
        }
        else {
            console.error("Login failed!");
        }
    }

    // Logout
    const logout = () => {
        setUser({ ...user, token: null });
        window.location.href = "/";
    }

    // set state once
    useEffect(() => {
        try {
            setUser((u) => ({ ...u, token: localStorage.getItem(TOKEN_KEY), data: JSON.parse(localStorage.getItem(USERDATA_KEY)) }));
        } catch (e) {
            window.alert("Login failed");
            console.error(e.message);
        }
    }, []);

    return { user, login, logout };
}

export default useAuth;