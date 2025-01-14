// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import adminSlice from "./adminSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer, // Attach the cart reducer
    admin: adminSlice, // Attach the cart reducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
