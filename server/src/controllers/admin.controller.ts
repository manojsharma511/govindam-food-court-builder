import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { menuItem: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: "Error fetching orders" });
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });
        res.json(order);
    } catch (e) {
        res.status(500).json({ message: "Error updating order" });
    }
}

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(bookings);
    } catch (e) {
        res.status(500).json({ message: "Error fetching bookings" });
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
    } catch (e) {
        res.status(500).json({ message: "Error updating booking" });
    }
}
