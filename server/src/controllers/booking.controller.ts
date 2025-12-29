import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // User might be optional? Frontend enforces login.
        const { bookingType, bookingDate, bookingTime, guestCount, guestName, guestEmail, guestPhone, specialRequests } = req.body;

        const booking = await prisma.booking.create({
            data: {
                userId: userId || null,
                date: new Date(bookingDate),
                time: bookingTime,
                guests: parseInt(guestCount),
                name: guestName,
                email: guestEmail,
                phone: guestPhone,
                specialRequests: specialRequests,
                occasion: bookingType,
                status: 'PENDING'
            }
        });
        res.status(201).json(booking);
    } catch (error) {
        console.error('Create booking error', error);
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { date: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all bookings' });
    }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status' });
    }
};
