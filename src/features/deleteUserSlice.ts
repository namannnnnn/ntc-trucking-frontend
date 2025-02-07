import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface deleteUserPayload {
    userId: string;
}

export const deleteUser = createAsyncThunk("user/delete", async (userInfo: deleteUserPayload, { rejectWithValue }) => {
    try {
        const response = await API.delete(`/users/${userInfo.userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const deleteUserSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                //   state.token = action.payload.token;
                //   state.user = action.payload.user;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = "failed";
                //   state.error = action.payload;
            })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
});


export default deleteUserSlice.reducer;
