import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth'; 

interface UserMessages {
    userId: string;
    status: number;
    message: string;
}

// Messages and User Props
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    role: number;
    username: string;
}

interface messagesRead {
    userId: string;
    message: string;
    read: boolean;
    ticketId: string;
    status: number;
}

// Main online users
interface OnlineUsers {
   user: User;
   messages: messagesRead[];
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
        getOnlineUsers: builder.query<{users: OnlineUsers[]}, {searchQuery: string}>({
            query: ({ searchQuery }) => ({
                url: `/online/users?q=${searchQuery}`,
                method: 'GET'
            })
        }),
        updateUnread: builder.mutation<{status: boolean}, {userId: string}>({
            query: ({ userId }) => ({
                url: `/update-unread/${userId}`,
                method: "POST",
            })
        })
    })
})

export const { 

    useUpdateUnreadMutation,

    useGetMessagesQuery,
    useGetOnlineUsersQuery,
} = MessageApi;
