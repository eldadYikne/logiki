import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../types/table";

// Define the initial state of the admin
interface AdminState {
  admin: Admin | undefined;
}

const initialState: AdminState = {
  admin: undefined,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Action to add an item to the admin
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload; // Add item to the admin array
    },
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
