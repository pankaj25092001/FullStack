import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import all your routers, just like in your old index.ts
import userRouter from './routes/user.routes';
import videoRouter from './routes/video.routes';
import cartRouter from './routes/cart.routes';
import paymentRouter from './routes/payment.routes';
import watchlistRouter from './routes/watchlist.routes';
import orderRouter from './routes/order.routes';

const app = express();

// --- Middlewares ---
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/watchlist', watchlistRouter);
app.use('/api/v1/orders', orderRouter);

// We export the configured app, but we DO NOT start it here.
export default app;