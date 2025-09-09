import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './modules/auth/auth.controller';

dotenv.config();

const app = express();
app.use(express.json());

// health check
app.get('/health', (_, res) => res.json({ ok: true }));

// only auth routes for the prototype
app.use('/auth', authRouter);

// DB + server start
const MONGO = process.env.MONGO_URI ?? 'mongodb://localhost:27017/frete';
const PORT = Number(process.env.PORT ?? 3000);

mongoose.set('strictQuery', false);

mongoose.connect(MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

export default app;
