import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    status: number;
}

const initialState: AuthState = {
    token: '',
    status: 0,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.status = 1;
        },
        removeToken: (state) => {
            state.token = "";
            state.status = 0;
        }
    }
});


export const { setToken, removeToken } = authSlice.actions;

export default authSlice.reducer;