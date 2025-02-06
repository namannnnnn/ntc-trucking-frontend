import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


// Fetch Users
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await API.get("/users");
  return response.data;
});


export const getAllUserSlice = createSlice({
    name: "fetchUsers",
    initialState: { name: null, email: null, role: null , status: "idle", error: null, users: null},
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = "failed";
        })
       
    },
  });

export default getAllUserSlice.reducer;
