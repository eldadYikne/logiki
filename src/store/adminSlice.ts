// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Item } from "../types/table";

// // Define the initial state of the admin
// interface AdminState {
//   items: Item[];
// }

// const initialState: AdminState = {
//   items: [],
// };

// const adminSlice = createSlice({
//   name: "admin",
//   initialState,
//   reducers: {
//     // Action to add an item to the admin
//     addItemToAdmin: (state, action: PayloadAction<Item>) => {
//       state.items.push(action.payload); // Add item to the admin array
//     },

//     // Action to remove an item from the admin
//     removeItemFromAdmin: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter((item) => item.id !== action.payload); // Filter out item by id
//     },
//     removeAllItemFromAdmin: (state) => {
//       state.items = []; // Filter out item by id
//     },

//     // Action to clear the admin
//     clearAdmin: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const {
//   addItemToAdmin,
//   removeAllItemFromAdmin,
//   removeItemFromAdmin,
//   clearAdmin,
// } = adminSlice.actions;

// export default adminSlice.reducer;
