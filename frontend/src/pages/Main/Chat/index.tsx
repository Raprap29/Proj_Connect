import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Socket } from "socket.io-client";
import { getAuthToken } from '../../../components/authToken/helperAuth';
import TitleNavbar from '../../../components/TItleNavbar';
import { useGetOnlineUsersQuery } from '../../../api/MessageApi';
import { ContextData } from '../../../context/AppContext';
import MessageModal from '../../../components/modal/messageModal';
import { FaRegBell } from "react-icons/fa";
import { useGetMessagesQuery, useUpdateUnreadMutation } from '../../../api/MessageApi';
import { skipToken } from '@reduxjs/toolkit/query';
import Loading from '../../../components/loading';
import SearchHooks from '../../../hooks/searchHooks';

interface SocketProps {
    socket: Socket;
}

interface StatusOnline {
    status?: boolean;
}

interface User extends StatusOnline {
    _id: string;
    firstName: string;
    lastName: string;
    role: number;
    username: string;
}

interface messagesRead {
    userId: string;
    message: string;
    read: boolean;
    ticketId: string;
    status: number;
}

// Main online users

interface OnlineProps {
    id: string;
    username: string;
    role: number;
    _id: string;
}


interface UsersOnline {
    user: User;
    messages: messagesRead[],
}

const Message: React.FC<SocketProps> = ({socket}) => {

    const [onlineUsers, setOnlineUsers] = useState<OnlineProps[]>([{
        id: '',
        username: '',
        role: 0,
        _id: '',
    }]);
    
    const [usersOn, setUsersOn] = useState<UsersOnline[]>([{
        user: {
            _id: '',
            firstName: '',
            lastName: '',
            role: 0,
            username: '',
            status: false,
        },
        messages: [
            {
                userId: '',
                message: '',
                read: false,
                ticketId: '',
                status: 0,
            }
        ]
    }]);


    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }

    const { setToggleForm, toggleForm} = context;
    const [search, setSearch] = useState("");
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    
    const {data: users, refetch} = useGetOnlineUsersQuery({searchQuery: search});
    const [updateUnread] = useUpdateUnreadMutation();


    const { data: messagesData, isLoading, refetch: refetchMessage} = useGetMessagesQuery(
        userId ? { userId: userId } : skipToken,
        {
            refetchOnMountOrArgChange: true
        }
    );
    
    const handleToggleMessagae = async (username: string, id: string) => {
        
        const success = await updateUnread({
            userId: id
        });

        if(!success?.data){
            throw new Error("no data");
        }

        if(success?.data.status){
            setUsername(username);
            setUserId(id);
            setToggleForm(true);
            refetch();
        }
    }

    const {searchString, handleSearchChange} = SearchHooks();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearch(searchString);
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

        socket.on('receive-notif', () => {
            if(!toggleForm){
                refetch();
            }
        })

        return () => {
            socket.off('receive-notif');
            socket.off('onlineUsers');
        }
        
    }, [socket, users, refetch, toggleForm, userId]);

    useEffect(() => {

        if(!toggleForm){
            refetch();
        }
        
        if(users?.users){
            setUsersOn(users.users.map(user => ({
                user: {
                    _id: user.user._id,
                    firstName: user.user.firstName || '',
                    lastName: user.user.lastName || '',
                    role: user.user.role || 0, // Assuming role exists in user object
                    username: user.user.username || '',
                    status: onlineUsers.some(onlineUser => onlineUser._id === user.user._id),
                },
                messages: user.messages?.map(item => ({
                    userId: item?.userId || '',
                    message: item?.message || '',
                    read: item?.read ?? false, 
                    ticketId: item?.ticketId || '',
                    status: item?.status ?? 0,
                })) || []
            })));
        }
    }, [users, onlineUsers, toggleForm, refetch]);

    return (
        <React.Fragment>
            <Loading loading={isLoading} />
            <TitleNavbar title='Manage Message Customers' />
            <MessageModal refetch={refetchMessage} messagesData={messagesData?.data} isLoading={isLoading} socket={socket} username={username} userId={userId} />
            <div className='p-5'>
                <form onSubmit={handleSubmit} className='mb-4 flex gap-x-3 items-center'>
                    <input onChange={handleSearchChange} type="text" placeholder='Search...' className='rounded-[5px] border py-2 px-3 outline-none border-gray-300 focus:border-blue-300' />
                    <button type='submit' className='bg-blue-500 text-white py-2 px-5 rounded-[5px] font-medium cursor-pointer transition duration-300 ease-in-out hover:bg-blue-400'>Search</button>
                </form>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-x-4'>
                    {usersOn && usersOn?.map((item, index) => (
                        <div key={index} className='bg-white shadow-lg p-4 rounded-md border-2 border-gray-300'>
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex gap-x-3">
                                    <span className="font-bold">Status:</span>
                                    <div className="flex gap-x-3 items-center">
                                        <div
                                            className={`w-2 h-2 rounded-full ${item.user.status ? 'bg-green-500' : 'bg-red-500'}`}
                                        ></div>
                                        <p className="font-medium">{item.user.status ? 'Online' : 'Offline'}</p>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <FaRegBell fontSize={22} />
                                    <div className='bg-red-500 text-white absolute -top-2 font-bold left-2 h-5 flex justify-center items-center rounded-full text-[12px] w-5'>
                                        {item.messages?.filter(msg => msg.read == false).length || 0}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='flex flex-col gap-y-3 my-4'>
                                <p><span className='font-bold'>First Name: </span>{item.user.firstName}</p>
                                <p><span className='font-bold'>Last Name: </span>{item.user.lastName}</p>
                                <p><span className='font-bold'>Username: </span>{item.user.username}</p>
                            </div>
                        <div className='w-full mt-4'>
                                <button type='button' onClick={() => handleToggleMessagae(item.user.username, item.user._id)} className='w-full transition duration-300 ease-in-out cursor-pointer hover:bg-blue-400 py-2 px-3 bg-blue-500 text-white rounded-sm font-medium'>See Message</button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}


export default Message;