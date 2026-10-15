import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[],
        totalPrice: 0,
        currency: "INR",
        shippingAddress: null,
        addresses: [],
        currentStep: 1, // 1: Bag, 2: Address, 3: Payment
        loading:false,
    },
    reducers:{
        setItem:(state,action)=>{
            const payload = action.payload;
            if (Array.isArray(payload)) {
                state.items = payload;
            } else if (payload && Array.isArray(payload.items)) {
                state.items = payload.items;
                state.totalPrice = Number(payload.totalPrice || 0);
                state.currency = payload.currency || "INR";
                if (payload.shippingAddress !== undefined) {
                    state.shippingAddress = payload.shippingAddress;
                }
            } else {
                state.items = [];
            }
        },
        addItem:(state,action)=>{
            state.items.push(action.payload)
        },
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload || {};
            const targetPId = String(productId || "");
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items.map((item) => {
                const itemPId = String(item.product?._id || item.product || item.productId || "");
                const itemVId = item.variant?._id
                    ? String(item.variant._id)
                    : item.variant
                    ? String(item.variant)
                    : item.variantId
                    ? String(item.variantId)
                    : null;

                const isProductMatch = itemPId === targetPId;
                const isVariantMatch = targetVId ? itemVId === targetVId : true;

                if (isProductMatch && isVariantMatch) {
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
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload || {};
            const targetPId = String(productId || "");
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items
                .map((item) => {
                    const itemPId = String(item.product?._id || item.product || item.productId || "");
                    const itemVId = item.variant?._id
                        ? String(item.variant._id)
                        : item.variant
                        ? String(item.variant)
                        : item.variantId
                        ? String(item.variantId)
                        : null;

                    const isProductMatch = itemPId === targetPId;
                    const isVariantMatch = targetVId ? itemVId === targetVId : true;

                    if (isProductMatch && isVariantMatch) {
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
        },
        removeCartItem: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "number") {
                state.items = state.items.filter((_, idx) => idx !== payload);
                return;
            }

            const { productId, variantId, itemId } = payload || {};
            const targetItemId = itemId ? String(itemId) : null;
            const targetPId = productId ? String(productId) : null;
            const targetVId = variantId ? String(variantId) : null;

            state.items = state.items.filter((item, index) => {
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
    }
})

export const {
    setItem,
    addItem,
    setLoading,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    setShippingAddress,
    setAddresses,
    addAddressState,
    updateAddressState,
    removeAddressState,
    setCartStep,
} = cartSlice.actions;
export default cartSlice.reducer;