
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding About Page...');

    // 1. Find or Create About Page
    const page = await prisma.page.upsert({
        where: { slug: 'about' },
        update: {},
        create: {
            title: 'About Us',
            slug: 'about',
            isSystem: true,
            isVisible: true,
            metaTitle: 'About Hotel Govindam - Our Story & Team',
            metaDescription: 'Discover the legacy of Hotel Govindam, serving authentic Indian cuisine since 1995. Meet our culinary masters and learn about our values.',
        },
    });

    console.log(`About Page ID: ${page.id}`);

    // 2. Clear existing sections to avoid duplicates/conflicts during dev
    await prisma.pageSection.deleteMany({
        where: { pageId: page.id }
    });

    // 3. Create Sections

    // Hero
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about-hero',
            sortOrder: 1,
            isVisible: true,
            content: {
                title: "A Legacy of Authentic Flavors",
                subtitle: "Our Story",
                description: "Since 1995, Hotel Govindam has been a beacon of authentic Indian cuisine, bringing the rich culinary heritage of India to food lovers everywhere.",
                backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
            }
        }
    });

    // Stats
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about-stats',
            sortOrder: 2,
            isVisible: true,
            content: {
                stats: [
                    { value: '25+', label: 'Years of Excellence', icon: 'Clock' },
                    { value: '100+', label: 'Signature Dishes', icon: 'Utensils' },
                    { value: '50K+', label: 'Happy Customers', icon: 'Users' },
                    { value: '15+', label: 'Awards Won', icon: 'Award' },
                ]
            }
        }
    });

    // Story
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about-story',
            sortOrder: 3,
            isVisible: true,
            content: {
                title: "From Humble Beginnings To Culinary Excellence",
                subtitle: "How It Started",
                paragraphs: [
                    "Our journey began in 1995 when Chef Govindam, inspired by his grandmother's recipes, opened a small eatery with just 5 tables. His vision was simple: to serve authentic Indian food that reminded people of home.",
                    "Over the years, that small eatery has grown into a beloved institution. What hasn't changed is our commitment to quality, authenticity, and the joy of sharing good food with good company.",
                    "Today, we proudly serve over 100 signature dishes, each one a testament to our dedication to preserving and celebrating India's rich culinary heritage while embracing innovation."
                ],
                images: [
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
                    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400",
                    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400"
                ]
            }
        }
    });

    // Values
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about-values',
            sortOrder: 4,
            isVisible: true,
            content: {
                title: "What Drives Us Forward",
                subtitle: "Our Values",
                values: [
                    {
                        icon: 'Heart',
                        title: 'Passion for Food',
                        description: 'Every dish is crafted with love and dedication to bring you the authentic taste of India.',
                    },
                    {
                        icon: 'ChefHat',
                        title: 'Expert Craftsmanship',
                        description: 'Our master chefs bring decades of experience and traditional knowledge to every recipe.',
                    },
                    {
                        icon: 'Target',
                        title: 'Quality First',
                        description: 'We source only the finest, freshest ingredients to ensure every meal is exceptional.',
                    },
                    {
                        icon: 'Sparkles',
                        title: 'Memorable Experience',
                        description: 'From ambiance to service, we create dining experiences that stay with you forever.',
                    },
                ]
            }
        }
    });

    // Team
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about-team',
            sortOrder: 5,
            isVisible: true,
            content: {
                title: "Our Culinary Masters",
                subtitle: "Meet The Team",
                members: [
                    {
                        name: 'Chef Ramesh Kumar',
                        role: 'Executive Chef',
                        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
                        description: '25 years of culinary expertise in traditional Indian cuisine.',
                    },
                    {
                        name: 'Priya Sharma',
                        role: 'Head Pastry Chef',
                        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
                        description: 'Specialist in Indian desserts and fusion sweets.',
                    },
                    {
                        name: 'Vikram Singh',
                        role: 'Sous Chef',
                        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
                        description: 'Expert in North Indian and Mughlai cuisine.',
                    },
                ]
            }
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
