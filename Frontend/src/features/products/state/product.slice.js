import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProduct: [],
        allProducts: [],
        loading: false,
    },
    reducers: {
        setSellerProduct: (state, action) => {
            state.sellerProduct = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        }
    }
})

export const { setLoading, setSellerProduct, setAllProducts } = productSlice.actions;
export default productSlice.reducer;