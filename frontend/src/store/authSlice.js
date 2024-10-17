import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userPrefs: null,
    status: false,
    isAdmin: false,
    role: "member",
    permissions: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.userData;
            state.status = true;
            state.role = action.payload.userData.role;
            state.isAdmin = action.payload.userData.isAdmin;
            state.permissions = action.payload.userData.permissions || [];
            state.userPrefs = action.payload.userData.userPrefs;
        },
        logout: (state) => {
            state.user = null;
            state.status = false;
            state.isAdmin = false;
            state.permissions = [];
            state.userPrefs = null;
            state.role = "member";
        },
        updateStoreUserPrefs: (state, action) => {
            state.userPrefs = action.payload;
        },
    },
});

export const { login, logout, updateStoreUserPrefs } = authSlice.actions;

export default authSlice.reducer;
