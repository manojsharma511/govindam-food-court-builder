import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Default Branch
    const defaultBranch = await prisma.branch.create({
        data: {
            name: "Main Branch",
            slug: "main-branch",
            email: "admin@govindam.com",
            address: "Main Street, City",
            phone: "1234567890",
        }
    });

    // Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@govindam.com' },
        update: {
            branchId: defaultBranch.id
        },
        create: {
            email: 'admin@govindam.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            branchId: defaultBranch.id
        },
    });

    console.log({ admin });

    // Create Menu Categories
    const categories = [
        { name: 'Starters', icon: '🥗', sortOrder: 1 },
        { name: 'Main Course', icon: '🍛', sortOrder: 2 },
        { name: 'Biryani & Rice', icon: '🍚', sortOrder: 3 },
        { name: 'Breads', icon: '🫓', sortOrder: 4 },
        { name: 'Desserts', icon: '🍮', sortOrder: 5 },
        { name: 'Beverages', icon: '🥤', sortOrder: 6 },
    ];

    for (const cat of categories) {
        await prisma.menuCategory.create({
            data: {
                ...cat,
                branchId: defaultBranch.id
            },
        });
    }

    console.log('Seeded categories');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
