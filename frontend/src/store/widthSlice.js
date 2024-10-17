import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    width: window.innerWidth,
    isMobile: window.innerWidth <= 768,
};

export const widthSlice = createSlice({
    name: "width",
    initialState,
    reducers: {
        setScreenWidth: (state, action) => {
            state.width = action.payload;
            state.width <= 768
                ? (state.isMobile = true)
                : (state.isMobile = false);
        },
    },
});

export const { setScreenWidth } = widthSlice.actions;
export default widthSlice.reducer;
