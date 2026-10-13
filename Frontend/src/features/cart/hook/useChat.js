import { setLoading, setItem, incrementCartItem, decrementCartItem } from "../state/cart.slice";
import { addItemToCart, getCart, IncrementItemCartQuantity, DecrementItemCartQuantity } from "../service/cart.api";
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

    async function handleIncreamentQuantity({ productId, variantId }) {
        const data = await IncrementItemCartQuantity({ productId, variantId });
        dispatch(incrementCartItem({ productId, variantId }));
        return data;
    }

    async function handleDecrementQuantity({ productId, variantId }) {
        const data = await DecrementItemCartQuantity({ productId, variantId });
        dispatch(decrementCartItem({ productId, variantId }));
        return data;
    }

    return {
        handleAddToItem,
        handleGetCart,
        handleIncreamentQuantity,
        handleIncrementQuantity: handleIncreamentQuantity,
        handleDecrementQuantity,
        handleDecreamentQuantity: handleDecrementQuantity,
        cartItems,
        cartLoading,
    };
};

export const useCart = useChat;