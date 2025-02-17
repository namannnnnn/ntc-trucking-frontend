import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface createDriverPayload {
  name: string;
  email: string;
  contactNumber: string;
  truckNumberPlate: string;
}

export const createDriver = createAsyncThunk("driver/create", async (driverInfo: createDriverPayload, { rejectWithValue }) => {
  try {
    const response = await API.post("/drivers", driverInfo);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

  const createDriverSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, contactNumber: null , truckNumberPlate: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(createDriver.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(createDriver.fulfilled, (state, action) => {
          state.status = "succeeded";
        //   state.token = action.payload.token;
        //   state.user = action.payload.user;
        })
        .addCase(createDriver.rejected, (state, action) => {
          state.status = "failed";
        //   state.error = action.payload;
        })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
  });


export default createDriverSlice.reducer;
