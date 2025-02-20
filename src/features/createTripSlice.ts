import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface createTripPayload {
  origin: string;
  destination: string;
}

export const createTrip = createAsyncThunk("trip/create", async (userInfo: createTripPayload, { rejectWithValue }) => {
  try {
    const response = await API.post("/trips", userInfo);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

  const createTripSlice = createSlice({
    name: "trip",
    initialState: { origin: null, destination: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(createTrip.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(createTrip.fulfilled, (state, action) => {
          state.status = "succeeded";
        //   state.token = action.payload.token;
        //   state.user = action.payload.user;
        })
        .addCase(createTrip.rejected, (state, action) => {
          state.status = "failed";
        //   state.error = action.payload;
        })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
  });


export default createTripSlice.reducer;
