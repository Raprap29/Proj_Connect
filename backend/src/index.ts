import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { routes } from './controllers/routes'
import { errorHandlerMiddleware } from './middleware/errorhandler'
import  dbConnect  from './config/dbConnection'
import { Server as SocketIOServer, Socket } from 'socket.io';
import { initSocketController } from './controllers/socket'
import { fileURLToPath } from 'url';
import { serveStatic } from '@hono/node-server/serve-static'
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as fs from 'fs';

const app = new Hono()
console.log('Serving static files from:', path.join(__dirname, 'public/uploads'));
app.use(cors());

// Serve static files
app.use('/uploads/*', serveStatic({ 
  root: path.join(__dirname, 'public/uploads/93619653-ac58-462d-9deb-672ce7c73344.jpeg'),
  onNotFound: (path, c: Context) => {
    console.log(`${path} is not found, you access ${c.req.path}`);
  } 
}));

app.onError(errorHandlerMiddleware);

routes.forEach((route) => {
  app.route("/", route);
})



dbConnect();

const io = new SocketIOServer({
  cors: {
    origin: '*', 
  },
});


initSocketController(io);

const port = 5000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
