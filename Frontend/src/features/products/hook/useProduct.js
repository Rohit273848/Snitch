import { setAllProducts, setLoading, setSellerProduct } from "../state/product.slice";
import { createProduct, getAllProducts, getSellerProduct } from "../services/product.api";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleProductCreation(formData) {
        dispatch(setLoading(true));
        const data = await createProduct(formData);
        dispatch(setLoading(false));
        return data.product;
    }

    async function handleGetSellerProduct() {
        dispatch(setLoading(true));
        const data = await getSellerProduct();
        dispatch(setSellerProduct(data.products))
        dispatch(setLoading(false));
        return data.products;
    }
    async function handleGetAllProducts() {
        dispatch(setLoading(true));
        const data = await getAllProducts();
        dispatch(setAllProducts(data.products));
        dispatch(setLoading(false));
        return data.products;
    }
    return { handleGetSellerProduct, handleProductCreation, handleGetAllProducts }
}

