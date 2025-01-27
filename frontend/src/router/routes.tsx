import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layout/Layout";
import PublicRoute from "./publicRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <PublicRoute Element={Login} />
            },
            {
                path: "/register",
                element: <PublicRoute Element={Register} />
            }
        ]
    }
]);