import React, {useEffect} from "react";
import { getAuthToken, isTokenExpired } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Socket } from "socket.io-client";
interface ElementProp {
    Element: React.ComponentType<{ socket: Socket }>;
    title: string;
    socket: Socket
}

const PrivateRoute: React.FC<ElementProp> = ({ Element, title, socket }) => {

    const token = getAuthToken();

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (!token || isTokenExpired(token)) {
        Cookies.remove('authToken');
        return <Navigate to="/" />
    }

    return <Element socket={socket} />
    
}

export default PrivateRoute;