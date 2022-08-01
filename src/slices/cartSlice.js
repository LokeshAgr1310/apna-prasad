import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items = [...state.items, action.payload]
            localStorage.setItem("cart", JSON.stringify(state.items))
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((obj) => obj.id !== action.payload)
            localStorage.setItem("cart", JSON.stringify(state.items))

        },
        setCart: (state, action) => {
            state.items = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
        },
        incrementQty: (state, action) => {
            const index = state.items.findIndex((obj) => obj.id === action.payload)
            state.items[index].qty++;
            localStorage.setItem("cart", JSON.stringify(state.items))

        },
        decrementQty: (state, action) => {
            const index = state.items.findIndex((obj) => obj.id === action.payload)
            state.items[index].qty--;
            localStorage.setItem("cart", JSON.stringify(state.items))
        },
        deleteCart: (state, action) => {
            state.items = []
            localStorage.removeItem("cart")
        }

    },

});

export const { addToCart, removeFromCart, setCart, incrementQty, decrementQty, deleteCart } = cartSlice.actions;

export const selectItems = (state) => state.cart.items;

export default cartSlice.reducer;
