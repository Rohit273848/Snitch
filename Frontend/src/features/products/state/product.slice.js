import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProduct: [],
        loading: false,
    },
    reducers: {
        setSellerProduct: (state, action) => {
            state.sellerProduct = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
})

export const { setLoading, setSellerProduct } = productSlice.actions;
export default productSlice.reducer;