import React from 'react'
import { Socket } from "socket.io-client";

interface SocketProps {
    socket: Socket;
}

const Message: React.FC<SocketProps> = ({socket}) => {
  return (
    <React.Fragment>
        
    </React.Fragment>
  )
}


export default Message;