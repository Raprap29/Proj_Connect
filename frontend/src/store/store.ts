import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slice/authSlice";
import { ApiSystem } from "../api/api";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
const reducer = combineReducers({
    user: AuthReducer,
    [ApiSystem.reducerPath]: ApiSystem.reducer,
})

const persisConfig = {
    key: "root",
    storage,
    blacklist: [ApiSystem.reducerPath]
}

const persistedReducer = persistReducer(persisConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(ApiSystem.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export {store, persistor}