import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface editDriverPayload {
    name: string;
    email: string;
    contactNumber: string;
    truckNumberPlate: string;
    driverId: string;
}

export const editDriver = createAsyncThunk("driver/edit", async (driverInfo: editDriverPayload, { rejectWithValue }) => {
    try {
        let requestBody = {
            name: driverInfo.name,
            email: driverInfo.email,
            contactNumber: driverInfo.contactNumber,
            truckNumberPlate: driverInfo.truckNumberPlate
        }
        const response = await API.put(`/drivers/${driverInfo.driverId}`, requestBody);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const editDriverSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, contactNumber: null, truckNumberPlate: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(editDriver.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(editDriver.fulfilled, (state, action) => {
                state.status = "succeeded";
                //   state.token = action.payload.token;
                //   state.user = action.payload.user;
            })
            .addCase(editDriver.rejected, (state, action) => {
                state.status = "failed";
                //   state.error = action.payload;
            })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
});


export default editDriverSlice.reducer;
