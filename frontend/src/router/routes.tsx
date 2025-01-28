import { createBrowserRouter } from "react-router-dom";
import { Layout, LayoutPrivate } from "../layout/Layout";
import PublicRoute from "./publicRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Main/Dashboard";
import PrivateRoute from "./privateRoute";
import Message from "../pages/Main/Chat";
import {io} from "socket.io-client";

const URL = 'ws://localhost:5000';

export const socket = io(URL, {
    reconnection: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
});

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <PublicRoute Element={Login} title="Login | System" />
            },
            {
                path: "/register",
                element: <PublicRoute Element={Register} title="Register | System" />
            }
        ]
    }, 
    {
        element: <LayoutPrivate />,
        children: [
            {
                path: '/dashboard',
                element: <PrivateRoute Element={Dashboard}  title="Dashboard | System" socket={socket} />
            }, 
            {
                path: '/message',
                element: <PrivateRoute Element={Message} title="Message | System" socket={socket} />
            }
        ]
    }
]);