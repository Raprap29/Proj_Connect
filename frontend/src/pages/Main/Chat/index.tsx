import React, { useContext, useEffect, useState } from 'react'
import { Socket } from "socket.io-client";
import { getAuthToken } from '../../../components/authToken/helperAuth';
import TitleNavbar from '../../../components/TItleNavbar';
import { useGetUserQuery } from '../../../api/UserApi';
import { ContextData } from '../../../context/AppContext';
import MessageModal from '../../../components/modal/messageModal';

interface SocketProps {
    socket: Socket;
}

interface StatusOnline {
    status?: boolean;
}

interface OnlineProps {
    id: string;
    username: string;
    role: number;
    _id: string;
}

interface Users extends StatusOnline {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
}

const Message: React.FC<SocketProps> = ({socket}) => {

    const [onlineUsers, setOnlineUsers] = useState<OnlineProps[]>([{
        id: '',
        username: '',
        role: 0,
        _id: '',
    }]);



    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }

    const {setPages, page, setToggleForm} = context;
    const [search, setSearch] = useState("");
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [usersOn, setUsersOn] = useState<Users[]>([{
        _id: '',
        firstName: '',
        lastName: '',
        username: '',
        status: false,
    }]);
    
    const {data: users} = useGetUserQuery({page, search});
    
    const handleToggleMessagae = (username: string, id: string) => {
        setUsername(username);
        setUserId(id);
        setToggleForm(true);
    }

    useEffect(() => {

        const token = getAuthToken();
        if (!token) return; // If no token is present, exit early
        socket.emit("getonline");

        socket.on('onlineUsers', (data) => {
            if (Array.isArray(data)) {
                const filterUsers = data.filter((item: OnlineProps) => item.role === 0);
                setOnlineUsers(filterUsers);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('onlineUsers');
            socket.off('receive_agent');
        }
        
    }, [socket]);

    useEffect(() => {
        if(users?.users){
            setUsersOn(users.users.map(user => ({
                _id: user._id,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                status: onlineUsers.some(onlineUser => onlineUser._id == user._id),
            })));
        }
    }, [users?.users, onlineUsers]);
    
    return (
        <React.Fragment>
            <TitleNavbar title='Manage Message Customers' />
            <MessageModal socket={socket} username={username} userId={userId} />
            <div className='p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-x-4'>
                {usersOn && usersOn?.map((item, index) => (
                    <div key={index} className='bg-white shadow-lg p-4 rounded-md border-2 border-gray-300'>
                        <div className="mb-5">
                            <div className="flex gap-x-3">
                                <span className="font-bold">Status:</span>
                                <div className="flex gap-x-3 items-center">
                                <div
                                    className={`w-2 h-2 rounded-full ${item.status ? 'bg-green-500' : 'bg-red-500'}`}
                                ></div>
                                <p className="font-medium">{item.status ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex flex-col gap-y-3 my-4'>
                            <p><span className='font-bold'>First Name: </span>{item.firstName}</p>
                            <p><span className='font-bold'>Last Name: </span>{item.lastName}</p>
                            <p><span className='font-bold'>Username: </span>{item.username}</p>
                        </div>
                       <div className='w-full mt-4'>
                            <button type='button' onClick={() => handleToggleMessagae(item.username, item._id)} className='w-full transition duration-300 ease-in-out cursor-pointer hover:bg-blue-400 py-2 px-3 bg-blue-500 text-white rounded-sm font-medium'>See Message</button>
                       </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}


export default Message;