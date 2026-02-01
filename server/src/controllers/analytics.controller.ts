import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getOverview = async (req: Request, res: Response) => {
    try {
        const totalOrders = await prisma.order.count();
        const totalBookings = await prisma.booking.count();
        const totalUsers = await prisma.user.count();
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true }
        });

        res.json({
            totalOrders,
            totalBookings,
            totalUsers,
            totalRevenue: totalRevenue._sum.totalAmount || 0
        });
    } catch (error) {
        console.error('Error in analytics overview:', error);
        res.status(500).json({ message: 'Error fetching analytics overview', error });
    }
};

export const getSalesData = async (req: Request, res: Response) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const orders = await prisma.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true, totalAmount: true }
        });

        const salesByDate: Record<string, number> = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + Number(order.totalAmount);
        });

        // Format for frontend chart if necessary, or just return object
        const formattedData = Object.entries(salesByDate).map(([date, amount]) => ({
            date,
            amount
        })).sort((a, b) => a.date.localeCompare(b.date));

        res.json(formattedData);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales data', error });
    }
};
