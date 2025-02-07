import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface editUserPayload {
    name: string;
    email: string;
    userId: string;
}

export const editUser = createAsyncThunk("user/edit", async (userInfo: editUserPayload, { rejectWithValue }) => {
    try {
        let requestBody = {
            name: userInfo.name,
            email: userInfo.email,
        }
        const response = await API.put(`/users/${userInfo.userId}`, requestBody);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const editUserSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(editUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                //   state.token = action.payload.token;
                //   state.user = action.payload.user;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = "failed";
                //   state.error = action.payload;
            })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
});


export default editUserSlice.reducer;
