import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface deleteDriverPayload {
    driverId: string;
}

export const deleteDriver = createAsyncThunk("driver/delete", async (driverInfo: deleteDriverPayload, { rejectWithValue }) => {
    try {
        const response = await API.delete(`/drivers/${driverInfo.driverId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const deleteDriverSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteDriver.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteDriver.fulfilled, (state, action) => {
                state.status = "succeeded";
                //   state.token = action.payload.token;
                //   state.user = action.payload.user;
            })
            .addCase(deleteDriver.rejected, (state, action) => {
                state.status = "failed";
                //   state.error = action.payload;
            })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
});


export default deleteDriverSlice.reducer;
