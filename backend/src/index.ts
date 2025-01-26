import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { routes } from './controllers/routes'
import { errorHandlerMiddleware } from './middleware/errorhandler'
import  dbConnect  from './config/dbConnection'
import { Server as SocketIOServer, Socket } from 'socket.io';
import { initSocketController } from './controllers/socket'
const app = new Hono()
app.use(cors());

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
