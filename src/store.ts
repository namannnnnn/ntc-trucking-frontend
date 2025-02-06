
// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/userSlice";
import getAllUsersReducer from "./features/fetchUserSlice";
import getAllDriversReducer from "./features/fetchDriversSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    getAllUser : getAllUsersReducer,
    getAllDriver: getAllDriversReducer
    // driver: driverReducer,
    // trip: tripReducer,
  },
});

export default store;


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

// import { userLoginReducer,userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers.js';


// const reducer = combineReducers({
   
//     // userRegister : userRegisterReducer,
//     // userDetails : userDetailsReducer,
//     // userUpdateProfile : userUpdateProfileReducer,
//     // userList : userListReducer,
//     // userDelete : userDeleteReducer,
//     // userUpdate : userUpdateReducer,


// })

// const userInfofromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

// const initialState = {
//     userLogin : {userInfo : userInfofromStorage}
// }

// const middleware = [thunk]

// const store = createStore(
//     reducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// )

