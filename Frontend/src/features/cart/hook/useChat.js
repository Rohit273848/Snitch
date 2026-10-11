import { addItem, setLoading, setItem } from "../state/cart.slice";
import { addItemToCart, getCart } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const cartLoading = useSelector((state) => state.cart.loading);

    async function handleGetCart() {
        dispatch(setLoading(true));
        try {
            const data = await getCart();
            if (data?.cart?.items) {
                dispatch(setItem(data.cart.items));
            }
            return data?.cart;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleAddToItem({ productId, variantId, variatyId, quantity = 1 }) {
        dispatch(setLoading(true));
        try {
            const effectiveVariantId = variantId || variatyId;
            const data = await addItemToCart({ productId, variantId: effectiveVariantId, quantity });
            if (data?.cart?.items) {
                dispatch(setItem(data.cart.items));
            }
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleAddToItem, handleGetCart, cartItems, cartLoading };
};

export const useCart = useChat;