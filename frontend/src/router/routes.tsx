import { createBrowserRouter } from "react-router-dom";
import { Layout, LayoutCustomer, LayoutPrivate } from "../layout/Layout";
import PublicRoute from "./publicRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./privateRoute";
import Message from "../pages/Main/Chat";
import {io} from "socket.io-client";
import CustomerChat from "../pages/Main/ChatCustomer";
import CustomerRoute from "./customerRoute";
import UserMaintenance from "../pages/Main/Maintenance/User";
import EmployeeMaintenance from "../pages/Main/Maintenance/Employee";

const URL = 'ws://localhost:5000';

const socket = io(URL, {
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
                element: <PublicRoute Element={Login} title="Login | System" socket={socket}/>
            },
            {
                path: "/register",
                element: <PublicRoute Element={Register} title="Register | System" socket={socket}/>
            }
        ]
    }, 
    {
        element: <LayoutPrivate />,
        children: [
            {
                path: '/message',
                element: <PrivateRoute Element={Message} title="Message | System" socket={socket} />
            },
            {
                path: '/maintenance/users',
                element: <PrivateRoute Element={UserMaintenance} title="Maintenance Users | System" socket={socket} />
            },
            {
                path: '/maintenance/employees',
                element: <PrivateRoute Element={EmployeeMaintenance} title="Maintenance Users | System" socket={socket} />
            }
        ]
    }, 
    {
        element: <LayoutCustomer />,
        children: [
            {
                path: '/message/customer',
                element: <CustomerRoute Element={CustomerChat} title="Message System" socket={socket} />
            }
        ]
    }
]);