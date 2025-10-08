import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";

// -------------- DRIVER THUNK --------------
interface AdditionalCost {
    category: string;
    amount: number;
  }
  
interface DriverTripUpdatePayload {
    tripId: string;
    fuelCost: number;
    startTime: boolean;   // true = update, false = don't update
    endTime: boolean;
    additionalCosts: AdditionalCost[];
  }

export const editTripAsDriver = createAsyncThunk(
  "trip/editAsDriver",
  async (tripInfo: DriverTripUpdatePayload, { rejectWithValue }) => {
    try {
      const { tripId, ...data } = tripInfo;
      const response = await API.put(`/trips/${tripId}/update`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------- ADMIN THUNK --------------
interface AdminTripUpdatePayload {
  tripId: string;
  payPerMile: number;
  mileage: number;
  grossIncome: number;
  additionalIncome: number;
  otherPay: number;
}

export const editTripFinancialsAsAdmin = createAsyncThunk(
  "trip/editAsAdmin",
  async (tripInfo: AdminTripUpdatePayload, { rejectWithValue }) => {
    try {
      const { tripId, ...data } = tripInfo;
      const response = await API.put(`/trips/${tripId}/financials`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------- SLICE --------------
const editTripSlice = createSlice({
  name: "tripEdit",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null as string | null,
    updatedTrip: null as any,
  },
  reducers: {
    resetEditStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.updatedTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Driver Update
      .addCase(editTripAsDriver.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editTripAsDriver.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.updatedTrip = action.payload;
      })
      .addCase(editTripAsDriver.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Admin Financial Update
      .addCase(editTripFinancialsAsAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editTripFinancialsAsAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.updatedTrip = action.payload;
      })
      .addCase(editTripFinancialsAsAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetEditStatus } = editTripSlice.actions;

export default editTripSlice.reducer;
