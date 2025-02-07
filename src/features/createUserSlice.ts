import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface createUserPayload {
  name: string;
  email: string;
  role: string;
  password: string;
}

export const createUser = createAsyncThunk("user/create", async (userInfo: createUserPayload, { rejectWithValue }) => {
  try {
    const response = await API.post("/users", userInfo);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

  const createUserSlice = createSlice({
    name: "auth",
    initialState: { name: null, email: null, role: null , password: null, status: "idle", error: null },
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(createUser.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(createUser.fulfilled, (state, action) => {
          state.status = "succeeded";
        //   state.token = action.payload.token;
        //   state.user = action.payload.user;
        })
        .addCase(createUser.rejected, (state, action) => {
          state.status = "failed";
        //   state.error = action.payload;
        })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
  });


export default createUserSlice.reducer;
