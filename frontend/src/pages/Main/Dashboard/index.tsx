import React from 'react'
import { Socket } from "socket.io-client";

interface SocketProps {
    socket: Socket;
}

const Dashboard: React.FC<SocketProps> = ({ socket }) => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;