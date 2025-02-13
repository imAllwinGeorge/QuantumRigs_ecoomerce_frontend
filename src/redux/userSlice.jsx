import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"users",
    initialState:{
        users:JSON.parse(localStorage.getItem('key')) || null,
        cart: JSON.parse(localStorage.getItem('cart')) || null

    },
    reducers:{
        addUser:(state,action)=>{
            state.users = action.payload
            localStorage.setItem('key',JSON.stringify(action.payload))
        },
        cartDetails:(state,action)=>{
            state.cart = action.payload
            localStorage.setItem('cart',JSON.stringify(action.payload))
        },
        productOrdered:(state,action)=>{
            state.cart = null
            localStorage.removeItem('cart')
        },
        logoutUser:(state,action)=>{
            state.users = null;
            state.cart = null;
            localStorage.removeItem('key');
            localStorage.removeItem('cart')
        }
    }
})

export const {addUser,cartDetails,logout,productOrdered,logoutUser} = userSlice.actions;
export default userSlice.reducer;