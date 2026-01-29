import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject, message, branchId: bodyBranchId } = req.body;

        let branchId = bodyBranchId;
        if (!branchId) {
            const defaultBranch = await prisma.branch.findFirst();
            branchId = defaultBranch?.id;
        }

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID required" });
        }

        const submission = await prisma.contactSubmission.create({
            data: {
                name,
                email,
                phone,
                subject,
                message,
                branch: { connect: { id: branchId } }
            }
        });

        res.status(201).json(submission);
    } catch (error) {
        console.error('Contact submission error', error);
        res.status(500).json({ message: 'Error submitting form', error });
    }
};

export const getContactSubmissions = async (req: Request, res: Response) => {
    try {
        const submissions = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions' });
    }
}
