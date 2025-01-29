import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth';

export const EmployeeApi = createApi({
  reducerPath: 'EmployeeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',  // Your base URL for the API
    prepareHeaders: (headers) => {
        const token = getAuthToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: '/register/employees',  
        method: 'POST',
        body: credentials,
      }),
    }),

    // Login user endpoint
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login/employees',  
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useLoginUserMutation, useRegisterUserMutation } = EmployeeApi;
