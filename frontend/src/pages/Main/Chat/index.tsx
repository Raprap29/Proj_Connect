import React, { useEffect, useState } from 'react'
import { Socket } from "socket.io-client";
import { getAuthToken } from '../../../components/authToken/helperAuth';
import TitleNavbar from '../../../components/TItleNavbar';

interface SocketProps {
    socket: Socket;
}

interface OnlineProps {
    id: string;
    username: string;
    role: number;
}


const Message: React.FC<SocketProps> = ({socket}) => {

    const [onlineUsers, setOnlineUsers] = useState<OnlineProps[]>([{
        id: '',
        username: '',
        role: 0,
    }]);
    
    useEffect(() => {

        const token = getAuthToken();
        if (!token) return; // If no token is present, exit early
        socket.emit("getonline");

        socket.on('receiveMessage', (data) => {
            console.log(data);
        });

        socket.on('onlineUsers', (data) => {
            if (Array.isArray(data)) {
                const filterUsers = data.filter((item: OnlineProps) => item.role === 0);
                console.log(filterUsers);
                setOnlineUsers(filterUsers);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('onlineUsers');
        }
        
    }, [socket])

    return (
        <React.Fragment>
            <TitleNavbar title='Manage Message Customers' />
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