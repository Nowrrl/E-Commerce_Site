// src/store/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // If user is not logged in, we'll store `null` here.
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
