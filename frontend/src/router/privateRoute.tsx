import React, { useEffect } from "react";
import { getAuthToken, isTokenExpired } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Socket } from "socket.io-client";
import { jwtDecode } from 'jwt-decode';

interface ElementProp {
  Element: React.ComponentType<{ socket: Socket }>;
  title: string;
  socket: Socket;
}

interface UserProps {
    username: string;
    firstName: string;
    lastName: string;
    auth: boolean;
    exp: number; // Expiration time as a Unix timestamp (seconds)
}

const PrivateRoute: React.FC<ElementProp> = ({ Element, title, socket }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decoded: UserProps = jwtDecode(token); // Decode token to get user info
      document.title = title;

      socket.emit('reconnected', { username: decoded.username });
      
    } else {
      Cookies.remove('authToken');
    }

    return () => {
      socket.off('reconnected'); // Cleanup on unmount
    };
  }, [title, token, socket]);


  if (!token || isTokenExpired(token)) {
    Cookies.remove('authToken');
    return <Navigate to="/" />; // Redirect to login if token is missing or expired
  }

  return <Element socket={socket} />; // Pass socket to the Element component
};

export default PrivateRoute;
