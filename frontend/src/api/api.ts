import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ApiSystem = createApi({
    reducerPath: 'ApuSystem',
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (credentials) => ({
                url: '/register',
                method: "POST",
                body: credentials,
            })
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: "POST",
                body: credentials
            })
        })
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
} = ApiSystem;