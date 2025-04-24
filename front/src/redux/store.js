// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    theme: themeReducer, // ✅ added theme reducer
  },
});
