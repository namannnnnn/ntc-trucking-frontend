import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../axiosConfig";


interface LoginPayload {
  email: string;
  password: string
}

// Fetch Users
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await API.get("/users");
  return response.data;
});

// export const loginUser = async (credentials) => {
//     const response = await API.post("/auth/login", credentials);
//     return response.data 
// }

// export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await loginUser(credentials);
//       localStorage.setItem("token", response.token);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   });

export const login = createAsyncThunk("user/login", async (credentials: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token); // Store token
    localStorage.setItem("name", response.data.name); // Store name
    localStorage.setItem("role", response.data.role); // Store role

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});


  const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: null, status: "idle", error: null },
    reducers: {
      logout: (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(login.rejected, (state, action) => {
          state.status = "failed";
          // state.error = action.payload;
        })
        // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        //   state.user = action.payload;
        // });
    },
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
  
  export const { logout } = authSlice.actions;

// const userSlice = createSlice({
//   name: "user",
//   initialState: { users: [], status: "idle" },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.users = action.payload;
//       });
//   },
// });


export default authSlice.reducer;
