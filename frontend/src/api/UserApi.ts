import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth'; 

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',  // Your base URL for the API
    prepareHeaders: (headers, { endpoint }) => {
      const token = getAuthToken();

      if (token && endpoint !== '/login' && endpoint !== '/register') {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: '/register',  
        method: 'POST',
        body: credentials,
      }),
    }),

    // Login user endpoint
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login',  
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useRegisterUserMutation, useLoginUserMutation } = UserApi;
