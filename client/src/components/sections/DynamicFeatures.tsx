import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuCard } from '@/components/menu/MenuCard';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface FeaturesProps {
    title?: string;
    subtitle?: string;
    items?: any[];
}

export const DynamicFeatures = ({
    title = "Our Best Dishes",
    subtitle = "Our Specialties",
    items
}: FeaturesProps) => {
    const [fetchedItems, setFetchedItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItems = async () => {
            // If items are provided AND likely menu items (have price), use them.
            // Otherwise, if they look like features (no price), ignore them and fetch real menu items.
            if (items && items.length > 0 && items[0].price !== undefined) {
                setFetchedItems(items);
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/menu');
                // Data is categories with items. Flatten to get just items.
                // We'll take top items from different categories to mix it up, or just first 6.
                const allItems = data.flatMap((cat: any) => cat.items || []);
                // Filter only available items
                const availableItems = allItems
                    .filter((i: any) => i.isAvailable)
                    .map((i: any) => ({
                        ...i,
                        image: i.imageUrl || i.image, // Handle both cases
                        category: i.category?.name || 'Main'
                    }));
                // Take up to 6
                setFetchedItems(availableItems.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch menu items for home", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, [items]);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-medium uppercase tracking-widest">
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6" dangerouslySetInnerHTML={{ __html: title.includes('<') ? title : `<span class="text-gradient-gold">${title}</span>` }} />
                    <div className="ornament-line-long mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-10">
                            <Loader2 className="animate-spin w-8 h-8 text-primary" />
                        </div>
                    ) : (
                        fetchedItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <MenuCard item={item} />
                            </motion.div>
                        ))
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link to="/menu">
                        <Button variant="outline" size="lg" className="group">
                            View All
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
