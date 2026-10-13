import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[],
        loading:false,
    },
    reducers:{
        setItem:(state,action)=>{
            state.items = action.payload;
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
                    return { ...item, quantity: (Number(item.quantity) || 1) + 1 };
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
                        return { ...item, quantity: (Number(item.quantity) || 1) - 1 };
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
        }
    }
})

export const { setItem, addItem, setLoading, incrementCartItem, decrementCartItem, removeCartItem } = cartSlice.actions;
export default cartSlice.reducer;