import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '../components/authToken/helperAuth';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  role: number;
  username: string;
}

interface EmployeeUpdate {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

interface EmployeeAdd {
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  password: string | undefined;
}

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
    registerEmployee: builder.mutation<void, {addUser: Partial<EmployeeAdd>}>({
      query: ({ addUser }) => ({
        url: '/register/employees',  
        method: 'POST',
        body: addUser,
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
    // Update Employee
    updateEmployee: builder.mutation<EmployeeUpdate, { _id: string | undefined, updates: Partial<EmployeeUpdate> }>({
      query: ({ _id, updates }) => {
          if (!_id) {
              throw new Error("User ID is required for update.");
          }
          return {
              url: `/employee/update/${_id}`,
              method: 'PUT',
              body: updates,
          };
      },
    }),

    deleteEmployee: builder.mutation<void, {_id: string | undefined}>({
      query: ({ _id }) => ({
        url: `/employee/delete/${_id}`,
        method: 'DELETE',
      })
    }),


    // Query
    employeeInfo: builder.query<{user: Employee;}, {_id: string}>({
      query: ({_id}) => ({
        url: `/employee/${_id}`,
        method: 'GET',
      })
    }),

    // Get Employee endpoint
    getEmployee: builder.query<{users: Employee[]; totalPage: number}, {page: number, search: string}>({
      query: ({ page, search }) => ({
        url: `/employees/${page}?q=${search}`,
        method: 'GET'
      })
    }),
  }),
});

// Export hooks for use in components
export const { 
  useLoginUserMutation, 
  useRegisterEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,

  useGetEmployeeQuery,
  useEmployeeInfoQuery,

} = EmployeeApi;
