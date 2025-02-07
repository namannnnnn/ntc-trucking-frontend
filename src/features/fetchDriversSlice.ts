import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


// Fetch Driver
export const fetchDrivers = createAsyncThunk("driver/fetchDrivers", async () => {
  const response = await API.get("/drivers");
  return response.data;
});


export const getAllDriversSlice = createSlice({
    name: "fetchDrivers",
    initialState: { name: null, email: null, contactNumber: null , truckNumberPlate:null, status: "idle", error: null, drivers: null},
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDrivers.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchDrivers.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.drivers = action.payload;
        })
        .addCase(fetchDrivers.rejected, (state, action) => {
          state.status = "failed";
        })
       
    },
  });

export default getAllDriversSlice.reducer;
