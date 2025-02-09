import { FormEvent, useContext, useEffect, KeyboardEvent, useState, ChangeEvent, FC, useRef } from 'react'
import { ContextData } from '../../context/AppContext'
import { FaTimes } from 'react-icons/fa';
import { Socket } from 'socket.io-client';
interface MessageProps {
    message: string;
}

interface UserMessages {
    userId: string;
    status: number;
    message: string;
}

interface SockerProps {
    socket: Socket;
    username: string;
    userId: string;
    isLoading: boolean;
    refetch(): void;
    messagesData?: UserMessages[];
}

interface messagesProps {
    status: number;
    userId: string;
    message: string;
}



const MessageModal: FC<SockerProps> = ({ socket, username, userId, isLoading, refetch, messagesData}) => {
    
    const context = useContext(ContextData);
    const messageRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const buttonRefStop = useRef<HTMLButtonElement>(null)
    const [id, setId] = useState("");
    const [toggleEnd, setToggleEnd] = useState(false);

    
    const [messages, setMessages] = useState<messagesProps[]>([]);

    if(!context) {
        throw new Error("No running context");
    }

    const {toggleForm, setToggleForm} = context;
    const [message, setMessage] = useState<MessageProps>({
        message: '',
    });
    
    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        setToggleEnd(false);
        if (message.message.trim() !== "") {

            if (!buttonRef.current) {
                throw new Error("No ref current");
            }

            const {username, userid} = buttonRef.current.dataset
            
            socket.emit('privateMessage', { to: username, message: message.message, userId: userid, status: 1}) 
            
            setMessages([...messages, { 
                userId: userId,
                status: 1,
                message: message.message,
            }]);

            setMessage({ message: "" }); 
        }
    };

    const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage({...message, [e.target.name]: e.target.value})
    }   

    // Function to handle "Enter" key press
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); 
        handleSendMessage(e); 
        }
    };

    const handleClose = () => {
        setToggleForm(false);
        setId("");
    }
    
    // stop ticket

    const stopTicket = () => {
        socket.emit('stop_ticket', {userId: id});
        setMessages([]);
        refetch();
        setToggleEnd(true);
    }

    useEffect(() => {
        if(toggleForm){
            document.body.style.overflow = 'hidden';
            setToggleEnd(false);
        }else{
            document.body.style.overflow = 'auto';
        }

        socket.on('stop_ticket_receive', (data) => {
           if(data.userId === userId){
            setMessages([]);
            setToggleEnd(true);
           }
        });

        socket.on('receive_agent', (data) => {
            if(data.userId === userId){
                setToggleEnd(false);
                setMessages([...messages, { 
                    userId: data.userId,
                    status: data.status,
                    message: data.message
                }]);
            }
        })

        return  () => {
            socket.off('receive_agent');
            socket.off('stop_ticket_receive');
        }

    }, [toggleForm, socket, messages, userId])


     // Loading
     useEffect(() => {

        if(userId){
            setId(userId);
        }


    }, [isLoading, userId]);

    useEffect(() => {
        if (isLoading) {
            setMessages([]); // Clear messages while loading
        } else if (messagesData) {
            setMessages([
                ...messagesData.map((msg: messagesProps) => ({
                    userId: msg.userId,
                    status: msg.status,
                    message: msg.message
                }))
            ]);
        }
    }, [isLoading, messagesData]);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [messageRef, messages]);

    return (
        <div className={`modal-overlay ${toggleForm && ('active')}`}>
            <div className="modal-content-message flex justify-center px-5 pb-10">
                    <div className="bg-white w-full max-w-[400px] h-[500px] rounded-lg shadow-lg">
                    <div className="bg-purple-600 rounded-t-lg px-5 py-5 flex items-center">
                        <p className="text-white font-bold text-l">Customer Service AI Chat Bot</p>
                        <div className='absolute top-12 right-14 transform -translate-y-1/2 -translate-x-1/2'>
                            <button type='button' onClick={handleClose}  className='cursor-pointer text-gray-400 transition duration-300 ease-in-out hover:text-red-400'><FaTimes fontSize={24} /></button>
                        </div>
                    </div>
                    <div ref={messageRef} className={`flex-grow ${messages?.length != 0 ? 'max-h-[360px]' : 'max-h-[440px]'}  h-full overflow-y-auto p-4 space-y-4 bg-red-100`}>
                        {messages.map((message, index) => (
                            <div key={index} className={`flex gap-x-4 ${message.status === 3 ? 'justify-start' : 'justify-end'} items-end`}>
                                {message.status == 3 && (
                                    <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                                        UN
                                    </div>
                                    )
                                }
                                <div className={`${message.status === 3 ? 'bg-blue-500 text-white' : message.status === 2 ? 'bg-yellow-700 text-white'  : 'bg-gray-300 text-black'} p-2 rounded-lg max-w-[70%]`}>
                                    {message.message}
                                </div>
                                {message.status == 2 && (
                                    <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                                        A I
                                    </div>
                                    )
                                }
                                {message.status == 1 && (
                                    <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                                        HM
                                    </div>
                                    )
                                }
                            </div>
                        ))}
                        {toggleEnd && (
                            <div className='text-center text-gray-500 font-bold'>
                                End of Chat
                            </div>
                        )}
                    </div>
                    {messages.length != 0 && ( 
                        <form onSubmit={handleSendMessage} className="w-full flex items-center px-4 py-3 border-t-2">
                            <textarea
                            name="message"
                            id="message"
                            value={message.message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                            className="rounded-lg w-full h-[50px] resize-none border-2 p-2"
                            placeholder="Type your message..."
                            ></textarea>
                            <div className='flex'>
                                <button
                                ref={buttonRef}
                                data-username={username}
                                data-userid={userId}
                                className="cursor-pointer ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
                                type="submit"
                                >
                                Send
                                </button>
                            
                                <button
                                ref={buttonRefStop}
                                onClick={stopTicket}
                                className="cursor-pointer ml-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                                type="button"
                                >
                                End
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageModal;
