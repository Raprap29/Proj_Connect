import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth';

export const AiApi = createApi({
  reducerPath: 'AiApi',
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
    MessageAi: builder.mutation<{message: string}, {message: string}>({
        query: ({message}) => ({
            url: '/ai/message',
            method: "POST",
            body: {
                message: message,
            },
        })
    })
  }),
});

// Export hooks for use in components
export const { 
    useMessageAiMutation

} = AiApi;
