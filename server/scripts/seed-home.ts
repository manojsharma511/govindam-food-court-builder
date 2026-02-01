
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Home Page...');

    // 1. Find or Create Home Page
    const page = await prisma.page.upsert({
        where: { slug: 'home' },
        update: {},
        create: {
            title: 'Home Page',
            slug: 'home',
            isSystem: true,
            isVisible: true,
            metaTitle: 'Hotel Govindam - Authentic Food Court & Luxury Stay',
            metaDescription: 'Welcome to Hotel Govindam. Experience the best Indian cuisine and comfortable stays in Gandhinagar.',
        },
    });

    console.log(`Home Page ID: ${page.id}`);

    // 2. Clear existing sections (safe for first run/reset)
    // Comment this out if you don't want to reset user edits
    await prisma.pageSection.deleteMany({
        where: { pageId: page.id }
    });

    // 3. Create Sections

    // Hero
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'hero',
            sortOrder: 1,
            isVisible: true,
            content: {
                title: "Authentic Flavors, <br /> Unforgettable Memories",
                subtitle: "Welcome to Hotel Govindam",
                description: "Experience the finest Indian cuisine crafted with love and tradition. From our kitchen to your table, enjoy a culinary journey like no other.",
                ctaText: "Order Now",
                ctaLink: "/menu",
                secondaryCtaText: "Book a Table",
                secondaryCtaLink: "/booking",
                backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
            }
        }
    });

    // Features
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'features',
            sortOrder: 2,
            isVisible: true,
            content: {
                title: "Our Cuisine",
                subtitle: "Taste the Excellence",
                features: [
                    { title: "Authentic Taste", description: "Traditional recipes passed down through generations", icon: "Utensils" },
                    { title: "Fresh Ingredients", description: "Locally sourced, premium quality produce", icon: "Leaf" },
                    { title: "Expert Chefs", description: "Masters of Indian culinary arts", icon: "ChefHat" },
                ]
            }
        }
    });

    // About Preview
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'about',
            sortOrder: 3,
            isVisible: true,
            content: {
                title: "A Legacy of Good Food",
                subtitle: "About Us",
                description: "Since 1995, we have been serving happiness on a plate. Come join our family...",
                image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500"
            }
        }
    });

    // Testimonials (Rating People)
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'testimonials',
            sortOrder: 4,
            isVisible: true,
            content: {
                title: "What Our <span class='text-gradient-gold'>Guests Say</span>",
                subtitle: "Testimonials",
                testimonials: [
                    {
                        id: 1,
                        name: 'Priya Sharma',
                        role: 'Food Blogger',
                        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                        rating: 5,
                        text: 'The best Indian food I\'ve ever had! The butter chicken here is absolutely divine. The ambiance is perfect for family dinners and special occasions.',
                    },
                    {
                        id: 2,
                        name: 'Rajesh Patel',
                        role: 'Regular Customer',
                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                        rating: 5,
                        text: 'Been coming here for 10 years. The consistency in quality and taste is remarkable. Their biryani is simply the best in town!',
                    }
                ]
            }
        }
    });

    // CTA
    await prisma.pageSection.create({
        data: {
            pageId: page.id,
            type: 'cta',
            sortOrder: 5,
            isVisible: true,
            content: {
                title: "Ready to Experience the Best?",
                subtitle: "Join Us Today",
                buttonText: "Book Your Table",
                buttonLink: "/booking"
            }
        }
    });

    console.log('Home Page Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
