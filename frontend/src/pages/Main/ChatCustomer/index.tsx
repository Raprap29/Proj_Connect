import { ChangeEvent, FC, FormEvent, useEffect, useState, useRef, useMemo } from "react";
import { Socket } from "socket.io-client";
import { FaUser, FaRobot } from "react-icons/fa";
import { useMessageAiMutation } from "../../../api/AiApi";
import { getAuthToken } from "../../../components/authToken/helperAuth";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useGetMessagesQuery } from '../../../api/MessageApi';
import { skipToken } from '@reduxjs/toolkit/query';

interface MessageProps {
  status: number;
  userId: string;
  message: string;
}

interface Messages {
  username: string;
  status: number;
  message: string;
}

interface CustomJwtPayload extends JwtPayload {
  username: string;
  lastName: string;
  firstName: string;
  id: string;
}

interface CustomerProps {
  socket: Socket;
}

const CustomerChat: FC<CustomerProps> = ({ socket }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [toggleBtn, setToggleBtn] = useState(false);

  const token = getAuthToken();

  if(!token){
    throw new Error("No token");
  }

  const res = jwtDecode<CustomJwtPayload>(token);


  const { data: messagesData, refetch } = useGetMessagesQuery(
    res.id ? { userId: res.id } : skipToken
  );

  const [messageAi, {isLoading}] = useMessageAiMutation();

  const [messageForm, setMessageForm] = useState<MessageProps>({
    message: '',
    status: 0,
    userId: ''
  });

 const [messages, setMessages] = useState<Messages[]>([]);
 const [toggleShow, setToggleShow] = useState(false);
 const memoizedMessages = useMemo(() => {
        if (messagesData) {
              return [
              ...messagesData.data.map((msg: MessageProps) => ({
                userId: msg.userId,
                status: msg.status,
                message: msg.message
              })),
                ...messages,
            ];
        }
        return messages;
        
    }, [messagesData, messages]);

  // Handle message input change
  const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const StopTickets = async () => {
    socket.emit('stop_ticket', {userId: res.id});
    setMessages([]);
    refetch();
    setToggleShow(true);
  }

  // Handle sending message
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if(memoizedMessages?.length == 0){
      setToggleShow(false);
    }

    if (messageForm.message.trim() !== "") {
      socket.emit('send_agent', {message: messageForm.message, userId: res.id, status: 3})
      socket.emit('send-notif', {userId: res.id});
      if(toggleBtn){
          setMessages(prevMessages => [
            ...prevMessages,
            { username: res.username, status: 3, message: messageForm.message }
          ]);
          setMessageForm({  message: "",
            status: 3,
            userId: res.id, });
      }else{

        setMessages(prevMessages => [
          ...prevMessages,
          { username: res.username, status: 3, message: messageForm.message }
        ]);
        setMessageForm({ 
          message: "",
          status: 3,
          userId: res.id,
         });

        const response = await messageAi({
          message: messageForm.message,
        }).unwrap();

        if(!isLoading){
          setMessages(prevMessages => [
            ...prevMessages,
            { username: res.username, status: 2, message: response.message }
          ]);
        }

        socket.emit('send_agent', {message: response.message, userId: res.id, status: 2})

     }
    }
  };

  // Function to handle "Enter" key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleToggle = () => {
    setToggleBtn(!toggleBtn);
  }

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [memoizedMessages]);

  // Handle incoming messages via socket
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setToggleShow(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, status: data.status, message: data.message },
      ]);
    });

    socket.on('stop_ticket_receive', (data) => {
      if(data.userId === res.id){
        setMessages([]);
        refetch();
        setToggleShow(true);
      }
   });

    // Cleanup the socket event listener on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('stop_ticket_receive');
    };
  }, [socket, memoizedMessages, res, refetch]);

  return (
    <div className="bg-blue-300 w-full min-h-screen -mt-[65px]">
      <div className="flex justify-center pt-[100px] px-5 pb-10">
        <div className="bg-white w-full max-w-[400px] h-[500px] rounded-lg shadow-lg">
          <div className="bg-purple-600 rounded-t-lg justify-between px-5 py-2 flex items-center">
            <p className="text-white font-bold text-l">Customer Service AI Chat Bot</p>
            <div className="flex items-center gap-x-4">
              <button onClick={handleToggle} type="button" className={`cursor-pointer ${!toggleBtn ? 'bg-blue-700 pointer-events-none' : ''} transition duration-300 ease-in-out text-white border-2 p-3 rounded-[50%]`}>
                  <FaRobot size={18} />
              </button>
              <button onClick={handleToggle} type="button" className={`cursor-pointer ${toggleBtn ? 'bg-blue-700 pointer-events-none' : ''} transition duration-300 ease-in-out text-white border-2 p-3 rounded-[50%]`}>
                  <FaUser size={18} />
              </button>
            </div>
          </div>
          <div ref={messageRef} className="flex-grow max-h-[360px] h-full overflow-y-auto p-4 space-y-4 bg-red-100">
            {toggleShow && (
            <div className='text-center text-gray-500 font-bold'>
              End of Chat
            </div>
            )}
              {memoizedMessages.length == 0 && !toggleShow ? 
                <div className={`bg-blue-500 text-white p-2 rounded-lg max-w-[50%]`}>
                  How can I help you?
                </div> 
                : 
                <>
                  {memoizedMessages.map((message, index) => (
                    <div key={index} className={`flex items-end gap-x-4 ${message.status === 1 || message.status === 2 ? 'justify-start' : 'justify-end'}`}>
                      {message.status == 1 && (
                        <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                          UN
                        </div>
                        )
                      }
                      {message.status == 2 && (
                        <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                            A I
                        </div>
                        )
                      }
                      <div className={`${message.status === 1 ? 'bg-blue-500 text-white' : message.status === 2 ? 'bg-yellow-700 text-white' : 'bg-gray-300 text-black'} p-2 rounded-lg max-w-[70%]`}>
                        {message.message}
                      </div>
                      {message.status == 3 && (
                        <div className='bg-gray-500 h-[35px] flex items-center justify-center text-[12px] w-[35px] rounded-[50%] text-white font-bold'>
                          UN
                        </div>
                        )
                      }
                    </div>
                  ))}
                </>
                }
            {isLoading && (
              <div className={`flex justify-start`}>
                <div className={`bg-blue-500 text-white p-2 rounded-lg max-w-[70%]`}>
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="w-full flex items-center px-4 py-3 border-t-2">
            <textarea
              name="message"
              id="message"
              onChange={handleMessage}
              value={messageForm.message}
              onKeyDown={handleKeyDown}
              className="rounded-lg w-full h-[50px] resize-none border-2 p-2"
              placeholder="Type your message..."
            ></textarea>
            <div className="flex gap-x-1">
              <button
                className="ml-2 bg-purple-600 cursor-pointer transition duration-300 ease-in-out hover:bg-purple-500 text-white px-4 py-2 rounded-lg"
                type="submit"
              >
                Send
              </button>
              {memoizedMessages.length != 0 && (
                <button
                onClick={StopTickets}
                  className="ml-2 bg-red-600 cursor-pointer transition duration-300 ease-in-out hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                  type="button"
                >
                  End
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
