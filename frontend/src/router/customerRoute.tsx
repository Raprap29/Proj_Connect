import React, { useEffect } from "react";
import { getAuthToken, isTokenExpired } from "../components/authToken/helperAuth";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { Socket } from "socket.io-client";

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
  role: number;
  exp: number; // Expiration time as a Unix timestamp (seconds)
}

const CustomerRoute: React.FC<ElementProp> = ({ Element, title, socket }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decoded: UserProps = jwtDecode(token); // Decode token to get user info
      document.title = title;

      socket.emit("reconnected", { username: decoded.username });

      return () => {
        socket.off("reconnected");
      };
    } else {
      Cookies.remove("authToken");
    }
  }, [title, socket, token]);

  // Redirect if no token or token is expired
  if (!token || isTokenExpired(token)) {
    Cookies.remove("authToken");
    return <Navigate to="/" replace />; // `replace` ensures no back navigation to this route
  }

  // Decode token and check role
  const decoded: UserProps = jwtDecode(token);
  if (decoded.role !== 0) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected element
  return <Element socket={socket} />;
};

export default CustomerRoute;
