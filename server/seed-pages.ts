import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPages() {
    const pages = [
        {
            slug: 'home',
            title: 'Home Page',
            isSystem: true,
            sections: [
                {
                    type: 'hero',
                    content: {
                        title: 'Welcome to Govindam',
                        subtitle: 'Experience the pure taste of tradition',
                        buttonText: 'Order Now',
                        backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
                    },
                    sortOrder: 1
                },
                {
                    type: 'features',
                    content: {
                        title: 'Why Choose Us',
                        items: [
                            { title: 'Fresh Ingredients', description: 'We use only the freshest locally sourced ingredients' },
                            { title: 'Fast Delivery', description: 'Hot food delivered to your doorstep' },
                            { title: 'Pure Veg', description: '100% Vegetarian and Sattvic food' }
                        ]
                    },
                    sortOrder: 2
                },
                {
                    type: 'cta',
                    content: {
                        title: 'Ready to Order?',
                        description: 'Browse our menu and get started',
                        buttonText: 'View Menu',
                        link: '/menu'
                    },
                    sortOrder: 3
                }
            ]
        },
        {
            slug: 'about',
            title: 'About Us',
            isSystem: false,
            sections: [
                { type: 'content', content: { title: 'Our Story', body: 'Govindam Food Court was established with a vision to provide authentic vegetarian cuisine...' }, sortOrder: 1 }
            ]
        },
        {
            slug: 'contact',
            title: 'Contact Us',
            isSystem: false,
            sections: [
                { type: 'info', content: { email: 'info@govindam.com', phone: '+91 1234567890', address: 'Main Market, Vrindavan' }, sortOrder: 1 }
            ]
        }
    ];

    for (const p of pages) {
        // Clean up existing page to avoid dup sections on re-seed
        const existing = await prisma.page.findUnique({ where: { slug: p.slug } });
        if (existing) {
            await prisma.pageSection.deleteMany({ where: { pageId: existing.id } });
            await prisma.page.delete({ where: { id: existing.id } });
        }

        const page = await prisma.page.create({
            data: {
                slug: p.slug,
                title: p.title,
                isSystem: p.isSystem,
            }
        });

        for (const s of p.sections) {
            await prisma.pageSection.create({
                data: {
                    pageId: page.id,
                    type: s.type,
                    content: s.content,
                    sortOrder: s.sortOrder
                }
            });
        }
    }
    console.log('Seeded pages');
}

seedPages()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
