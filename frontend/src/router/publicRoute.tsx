import React, { useEffect } from "react";
import { getAuthToken } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
interface ElementProp {
    Element: React.ComponentType;
    title: string;
}

const PublicRoute: React.FC<ElementProp> = ({ Element, title }) => {

    const token = getAuthToken();

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return <Element />;
}

export default PublicRoute;