import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MenuCard } from '@/components/menu/MenuCard';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  items: any[];
}

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Since API might not be running yet, we handle error gracefully or rely on fallback if needed
        // But for production build we assume API works.
        const { data } = await api.get('/menu');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        toast({
          title: "Error",
          description: "Failed to load menu from server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [toast]);

  // Flatten items for display
  const allItems: MenuItem[] = categories.flatMap(cat =>
    cat.items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price), // ensure number
      image: item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      category: cat.id,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable
    }))
  );

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = vegFilter === 'all' ||
      (vegFilter === 'veg' && item.isVeg) ||
      (vegFilter === 'non-veg' && !item.isVeg);

    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Explore Our
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              <span className="text-foreground">Delicious</span>{' '}
              <span className="text-gradient-gold">Menu</span>
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg">
              From appetizing starters to delectable desserts, discover the authentic flavors
              of India crafted with love and tradition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-card border-b border-border sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Veg Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'veg', label: '🥬 Veg' },
                  { value: 'non-veg', label: '🍗 Non-Veg' },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={vegFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVegFilter(filter.value as typeof vegFilter)}
                    className={`transition-all duration-300 ${vegFilter === filter.value ? 'shadow-gold text-primary-foreground font-bold' : 'hover:border-primary text-foreground bg-transparent border-border'}`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex justify-center w-full">
            <div className="flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide max-w-full items-center">
              {[
                { id: 'all', name: 'All Items', icon: '🍽️' },
                ...categories
              ].map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border border-transparent whitespace-nowrap",
                      isActive ? "text-primary-foreground font-bold" : "text-white/70 hover:text-white bg-white/5 hover:bg-white/10 hover:border-primary/30"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-gold rounded-full shadow-gold"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">No dishes found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;
