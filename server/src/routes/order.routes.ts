import { Router } from 'express';
import { prisma } from '../lib/db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Create Order (Protected, but for Users)
router.post('/', authMiddleware, async (req: any, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user.userId;

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        menuItemId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Order error", error);
        res.status(500).json({ message: "Failed to place order" });
    }
});

// Get User Orders
router.get('/my-orders', authMiddleware, async (req: any, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: { items: { include: { menuItem: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

export default router;
