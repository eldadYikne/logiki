import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../types/table";

// Define the initial state of the cart
interface CartState {
  items: Item[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action to add an item to the cart
    addItemToCart: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload); // Add item to the cart array
    },

    // Action to remove an item from the cart
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload); // Filter out item by id
    },
    removeOneItemFromCart: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1); // Remove the first matching item
      }
    },
    addOnMoreItemToCart: (state, action: PayloadAction<Item>) => {
      // const index = state.items.findIndex((item) => item.id === action.payload);
      state.items.push(action.payload);
    },

    removeAllItemFromCart: (state) => {
      state.items = []; // Filter out item by id
    },

    // Action to clear the cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToCart,
  removeAllItemFromCart,
  removeItemFromCart,
  clearCart,
  removeOneItemFromCart,
  addOnMoreItemToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
