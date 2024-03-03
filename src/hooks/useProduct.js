import { useContext, useEffect, useState } from "react";
import { getAllEntities } from "../services/api";

const path = "Product";

const useProduct = () => {
    const [allProducts, setAllProducts] = useState([]);
    const {user} = useContext();

    // Get once
    useEffect(() => {
        if(user.token) {
            getAllEntities(path, user.token)
             .then((data) => setAllProducts(data, user.token))
             .catch((error) => console.log(error));
        }
    }, [user.token]);
    
    const refreshProducts = () => {
        if(user.token) {
            getAllEntities(path, user.token)
             .then((data) => setAllProducts(data, user.token))
             .catch((error) => console.error(error));
        }
    }

    return {allProducts, refreshProducts};
}

export default useProduct;