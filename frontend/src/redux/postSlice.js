import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        postData: null,
    },
    reducers: {
        setPostData: (state, action) => {
            // Ensure only serializable data is stored
            state.postData = JSON.parse(JSON.stringify(action.payload));
        },
    },
});

export const { setPostData } = postSlice.actions;
export default postSlice.reducer;