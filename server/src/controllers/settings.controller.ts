
import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { emitConfigUpdate } from '../lib/realtime';

// --- Theme Settings ---

export const getThemeSettings = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const settings = await prisma.themeSettings.findFirst({
            where: { branchId: branch.id }
        });

        if (!settings) {
            return res.json({
                primaryColor: "#eab308",
                secondaryColor: "#1a1a1a",
                accentColor: "#ffffff",
                backgroundColor: "#ffffff",
                textColor: "#000000",
                fontFamilyHeading: "Inter",
                fontFamilyBody: "Inter",
                borderRadius: "0.5rem",
                shadowIntensity: "medium"
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching theme settings', error });
    }
};

export const updateThemeSettings = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const existing = await prisma.themeSettings.findFirst({
            where: { branchId: branch.id }
        });

        let settings;
        if (existing) {
            settings = await prisma.themeSettings.update({
                where: { id: existing.id },
                data: { ...data }
            });
        } else {
            settings = await prisma.themeSettings.create({
                data: {
                    ...data,
                    branchId: branch.id
                }
            });
        }
        emitConfigUpdate('theme-settings', settings);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating theme settings', error });
    }
};

// --- Global Settings ---

export const getGlobalSettings = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.json({});
        }

        const settings = await prisma.globalSettings.findFirst({
            where: { branchId: branch.id }
        });

        if (!settings) {
            return res.json({
                siteName: "Hotel Govindam",
                maintenanceMode: false,
                ordersEnabled: true,
                bookingsEnabled: true,
                contactEmail: "",
                contactPhone: "",
                address: "",
                socialLinks: {},
                businessHours: {},
                homeHeroTitle: "Welcome to Hotel Govindam",
                homeHeroSubtitle: "Authentic Flavors, Royal Ambience",
                homeHeroCtaText: "View Menu",
                menuTitle: "Our Menu",
                menuSubtitle: "Explore our culinary delights",
                galleryTitle: "Our Gallery",
                gallerySubtitle: "Visual feast of our ambiance and food",
                contactTitle: "Contact Us",
                contactSubtitle: "Get in touch with us"
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching global settings', error });
    }
};

export const updateGlobalSettings = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const existing = await prisma.globalSettings.findFirst({
            where: { branchId: branch.id }
        });

        let settings;
        if (existing) {
            settings = await prisma.globalSettings.update({
                where: { id: existing.id },
                data: { ...data }
            });
        } else {
            settings = await prisma.globalSettings.create({
                data: {
                    ...data,
                    branchId: branch.id
                }
            });
        }
        emitConfigUpdate('global-settings', settings);
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating global settings', error });
    }
};

// --- Contact Messages ---

export const getMessages = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        const messages = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' },
            ...(branch ? { where: { branchId: branch.id } } : {})
        });
        res.json(messages);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
