import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slice/authSlice";
import { UserApi } from "../api/UserApi";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { EmployeeApi } from "../api/EmployeeApi";
import { AiApi } from "../api/AiApi";
import { MessageApi } from "../api/MessageApi";
const reducer = combineReducers({
    user: AuthReducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [EmployeeApi.reducerPath]: EmployeeApi.reducer,
    [AiApi.reducerPath]: AiApi.reducer,
    [MessageApi.reducerPath]: MessageApi.reducer,
})

const persisConfig = {
    key: "root",
    storage,
    blacklist: [
        UserApi.reducerPath, // Don't persist the UserApi cache
        EmployeeApi.reducerPath, // Don't persist the EmployeeApi cache
        AiApi.reducerPath,
        MessageApi.reducerPath,
    ],
}

const persistedReducer = persistReducer(persisConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false,})
            .concat(UserApi.middleware)
            .concat(EmployeeApi.middleware)
            .concat(AiApi.middleware)
            .concat(MessageApi.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export {store, persistor}