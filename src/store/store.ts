// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer, // Attach the cart reducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
