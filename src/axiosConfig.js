import axios from 'axios';

export const axiosAuth = axios.create({
    baseURL: 'localhost:3000',
    headers: {
      Accept: "application/json",
    },
  });

 export const API = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
  });

  // export function axiosAuthMiddleware({ dispatch, getState }) {
  //   return (next) => (action) => {
  //     axiosAuth.interceptors.request.use(
  //       (config) => {
  //         const accessToken = localStorage.getItem("accessToken");
  //         if (accessToken) {
  //           config.headers.common = { Authorization: `Bearer ${accessToken}` };
  //         }
  //         return config;
  //       },
  //       (error) => {
  //         Promise.reject(error.response || error.message);
  //       }
  //     );
  //   };
  // }