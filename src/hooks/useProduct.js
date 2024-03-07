import { useContext, useEffect, useState } from "react";
import { getAllEntities } from "../services/api";
import { Context } from "../Context";

const path = "Product";

const useProduct = (pageNumber, pageSize) => {
    const [allProducts, setAllProducts] = useState([]);
    const {user} = useContext(Context);

    // Get once
    useEffect(() => {
        if(user.token) {
            getAllEntities(path, pageNumber, pageSize, user.token)
             .then((data) => setAllProducts(data, user.token))
             .catch((error) => console.log(error));
        }
    }, [user.token]);
    
    const refreshProducts = () => {
        if(user.token) {
            getAllEntities(path, pageNumber, pageSize, user.token)
             .then((data) => setAllProducts(data, user.token))
             .catch((error) => console.error(error));
        }
    }

    return {allProducts, refreshProducts};
}

export default useProduct;