import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { routes } from './controllers/routes';
import { errorHandlerMiddleware } from './middleware/errorhandler';
import dbConnect from './config/dbConnection';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { initSocketController } from './controllers/socket';
import { fileURLToPath } from 'url';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = new Hono();

app.use(cors());
const port = 5000;


app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/static'), 
  })
)

// Error handling middleware
app.onError(errorHandlerMiddleware);

// Register routes
routes.forEach((route) => {
  app.route("/", route);
});

dbConnect();


const server = serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  }
);


// Initialize Socket.IO
const io = new Server(server as HttpServer,{
  cors: {
    origin: '*', // Allow all origins
    methods: ["GET", "POST"], 
  },
  transports: ['websocket', 'polling'], 
  allowEIO3: true, 
});

initSocketController(io);


export default app;