import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import widthSlice from "./widthSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        width: widthSlice,
    },
});

export default store;
