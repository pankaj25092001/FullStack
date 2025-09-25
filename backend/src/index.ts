import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
//import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import orderRouter from './routes/order.routes';
import userRouter from './routes/user.routes';
import videoRouter from './routes/video.routes';
import cartRouter from './routes/cart.routes';
import paymentRouter from './routes/payment.routes';
import watchlistRouter from './routes/watchlist.routes';

//dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/watchlist', watchlistRouter);
app.use('/api/v1/orders', orderRouter); 

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});