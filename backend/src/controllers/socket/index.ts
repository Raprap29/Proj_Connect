import { Server as SocketIOServer, Socket } from 'socket.io';
import MessageModel from '@/models/Message';
import messageService from '@/services/messageService';
interface User {
  username: string;
  id: string;
  role: number;
  _id: string;
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

    // Put online users when login
    socket.on('login', (data: User) => {
      console.log(`User logged in: ${data.id} (${socket.id})`);
      if(!users.has(data.id)){
        users.set(data.id, {username: data.username, id: socket.id, role: data.role, _id: data.id});
      }

      socket.emit('loggedIn', `Welcome, ${data.username}! You are now online.`);

      io.emit('onlineUsers', users);
    });

    // Finish ticket

    socket.on('stop_ticket', async (data) => {
      await messageService.STOP_TICKETS(data.userId);
      socket.broadcast.emit("stop_ticket_receive", {userId: data.userId});
    });

    socket.on('register', (data: messageProps) => {
      console.log(data.message);
    });

    // Send to the agent from customer
     
    socket.on('send_agent', async (data) => {
      // Service Message
     const success = await messageService.ADD_MESSAGES(data);

     if(success){
      socket.broadcast.emit("receive_agent", {message: data.message, userId: data.userId, status: data.status});
     }
    });

    // Reconnected when refersh or open the website when she is login in website

    socket.on('reconnected', (data: { username: string, role: number, id: string }) => {
      users.set(data.id, {username: data.username, id: socket.id, role: data.role, _id: data.id});
      io.emit('onlineUsers', Array.from(users.values()));
    });

    // Get oline users

    socket.on('getonline', () => {
      io.emit('onlineUsers', Array.from(users.values()));
    });

    // Private mesages with agent and customer

    socket.on('privateMessage', async ({ to, message, userId, status }: { to: string; message: string, userId: string, status: number  }) => {
        const sender = getUsernameBySocketId(userId);
        if (!sender) {
          socket.emit('error', 'You must log in before sending messages.');
          return;
        }

        const success = await messageService.ADD_MESSAGES({message, userId, status});

        if(success){
          socket.to(sender).emit('receiveMessage', {
            from: sender,
            message: message,
            status: status,
          });
        }
    })

    // Logout

    socket.on('logout', (data: User) => {
      const id = data.id;
      if(id){
        users.delete(id);
        io.emit('onlineUsers', Array.from(users.values()));
      }

    });
    // UPdate notifcation from the agent
    socket.on('send-notif', (data) => {
      console.log(data);
      socket.broadcast.emit("receive-notif");
    });

    // Make the customer offline when disconnect

    socket.on('disconnect', () => {
        const id = getUsernameIdUsername(socket.id)
        if (id) {
          users.delete(id); // Remove the user from the map
  
          io.emit('onlineUsers', Array.from(users.values()));
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
  for (const [_id, user] of users.entries()) {
    if (_id === socketId) {
      return user.id;
    }
  }

  return undefined;
}


/**
 * Get the username associated with a socket ID.
 * @param socketId - The socket ID.
 * @returns The username or undefined if not found.
 */

function getUsernameIdUsername(socketId: string): string | undefined {
  for (const [id, user] of users.entries()) {
    if (user.id === socketId) {
      return id;
    }
  }

  return undefined;
}