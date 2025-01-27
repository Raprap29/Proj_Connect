import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { routes } from './controllers/routes';
import { errorHandlerMiddleware } from './middleware/errorhandler';
import dbConnect from './config/dbConnection';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketController } from './controllers/socket';
import { fileURLToPath } from 'url';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = new Hono();

app.use(cors());


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

// Initialize Socket.IO
const io = new SocketIOServer({
  cors: {
    origin: '*', // Allow all origins
  },
});

initSocketController(io);

const port = 5000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
