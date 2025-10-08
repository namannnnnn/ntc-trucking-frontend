import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../axiosConfig'; 

// Thunk for deleting a trip
export const deleteTrip = createAsyncThunk(
  'trip/delete',
  async (tripId: string, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/trips/${tripId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete trip');
    }
  }
);

// Initial state
const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null as string | null,
};

// Slice
const deleteTripSlice = createSlice({
  name: 'deleteTrip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteTrip.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default deleteTripSlice.reducer;
