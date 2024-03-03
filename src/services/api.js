// Generate api functions

import { json } from "react-router-dom";

const headers = {
    "Content-Type": "application/json"
};

const getToken = async (username, password) => {
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/AuthToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        return data.token;
    } catch (e) {
        window.alert("Failed to get token");
    }
};

const getAllEntities = async (path, pageNumber, pageSize, token) => {
    const query = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/" + path + query, { headers: { ...headers, Authorization: "Bearer " + token } });
        return await res.json();
    }
    catch (exception) {
        window.alert("Failed to fetch entities");
    }
};

const getEntityById = async (path, id, token) => {
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/" + path + "/" + id, { headers: { ...headers, Authorization: "Bearer" + token } });
        return await res.json();
    }
    catch (exception) {
        window.alert("Failed to fetch an entity");
    }
};

const createEntity = async (path, data, token) => {
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/" + path, {
            method: "POST",
            headers: { ...headers, Authorization: "Bearer" + token },
            body: JSON.stringify(data)
        });
        return res.status === 201 ? true : false;
    }
    catch (exception) {
        window.alert("Failed to create an entity");
    }
};

const editEntityById = async (path, id, data, token) => {
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/" + path + "/" + id, {
            method: "PATCH",
            headers: { ...headers, Authorization: "Bearer" + token },
            body: JSON.stringify(data)
        });
        return res.status === 200 ? true : false;
    }
    catch (exception) {
        window.alert("Failed to edit an entity");
    }
};

const deleteEntityById = async (path, id, token) => {
    try {
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/" + path + "/" + id, {
            method: "DELETE",
            headers: { ...headers, Authorization: "Bearer" + token }
        });
        return res.status === 204 ? true : false;
    }
    catch (exception) {
        window.alert("Failed to delete an entity");
    }
};

export { getToken, getAllEntities, getEntityById, createEntity, editEntityById, deleteEntityById };