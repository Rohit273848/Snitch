import {createSlice} from "@reduxjs/toolkit";

export const DEFAULT_ENSEMBLE_ITEMS = [
    {
        _id: "cart-item-overshirt",
        productId: "snitch-overshirt",
        product: {
            _id: "snitch-overshirt",
            title: "The Field Overshirt",
            category: "Outerwear",
            price: { amount: 240, currency: "USD" },
            images: [{ url: "/editorial/overshirt_olive_piece.jpg", isCover: true }],
        },
        title: "The Field Overshirt",
        color: "Muted Olive",
        size: "M",
        fabric: "100% Textured Cotton • Portuguese Mill",
        unitPrice: 240,
        price: { amount: 240, currency: "USD" },
        quantity: 1,
        itemTotal: 240,
        inStock: true,
        image: "/editorial/overshirt_olive_piece.jpg",
    },
    {
        _id: "cart-item-supima-tee",
        productId: "snitch-supima-tee",
        product: {
            _id: "snitch-supima-tee",
            title: "Heavyweight Supima Tee",
            category: "Knitwear",
            price: { amount: 90, currency: "USD" },
            images: [{ url: "/editorial/supima_tee_piece.jpg", isCover: true }],
        },
        title: "Heavyweight Supima Tee",
        color: "Chalk White",
        size: "M",
        fabric: "280 GSM Supima Jersey • Organic",
        unitPrice: 90,
        price: { amount: 90, currency: "USD" },
        quantity: 1,
        itemTotal: 90,
        inStock: true,
        image: "/editorial/supima_tee_piece.jpg",
    },
    {
        _id: "cart-item-pleated-trouser",
        productId: "snitch-pleated-trouser",
        product: {
            _id: "snitch-pleated-trouser",
            title: "Relaxed Pleated Trouser",
            category: "Trousers",
            price: { amount: 210, currency: "USD" },
            images: [{ url: "/editorial/pleated_trouser_piece.jpg", isCover: true }],
        },
        title: "Relaxed Pleated Trouser",
        color: "Deep Charcoal",
        size: "32",
        fabric: "Italian Super 120s Wool • Tailored Cuff",
        unitPrice: 210,
        price: { amount: 210, currency: "USD" },
        quantity: 1,
        itemTotal: 210,
        inStock: true,
        image: "/editorial/pleated_trouser_piece.jpg",
    },
];

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items: DEFAULT_ENSEMBLE_ITEMS,
        totalPrice: 540,
        currency: "USD",
        shippingAddress: null,
        addresses: [],
        currentStep: 1, // 1: Bag, 2: Address, 3: Payment
        loading:false,
    },
    reducers:{
        setItem:(state,action)=>{
            const payload = action.payload;
            const filterValidItems = (arr) => {
                if (!Array.isArray(arr)) return [];
                return arr.filter((item) => {
                    if (!item) return false;
                    const hasProduct = Boolean(
                        item.product?._id ||
                        (typeof item.product === "string" && item.product.trim().length > 0) ||
                        item.productId
                    );
                    const hasId = Boolean(item._id || item.productId || item.product?._id);
                    return hasProduct && hasId;
                });
            };

            if (Array.isArray(payload)) {
                state.items = filterValidItems(payload);
            } else if (payload && Array.isArray(payload.items)) {
                state.items = filterValidItems(payload.items);
                state.totalPrice = state.items.length === 0 ? 0 : Number(payload.totalPrice || 0);
                state.currency = payload.currency || "USD";
                if (payload.shippingAddress !== undefined) {
                    state.shippingAddress = payload.shippingAddress;
                }
            } else {
                state.items = [];
                state.totalPrice = 0;
            }
        },
        addItem:(state,action)=>{
            state.items.push(action.payload);
            state.totalPrice = state.items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.unitPrice || 0) * (Number(item.quantity) || 1))), 0);
        },
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId, itemId } = action.payload || {};
            const targetItemId = itemId ? String(itemId) : null;
            const targetPId = productId ? String(productId) : null;
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items.map((item) => {
                const itemDbId = item._id ? String(item._id) : null;
                const itemPId = String(item.product?._id || item.product || item.productId || "");
                const itemVId = item.variant?._id
                    ? String(item.variant._id)
                    : item.variant
                    ? String(item.variant)
                    : item.variantId
                    ? String(item.variantId)
                    : null;

                const isItemMatch = targetItemId && itemDbId === targetItemId;
                const isProductMatch = targetPId && itemPId === targetPId;
                const isVariantMatch = targetVId ? itemVId === targetVId : true;

                if (isItemMatch || (isProductMatch && isVariantMatch)) {
                    const newQty = (Number(item.quantity) || 1) + 1;
                    const unitPrice = Number(item.unitPrice ?? item.price?.amount ?? 0);
                    return {
                        ...item,
                        quantity: newQty,
                        itemTotal: unitPrice > 0 ? unitPrice * newQty : item.itemTotal,
                    };
                }
                return item;
            });
            state.totalPrice = state.items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.unitPrice || 0) * (Number(item.quantity) || 1))), 0);
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId, itemId } = action.payload || {};
            const targetItemId = itemId ? String(itemId) : null;
            const targetPId = productId ? String(productId) : null;
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items
                .map((item) => {
                    const itemDbId = item._id ? String(item._id) : null;
                    const itemPId = String(item.product?._id || item.product || item.productId || "");
                    const itemVId = item.variant?._id
                        ? String(item.variant._id)
                        : item.variant
                        ? String(item.variant)
                        : item.variantId
                        ? String(item.variantId)
                        : null;

                    const isItemMatch = targetItemId && itemDbId === targetItemId;
                    const isProductMatch = targetPId && itemPId === targetPId;
                    const isVariantMatch = targetVId ? itemVId === targetVId : true;

                    if (isItemMatch || (isProductMatch && isVariantMatch)) {
                        const newQty = (Number(item.quantity) || 1) - 1;
                        const unitPrice = Number(item.unitPrice ?? item.price?.amount ?? 0);
                        return {
                            ...item,
                            quantity: newQty,
                            itemTotal: unitPrice > 0 ? unitPrice * newQty : item.itemTotal,
                        };
                    }
                    return item;
                })
                .filter((item) => Number(item.quantity) > 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.unitPrice || 0) * (Number(item.quantity) || 1))), 0);
        },
        removeCartItem: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "number") {
                state.items = state.items.filter((_, idx) => idx !== payload);
                state.totalPrice = state.items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.unitPrice || 0) * (Number(item.quantity) || 1))), 0);
                return;
            }

            const { productId, variantId, itemId } = payload || {};
            const targetItemId = itemId ? String(itemId) : null;
            const targetPId = productId ? String(productId) : null;
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items.filter((item) => {
                const itemDbId = item._id ? String(item._id) : null;
                if (targetItemId && itemDbId === targetItemId) {
                    return false;
                }

                const itemPId = String(item.product?._id || item.product || item.productId || "");
                const itemVId = item.variant?._id
                    ? String(item.variant._id)
                    : item.variant
                    ? String(item.variant)
                    : item.variantId
                    ? String(item.variantId)
                    : null;

                if (targetPId && itemPId === targetPId) {
                    if (targetVId) {
                        return itemVId !== targetVId;
                    }
                    return false;
                }

                return true;
            });
            state.totalPrice = state.items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.unitPrice || 0) * (Number(item.quantity) || 1))), 0);
        },
        resetToDefaultEnsemble: (state) => {
            state.items = DEFAULT_ENSEMBLE_ITEMS;
            state.totalPrice = 540;
            state.currentStep = 1;
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        setAddresses: (state, action) => {
            state.addresses = action.payload || [];
        },
        addAddressState: (state, action) => {
            const newAddr = action.payload;
            if (newAddr) {
                // If the new address is marked default, unmark others
                if (newAddr.isDefault) {
                    state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
                }
                state.addresses = [newAddr, ...state.addresses];
            }
        },
        updateAddressState: (state, action) => {
            const updated = action.payload;
            if (updated) {
                state.addresses = state.addresses.map((addr) =>
                    addr._id === updated._id ? updated : updated.isDefault ? { ...addr, isDefault: false } : addr
                );
                if (state.shippingAddress && state.shippingAddress._id === updated._id) {
                    state.shippingAddress = updated;
                }
            }
        },
        removeAddressState: (state, action) => {
            const addressId = action.payload;
            state.addresses = state.addresses.filter((addr) => addr._id !== addressId);
            if (state.shippingAddress && state.shippingAddress._id === addressId) {
                state.shippingAddress = null;
            }
        },
        setCartStep: (state, action) => {
            state.currentStep = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.currentStep = 1;
        },
    }
})

export const {
    setItem,
    addItem,
    setLoading,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    resetToDefaultEnsemble,
    setShippingAddress,
    setAddresses,
    addAddressState,
    updateAddressState,
    removeAddressState,
    setCartStep,
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;