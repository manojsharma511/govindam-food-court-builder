import { Request, Response } from 'express';
import { prisma } from '../lib/db';

// Default gallery images
const defaultGalleryImages = [
    {
        url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
        caption: "Fine Dining Area",
        category: "ambiance",
        sortOrder: 0
    },
    {
        url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800",
        caption: "Signature Thali",
        category: "food",
        sortOrder: 1
    },
    {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
        caption: "Private Dining",
        category: "ambiance",
        sortOrder: 2
    },
    {
        url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800",
        caption: "Paneer Tikka",
        category: "food",
        sortOrder: 3
    },
    {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
        caption: "Evening Mood",
        category: "ambiance",
        sortOrder: 4
    },
    {
        url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800",
        caption: "Delicious Desserts",
        category: "food",
        sortOrder: 5
    }
];

export const getGalleryImages = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.json([]);
        }

        let images = await prisma.galleryImage.findMany({
            where: { branchId: branch.id },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        // Seed if empty
        if (images.length === 0) {
            const createPromises = defaultGalleryImages.map(img =>
                prisma.galleryImage.create({
                    data: { ...img, branchId: branch.id }
                })
            );
            images = await Promise.all(createPromises);
        }

        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery images', error });
    }
};

export const addGalleryImage = async (req: Request, res: Response) => {
    try {
        const { url, caption, category } = req.body;
        const branch = await prisma.branch.findFirst();

        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const image = await prisma.galleryImage.create({
            data: {
                url,
                caption,
                category: category || 'all',
                branchId: branch.id
            }
        });
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error adding gallery image', error });
    }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.galleryImage.delete({ where: { id } });
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image', error });
    }
};
