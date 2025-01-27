import { Hono } from 'hono';
import { MessageAiController, MessageAiImageController } from '.';
import { authenticationMiddleware } from '@/middleware/authentication';
import upload from '@/libs/multer';

const wrapMulterMiddleware = (middleware: any) => {
  return async (c: any, next: any) => {
    await new Promise((resolve, reject) => {
      middleware(c.req.raw, c.res.raw, (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
    await next();
  };
};

const router = new Hono()
  .post('/ai/message', MessageAiController)
  .post(
    '/ai/image',
    wrapMulterMiddleware(upload.single('image')),
    MessageAiImageController
  );

export default router;
