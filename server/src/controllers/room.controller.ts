import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            include: { branch: true }
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { branchId, name, type, price, capacity, images, isAvailable } = req.body;
        const room = await prisma.room.create({
            data: {
                branchId,
                name,
                type,
                price,
                capacity,
                images,
                isAvailable
            }
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const room = await prisma.room.update({
            where: { id },
            data
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error updating room', error });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.room.delete({ where: { id } });
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error });
    }
};
