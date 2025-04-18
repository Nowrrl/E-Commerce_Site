import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetch",
    async (userId) => {
        const { data } = await axios.get(
            `http://localhost:8085/wishlist/user/${userId}`
        );
        return data;                           // array of wishlist_model from backend
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/add",
    async ({ userId, productId }, { dispatch }) => {
        await axios.post(
            `http://localhost:8085/wishlist/add`,
            null,
            { params: { userId, productId } }
        );
        return dispatch(fetchWishlist(userId)).unwrap();
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/remove",
    async ({ userId, productId }, { dispatch }) => {
        await axios.delete(
            `http://localhost:8085/wishlist/remove`,
            { params: { userId, productId } }
        );
        return dispatch(fetchWishlist(userId)).unwrap();
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: { items: [], status: "idle", error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (s) => { s.status = "loading"; })
            .addCase(fetchWishlist.fulfilled, (s, a) => {
                s.status = "succeeded";
                s.items = a.payload;
            })
            .addCase(fetchWishlist.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.error.message;
            })
            .addCase(addToWishlist.fulfilled, (s, a) => { s.items = a.payload; })
            .addCase(removeFromWishlist.fulfilled, (s, a) => { s.items = a.payload; });
    },
});

export default wishlistSlice.reducer;
