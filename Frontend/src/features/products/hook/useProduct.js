import { setAllProducts, setLoading, setSellerProduct } from "../state/product.slice";
import { createProduct, getAllProducts, getProductById, getSellerProduct } from "../services/product.api";
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
    async function handleGetProductById(id) {
        dispatch(setLoading(true));
        const data = await getProductById(id);
        dispatch(setLoading(false));
        return data.product;
    }
    return { handleGetSellerProduct, handleProductCreation, handleGetAllProducts, handleGetProductById }
}

