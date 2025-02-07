import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";

interface getUserPayload {
    userId: string
  }

// Fetch Users
export const getUser = createAsyncThunk("user/getUserById", async (user: getUserPayload) => {
  const response = await API.get(`/users/${user}`);
  return response.data;
});


export const getUserByIdSlice = createSlice({
    name: "getParticularUser",
    initialState: { name: null, email: null, role: null , status: "idle", error: null, users: null},
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(getUser.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(getUser.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.users = action.payload;
        })
        .addCase(getUser.rejected, (state, action) => {
          state.status = "failed";
        })
       
    },
  });

export default getUserByIdSlice.reducer;
