import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import userRoutes from './routes/user.routes';
import pageRoutes from './routes/page.routes';
import settingsRoutes from './routes/settings.routes';
import adminRoutes from './routes/admin.routes';
import orderRoutes from './routes/order.routes';
import bookingRoutes from './routes/booking.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';
import branchRoutes from './routes/branch.routes';
import roomRoutes from './routes/room.routes';
import analyticsRoutes from './routes/analytics.routes';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
import galleryRoutes from './routes/gallery.routes';

import teamRoutes from './routes/team.routes';
import testimonialRoutes from './routes/testimonial.routes';
import valueRoutes from './routes/value.routes';
import { initializeSocket } from './lib/realtime';
import { createServer } from 'http';

// Create HTTP server
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

app.use('/api/branches', branchRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/values', valueRoutes);


// Serve uploads directory specifically
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
