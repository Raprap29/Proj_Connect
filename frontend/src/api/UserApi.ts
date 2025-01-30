import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth'; 

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role: number;
  username: string;
}

interface UserUpdate {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

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

    updateUser: builder.mutation<UserUpdate, { _id: string | undefined, updates: Partial<UserUpdate> }>({
      query: ({ _id, updates }) => {
          if (!_id) {
              throw new Error("User ID is required for update.");
          }
          return {
              url: `/user/update/${_id}`,
              method: 'PUT',
              body: updates,
          };
      },
    }),

    deleteUser: builder.mutation<void, {_id: string | undefined}>({
      query: ({ _id }) => ({
        url: `/user/delete/${_id}`,
        method: 'DELETE',
      })
    }),

    getUser: builder.query<{ users: User[]; totalPage: number }, {page: number, search: string}>({
      query: ({page, search}) => ({
        url: `/users/${page}?q=${search}`, // Changed API URL format
        method: 'GET',
      }),
    }),

    userInfo: builder.query<{user: User;}, {_id: string}>({
      query: ({_id}) => ({
        url: `/user/${_id}`,
        method: 'GET',
      })
    }),
  }),
});

// Export hooks for use in components
export const { 
  useRegisterUserMutation, 
  useLoginUserMutation,

  useUpdateUserMutation,
  useDeleteUserMutation,

  useGetUserQuery,
  useUserInfoQuery
} = UserApi;
