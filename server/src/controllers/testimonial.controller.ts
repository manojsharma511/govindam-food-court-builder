
import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { emitConfigUpdate } from '../lib/realtime';

// Default testimonials data
const defaultTestimonials = [
    {
        customerName: 'Priya Sharma',
        customerRole: 'Food Blogger',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        rating: 5,
        review: 'The best Indian food I\'ve ever had! The butter chicken here is absolutely divine. The ambiance is perfect for family dinners and special occasions.',
        sortOrder: 0
    },
    {
        customerName: 'Rajesh Patel',
        customerRole: 'Regular Customer',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        rating: 5,
        review: 'Been coming here for 10 years. The consistency in quality and taste is remarkable. Their biryani is simply the best in town!',
        sortOrder: 1
    },
    {
        customerName: 'Anita Desai',
        customerRole: 'Corporate Event Planner',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        rating: 5,
        review: 'We hosted our company event here and the team went above and beyond. Amazing food, impeccable service, and beautiful presentation.',
        sortOrder: 2
    },
    {
        customerName: 'Vikram Singh',
        customerRole: 'Food Critic',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        rating: 5,
        review: 'A rare find - authentic flavors with modern presentation. The chefs clearly understand the nuances of traditional Indian cooking.',
        sortOrder: 3
    }
];

export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) return res.json([]);

        // Check if user is admin/super_admin to show all
        const token = req.header('Authorization')?.replace('Bearer ', '');
        let isAdmin = false;

        // Simple manual check since we might not have gone through authMiddleware for this public route
        if (token) {
            try {
                const jwt = require('jsonwebtoken'); // Lazy load
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;
                if (['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
                    isAdmin = true;
                }
            } catch (e) { /* ignore invalid token */ }
        }

        const where: any = { branchId: branch.id };
        if (!isAdmin) {
            where.isVisible = true;
        }

        let testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: { sortOrder: 'asc' }
        });

        // Seed if empty AND we are looking for public ones
        if (testimonials.length === 0 && !isAdmin) {
            // Create defaults in parallel
            const createPromises = defaultTestimonials.map(t =>
                prisma.testimonial.create({
                    data: { ...t, branchId: branch.id }
                })
            );
            testimonials = await Promise.all(createPromises);
        }

        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials', error });
    }
};

export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const { customerName, customerRole, rating, review, imageUrl, sortOrder } = req.body;
        const branch = await prisma.branch.findFirst();
        const user = (req as any).user;

        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        // Auto-approve if admin/super_admin
        const isVisible = user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

        const testimonial = await prisma.testimonial.create({
            data: {
                customerName,
                customerRole,
                rating,
                review,
                imageUrl,
                isVisible, // Set visibility based on role
                sortOrder: sortOrder || 0,
                branch: { connect: { id: branch.id } }
            }
        });

        // Only emit if visible
        if (isVisible) {
            emitConfigUpdate('testimonials', testimonial);
        }

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating testimonial', error });
    }
};

export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const testimonial = await prisma.testimonial.update({
            where: { id },
            data
        });
        emitConfigUpdate('testimonials', testimonial);
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial', error });
    }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.testimonial.delete({ where: { id } });
        emitConfigUpdate('testimonials', { id });
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial', error });
    }
};
