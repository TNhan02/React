import { useEffect, useState, useContext } from "react";
import { getAllEntities } from "../services/api";
import { Context } from "../Context";

const path = "User";

const useUser = (pageNumber, pageSize) => {
    const [allUsers, setAllUsers] = useState([]);
    const {user} = useContext(Context);

    // Get once
    useEffect(() => {
        if(user.token) {
            getAllEntities(path, pageNumber, pageSize, user.token)
                .then((data) => setAllUsers(data, user.token))
                .catch((error) => {
                    setAllUsers([]);
                    console.log(error);
                });
        }
    }, [user.token]);

    const refreshUsers = () => {
        if(user.token) {
            getAllEntities(path, pageNumber, pageSize, user.token)
                .then((data) => setAllUsers(data, user.token))
                .catch((error) => console.log(error));
        }
    };

    return {allUsers, refreshUsers};
};

export default useUser;