import React, { useEffect } from "react";
import { getAuthToken } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
interface ElementProp {
    Element: React.ComponentType<{socket: Socket}>;
    title: string;
    socket: Socket;
}

const PublicRoute: React.FC<ElementProp> = ({ Element, title, socket }) => {

    const token = getAuthToken();

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return <Element socket={socket} />;
}

export default PublicRoute;