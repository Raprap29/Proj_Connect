import { Server as SocketIOServer, Socket } from 'socket.io';
import MessageModel from '@/models/Message';
interface User {
  username: string;
  id: string;
  role: number;
}

interface messageProps {
  message: string;
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

    socket.on('login', (data: User) => {
      console.log(`User logged in: ${data.username} (${socket.id})`);
      users.set(data.username, {username: data.username, id: socket.id, role: data.role});

      socket.emit('loggedIn', `Welcome, ${data.username}! You are now online.`);

      io.emit('onlineUsers', users);
    });

    socket.on('register', (data: messageProps) => {
      console.log(data.message);
    });

    socket.on('reconnected', (data: { username: string, role: number }) => {
      users.set(data.username, {username: data.username, id: socket.id, role: data.role});
      console.log(`User ${data.username} reconnected with new socket ID ${socket.id}`);
      io.emit('onlineUsers', Array.from(users.values()));
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

        // const AddMessage = await MessageModel.create({
        //     userId: userId,
        //     message: message,
        //     status: status, 
        // });

        // if(AddMessage){
          socket.to(recipient.id).emit('receiveMessage', {
            from: sender,
            message,
          });
          console.log(`Private message from ${sender} to ${to}: ${message}`);
        // }

    })

    socket.on('logout', (data: User) => {
      const username = getUsername(data.username);

      if(username){
        users.delete(username);
        console.log(`User disconnected: ${username} (${socket.id})`);
        
        io.emit('onlineUsers', Array.from(users.keys()));
      }

    });

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


/**
 * Get the username associated with a socket ID.
 * @param username - The socket username.
 * @returns The username or undefined if not found.
 */
function getUsername(usernameOnline: string): string | undefined {
  for (const [username, user] of users.entries()) {
    if (username === usernameOnline) {
      return username;
    }
  }
  return undefined;
}
