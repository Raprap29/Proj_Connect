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
    
  }),
});

// Export hooks for use in components
export const { } = EmployeeApi;
