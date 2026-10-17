import {
    setLoading,
    setItem,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    setShippingAddress,
    setAddresses,
    addAddressState,
    updateAddressState,
    removeAddressState,
    setCartStep,
    clearCart,
} from "../state/cart.slice";
import {
    addItemToCart,
    getCart,
    IncrementItemCartQuantity,
    DecrementItemCartQuantity,
    removeCartItem as removeCartItemApi,
    getAddresses as getAddressesApi,
    createAddress as createAddressApi,
    updateAddress as updateAddressApi,
    deleteAddress as deleteAddressApi,
    selectCartAddress as selectCartAddressApi,
    clearCartAddress as clearCartAddressApi,
    createCartOrder as createCartOrderApi,
    clearCartApi,
} from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const cartLoading = useSelector((state) => state.cart.loading);
    const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
    const cartCurrency = useSelector((state) => state.cart.currency);
    const shippingAddress = useSelector((state) => state.cart.shippingAddress);
    const addresses = useSelector((state) => state.cart.addresses);
    const currentStep = useSelector((state) => state.cart.currentStep || 1);

    async function handleGetCart() {
        dispatch(setLoading(true));
        try {
            const data = await getCart();
            if (data?.cart) {
                dispatch(setItem(data.cart));
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
            if (data?.cart) {
                dispatch(setItem(data.cart));
            }
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleIncreamentQuantity({ productId, variantId }) {
        const data = await IncrementItemCartQuantity({ productId, variantId });
        if (data?.cart) {
            dispatch(setItem(data.cart));
        } else {
            dispatch(incrementCartItem({ productId, variantId }));
        }
        return data;
    }

    async function handleDecrementQuantity({ productId, variantId }) {
        const data = await DecrementItemCartQuantity({ productId, variantId });
        if (data?.cart) {
            dispatch(setItem(data.cart));
        } else {
            dispatch(decrementCartItem({ productId, variantId }));
        }
        return data;
    }

    async function handleDeleteCartItem({ productId, variantId, itemId, itemIndex }) {
        const data = await removeCartItemApi({ productId, variantId, itemId });
        if (data?.cart) {
            dispatch(setItem(data.cart));
        } else {
            dispatch(removeCartItem({ productId, variantId, itemId }));
        }
        return data;
    }

    // ─── Address Handlers ────────────────────────────────────────────────────────
    async function handleGetAddresses() {
        try {
            const data = await getAddressesApi();
            if (data?.addresses) {
                dispatch(setAddresses(data.addresses));
            }
            if (data?.selectedAddress) {
                dispatch(setShippingAddress(data.selectedAddress));
            }
            return data;
        } catch (error) {
            console.error("handleGetAddresses error:", error);
            throw error;
        }
    }

    async function handleCreateAddress(addressData) {
        dispatch(setLoading(true));
        try {
            const data = await createAddressApi(addressData);
            if (data?.address) {
                dispatch(addAddressState(data.address));
                if (data.selectedAddressId === data.address._id) {
                    dispatch(setShippingAddress(data.address));
                }
            }
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateAddress(addressId, addressData) {
        dispatch(setLoading(true));
        try {
            const data = await updateAddressApi(addressId, addressData);
            if (data?.address) {
                dispatch(updateAddressState(data.address));
            }
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteAddress(addressId) {
        dispatch(setLoading(true));
        try {
            const data = await deleteAddressApi(addressId);
            dispatch(removeAddressState(addressId));
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleSelectAddress(addressId) {
        dispatch(setLoading(true));
        try {
            const data = await selectCartAddressApi(addressId);
            if (data?.shippingAddress) {
                dispatch(setShippingAddress(data.shippingAddress));
            }
            return data;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleCreateCartOrder(orderData) {
        const data = await createCartOrderApi(orderData);
        if (!data?.order) return null;
        return {
            ...data.order,
            key: data.key,
        };
    }

    function setStep(step) {
        dispatch(setCartStep(step));
    }

    async function handleClearCart() {
        dispatch(clearCart());
        try {
            await clearCartApi();
        } catch (err) {
            console.warn("Backend clear cart error:", err);
        }
    }

    return {
        handleAddToItem,
        handleGetCart,
        handleIncreamentQuantity,
        handleIncrementQuantity: handleIncreamentQuantity,
        handleDecrementQuantity,
        handleDecreamentQuantity: handleDecrementQuantity,
        handleDeleteCartItem,
        handleRemoveCartItem: handleDeleteCartItem,
        handleRemoveItem: handleDeleteCartItem,
        handleClearCart,
        handleGetAddresses,
        handleCreateAddress,
        handleUpdateAddress,
        handleDeleteAddress,
        handleSelectAddress,
        handleCreateCartOrder,
        setStep,
        cartItems,
        cartLoading,
        cartTotalPrice,
        cartCurrency,
        shippingAddress,
        addresses,
        currentStep,
    };
};

export const useCart = useChat;