import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


// Fetch Users
export const fetchTrips = createAsyncThunk("trip/fetchTrips", async () => {
  const response = await API.get("/trips");
  return response.data;
});


export const getAllTripsSlice = createSlice({
    name: "fetchTrips",
    initialState: { name: null, origin: null, destination: null , date:null, status: "idle", error: null, trips: null},
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTrips.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchTrips.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.trips = action.payload;
        })
        .addCase(fetchTrips.rejected, (state, action) => {
          state.status = "failed";
        })
       
    },
  });

export default getAllTripsSlice.reducer;
