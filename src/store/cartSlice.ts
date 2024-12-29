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
} = cartSlice.actions;

export default cartSlice.reducer;
