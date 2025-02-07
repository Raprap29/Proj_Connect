import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth'; 

interface UserMessages {
    userId: string;
    status: number;
    message: string;
}

export const MessageApi = createApi({
    reducerPath: 'MessageApi',
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
        getMessages: builder.query<{data: UserMessages[]}, {userId: string}>({
            query: ({ userId }) => ({
              url: `/getmessage/${userId}`,  
              method: 'GET',
            }),
        }),
    })
})

export const { 
    useGetMessagesQuery
} = MessageApi;
