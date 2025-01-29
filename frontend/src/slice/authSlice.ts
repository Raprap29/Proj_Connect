import { createSlice } from "@reduxjs/toolkit";
import { UserApi } from "../api/UserApi";
import Cookies from 'js-cookie';
import { EmployeeApi } from "../api/EmployeeApi";
interface AuthState {
    token: string | null;
    status: number;
}

const initialState: AuthState = {
    token: Cookies.get('authToken') || null,
    status: 0,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = "";
            Cookies.remove("authToken");
            state.status = 0;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(UserApi.endpoints.loginUser.matchFulfilled, (state, action) => {
            if (action.payload?.token) {
                state.token = action.payload.token;
                Cookies.set('authToken', action.payload.token, { 
                    expires: 7,
                    secure: true, 
                    sameSite: 'Strict',
                });
                state.status = 1;
            } else {
                // Handle the case where the token is invalid or missing
                state.status = 0;
            }
        });
        builder.addMatcher(EmployeeApi.endpoints.loginUser.matchFulfilled, (state, action) => {
            if (action.payload?.token) {
                state.token = action.payload.token;
                Cookies.set('authToken', action.payload.token, { 
                    expires: 7,
                    secure: true, 
                    sameSite: 'Strict',
                });
                state.status = 1;
            } else {
                // Handle the case where the token is invalid or missing
                state.status = 0;
            }
        });
    }
});


export const { logout } = authSlice.actions;

export default authSlice.reducer;