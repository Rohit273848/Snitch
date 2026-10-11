import { setAllProducts, setLoading, setSellerProduct } from "../state/product.slice";
import { createProduct, getAllProducts, getProductById, getSellerProduct, updateSellerProduct, deleteSellerProduct } from "../services/product.api";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleProductCreation(formData) {
        dispatch(setLoading(true));
        try {
            const data = await createProduct(formData);
            return data.product;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetSellerProduct() {
        dispatch(setLoading(true));
        try {
            const data = await getSellerProduct();
            dispatch(setSellerProduct(data.products));
            return data.products;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAllProducts() {
        dispatch(setLoading(true));
        try {
            const data = await getAllProducts();
            dispatch(setAllProducts(data.products));
            return data.products;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetProductById(id) {
        dispatch(setLoading(true));
        try {
            const data = await getProductById(id);
            return data.product;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateSellerProduct(id, updateData) {
        dispatch(setLoading(true));
        try {
            const data = await updateSellerProduct(id, updateData);
            return data.product;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteSellerProduct(id) {
        dispatch(setLoading(true));
        try {
            const data = await deleteSellerProduct(id);
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleGetSellerProduct,
        handleProductCreation,
        handleGetAllProducts,
        handleGetProductById,
        handleUpdateSellerProduct,
        handleDeleteSellerProduct
    };
};

