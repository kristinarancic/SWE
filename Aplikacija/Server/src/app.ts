import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatMessages';
import reviewRoutes from './routes/reviews';
import productRoutes from './routes/products';
import purchasesRoutes from './routes/purchases';
import specialOffersRoutes from './routes/specialOffers';
import notificationsRoutes from './routes/notifications';
import cors from 'cors';
import corsOrigins from './config/corsOrigins';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import shopRoutes from './routes/shops';

const app = express();
app.use(cors(corsOrigins));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/users', userRoutes);
app.use('/auth', authRoutes)
app.use('/chats', chatRoutes);
app.use('/reviews', reviewRoutes);
app.use('/shops', shopRoutes);
app.use('/products', productRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/specialOffers', specialOffersRoutes);
app.use('/notifications', notificationsRoutes);
export default app;
