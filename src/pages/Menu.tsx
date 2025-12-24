import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MenuCard } from '@/components/menu/MenuCard';
import { menuItems, menuCategories } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const filteredItems = menuItems.filter((item) => {
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
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory('all')}
              className="flex-shrink-0"
            >
              All Items
            </Button>
            {menuCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0 gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredItems.length > 0 ? (
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
