import { Server as SocketIOServer, Socket } from 'socket.io';
import MessageModel from '@/models/Message';
interface User {
    username: string;
    id: string;
}
  

// Map to store registered users with their socket IDs
const users: Map<string, User> = new Map();

/**
 * Initialize Socket.IO and handle events for private messaging.
 * @param server - The HTTP server instance.
 */
export function initSocketController(io: SocketIOServer): void {

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    socket.on('login', (username: string) => {
        users.set(username, {username: username, id: socket.id});

        console.log(`User logged in: ${username} (${socket.id})`);
        socket.emit('loggedIn', `Welcome, ${username}! You are now online.`);

        io.emit('onlineUsers', Array.from(users.keys()));
    });
    
    socket.on('privateMessage', async ({ to, message, userId, status }: { to: string; message: string, userId: string, status: number }) => {
        const sender = getUsernameBySocketId(socket.id);
        
        if (!sender) {
          socket.emit('error', 'You must log in before sending messages.');
          return;
        }
  
        const recipient = users.get(to);
        if (!recipient) {
          socket.emit('error', `User "${to}" is not online.`);
          return;
        }

        const AddMessage = await MessageModel.create({
            userId: userId,
            message: message,
            status: status, 
        });

        if(AddMessage){
            socket.to(recipient.id).emit('privateMessage', {
              from: sender,
              message,
            });
            console.log(`Private message from ${sender} to ${to}: ${message}`);
        }

    })

    socket.on('disconnect', () => {
        const username = getUsernameBySocketId(socket.id);
        if (username) {
          users.delete(username); // Remove the user from the map
          console.log(`User disconnected: ${username} (${socket.id})`);
  
          // Notify everyone about the updated online users
          io.emit('onlineUsers', Array.from(users.keys()));
        } else {
          console.log(`Client disconnected: ${socket.id}`);
        }
      });
  });
}

/**
 * Get the username associated with a socket ID.
 * @param socketId - The socket ID.
 * @returns The username or undefined if not found.
 */
function getUsernameBySocketId(socketId: string): string | undefined {
  for (const [username, user] of users.entries()) {
    if (user.id === socketId) {
      return username;
    }
  }
  return undefined;
}
