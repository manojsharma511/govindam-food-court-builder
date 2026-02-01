import { Router } from 'express';
import { prisma } from '../lib/db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Create Order (Protected, but for Users)
router.post('/', authMiddleware, async (req: any, res) => {
    try {
        const { items, totalAmount, branchId: bodyBranchId } = req.body;
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const branchId = user?.branchId || bodyBranchId;

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID required" });
        }

        const orderData: any = {
            totalAmount,
            status: 'PENDING',
            branch: { connect: { id: branchId } },
            items: {
                create: items.map((item: any) => ({
                    menuItem: { connect: { id: item.id } },
                    quantity: item.quantity,
                    price: item.price,
                    branch: { connect: { id: branchId } }
                }))
            }
        };

        if (userId) {
            orderData.user = { connect: { id: userId } };
        }

        const order = await prisma.order.create({
            data: orderData
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
