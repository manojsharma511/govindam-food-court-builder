
import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { emitConfigUpdate } from '../lib/realtime';

export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) return res.json([]);

        const members = await prisma.teamMember.findMany({
            where: { branchId: branch.id, isVisible: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team members', error });
    }
};

export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const { name, role, description, imageUrl, sortOrder } = req.body;
        const branch = await prisma.branch.findFirst();

        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const member = await prisma.teamMember.create({
            data: {
                name,
                role,
                description,
                imageUrl,
                sortOrder: sortOrder || 0,
                branch: { connect: { id: branch.id } }
            }
        });
        emitConfigUpdate('team-members', member);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Error creating team member', error });
    }
};

export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const member = await prisma.teamMember.update({
            where: { id },
            data
        });
        emitConfigUpdate('team-members', member);
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Error updating team member', error });
    }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.teamMember.delete({ where: { id } });
        emitConfigUpdate('team-members', { id });
        res.json({ message: 'Team member deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team member', error });
    }
};
