import { FormEvent, useContext, useEffect, KeyboardEvent, useState, ChangeEvent, FC, useRef } from 'react'
import { ContextData } from '../../context/AppContext'
import { FaTimes } from 'react-icons/fa';
import { Socket } from 'socket.io-client';

interface MessageProps {
    message: string;
}

interface SockerProps {
    socket: Socket;
    username: string;
    userId: string;
}

interface messagesProps {
    userId: string;
    status: number;
    message: string;
}


const MessageModal: FC<SockerProps> = ({ socket, username, userId }) => {
    
    const context = useContext(ContextData);
    const messageRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
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

    useEffect(() => {
        if(toggleForm){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }

        socket.on('receive_agent', (data) => {
            if(data.userId === userId){
                setMessages([...messages, { 
                    userId: data.userId,
                    status: data.status,
                    message: data.message
                }]);
            }
        })

        return  () => {
            socket.off('receive_agent');
        }

    }, [toggleForm, socket, messages, userId])

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [messages]);
    

    return (
        <div className={`modal-overlay ${toggleForm && ('active')}`}>
            <div className="modal-content-message flex justify-center px-5 pb-10">
                    <div className="bg-white w-full max-w-[400px] h-[500px] rounded-lg shadow-lg">
                    <div className="bg-purple-600 rounded-t-lg px-5 py-5 flex items-center">
                        <p className="text-white font-bold text-l">Customer Service AI Chat Bot</p>
                        <div className='absolute top-12 right-14 transform -translate-y-1/2 -translate-x-1/2'>
                            <button type='button' onClick={() => setToggleForm(false)}  className='cursor-pointer text-gray-400 transition duration-300 ease-in-out hover:text-red-400'><FaTimes fontSize={24} /></button>
                        </div>
                    </div>
                    <div ref={messageRef} className="flex-grow max-h-[360px] h-full overflow-y-auto p-4 space-y-4 bg-red-100">
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
                    </div>
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
                        <button
                        ref={buttonRef}
                        data-username={username}
                        data-userid={userId}
                        className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
                        type="submit"
                        >
                        Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MessageModal;
