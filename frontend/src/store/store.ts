import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slice/authSlice";
import { UserApi } from "../api/UserApi";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { EmployeeApi } from "../api/EmployeeApi";
const reducer = combineReducers({
    user: AuthReducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [EmployeeApi.reducerPath]: EmployeeApi.reducer,
})

const persisConfig = {
    key: "root",
    storage,
    blacklist: [UserApi.reducerPath]
}

const persistedReducer = persistReducer(persisConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false,})
            .concat(UserApi.middleware)
            .concat(EmployeeApi.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export {store, persistor}