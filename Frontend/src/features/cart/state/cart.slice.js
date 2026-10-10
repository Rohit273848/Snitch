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
        }
    }
})

export const {setItem,addItem,setLoading} = cartSlice.actions;
export default cartSlice.reducer;