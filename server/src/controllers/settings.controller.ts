import { Request, Response } from 'express';
import { prisma } from '../lib/db';

// --- Theme Settings ---

export const getThemeSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.themeSettings.findFirst();
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
        const existing = await prisma.themeSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.themeSettings.update({
                where: { id: existing.id },
                data: { ...data }
            });
        } else {
            settings = await prisma.themeSettings.create({
                data: { ...data }
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating theme settings', error });
    }
};

// --- Global Settings ---

export const getGlobalSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.globalSettings.findFirst();
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
                businessHours: {}
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
        const existing = await prisma.globalSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.globalSettings.update({
                where: { id: existing.id },
                data: { ...data }
            });
        } else {
            settings = await prisma.globalSettings.create({
                data: { ...data }
            });
        }
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating global settings', error });
    }
};

// --- Contact Messages ---

export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
