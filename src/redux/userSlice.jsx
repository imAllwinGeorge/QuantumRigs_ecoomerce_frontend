import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"users",
    initialState:{
        users:JSON.parse(localStorage.getItem('key')) || null
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
            state.users = null
            localStorage.removeItem('key')
        }
    }
})

export const {addUser,cartDetails,logout} = userSlice.actions;
export default userSlice.reducer;