import { Request, Response } from 'express';
import { prisma } from '../lib/db';

// --- Page & CMS ---

export const getPages = async (req: Request, res: Response) => {
    try {
        const pages = await prisma.page.findMany({
            include: {
                sections: {
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { slug: 'asc' }
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pages', error });
    }
};

export const createPage = async (req: Request, res: Response) => {
    try {
        const { title, slug } = req.body;
        const page = await prisma.page.create({
            data: { title, slug, isSystem: false }
        });
        res.status(201).json(page);
    } catch (e) {
        res.status(500).json({ message: 'Error creating page', error: e });
    }
}

export const deletePage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const page = await prisma.page.findUnique({ where: { id } });
        if (page?.isSystem) {
            return res.status(403).json({ message: 'Cannot delete system pages' });
        }

        // Delete sections first due to FK
        await prisma.pageSection.deleteMany({ where: { pageId: id } });
        await prisma.page.delete({ where: { id } });
        res.json({ message: 'Page deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting page', error: e });
    }
}

export const getPageBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const page = await prisma.page.findUnique({
            where: { slug },
            include: {
                sections: {
                    where: { isVisible: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });
        // Dont return 404, return specific code so frontend can handle it (create mode)
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

export const updateSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content, isVisible, sortOrder } = req.body;

        const section = await prisma.pageSection.update({
            where: { id },
            data: {
                content,
                isVisible,
                sortOrder
            }
        });
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: 'Error updating section', error });
    }
};

export const deleteSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.pageSection.delete({ where: { id } });
        res.json({ message: 'Section deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting section' });
    }
}

export const createSection = async (req: Request, res: Response) => {
    try {
        const { pageId, type, content, isVisible, sortOrder } = req.body;
        const section = await prisma.pageSection.create({
            data: {
                pageId,
                type,
                content,
                isVisible: isVisible ?? true,
                sortOrder: sortOrder ?? 99
            }
        });
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: "Error creating section", error });
    }
}
