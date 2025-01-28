import React, { useEffect, useState } from 'react'
import { Socket } from "socket.io-client";
import { getAuthToken } from '../../../components/authToken/helperAuth';
import { jwtDecode } from 'jwt-decode';
interface SocketProps {
    socket: Socket;
}

interface OnlineProps {
    id: string;
    username: string;
}

interface UserProps {
    username: string;
    firstName: string;
    lastName: string;
    auth: boolean;
    exp: number; // Expiration time as a Unix timestamp (seconds)
}


const Message: React.FC<SocketProps> = ({socket}) => {

    const [onlineUsers, setOnlineUsers] = useState<OnlineProps[]>([{
        id: '',
        username: '',
    }]);
    
    useEffect(() => {

        const token = getAuthToken();
        if (!token) return; // If no token is present, exit early
    
        const decoded: UserProps = jwtDecode(token);

        socket.on('receiveMessage', (data) => {
            console.log(data);
        });

        socket.on('onlineUsers', (data) => {
            if (Array.isArray(data)) {
                const filterUsers = data.filter((item: OnlineProps) => item.username !== decoded.username);
                setOnlineUsers(filterUsers);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('onlineUsers');
        }
        
    }, [])

    return (
        <React.Fragment>
            <div>
                {onlineUsers && onlineUsers?.map((item, index) => (
                    <div key={index}>
                        {item.username}
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}


export default Message;