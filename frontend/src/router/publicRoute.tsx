import React from "react";
import { getAuthToken } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
interface ElementProp {
    Element: React.ComponentType;
}

const PublicRoute: React.FC<ElementProp> = ({ Element }) => {

    const token = getAuthToken();

    if(token){
        return <Navigate to="/" />
    }

    return <Element />
}

export default PublicRoute;