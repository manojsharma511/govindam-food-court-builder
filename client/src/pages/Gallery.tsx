import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3',
    alt: 'Grand Lobby',
    category: 'ambiance',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
    alt: 'Paneer Tikka',
    category: 'food',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    alt: 'Indian Breads',
    category: 'food',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    alt: 'Chef at Work',
    category: 'team',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    alt: 'Biryani',
    category: 'food',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3',
    alt: 'Rooftop Pool',
    category: 'ambiance',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800',
    alt: 'Paneer Butter Masala',
    category: 'food',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3',
    alt: 'Luxury Spa',
    category: 'ambiance',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800',
    alt: 'Chef Preparing',
    category: 'team',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
    alt: 'Butter Chicken',
    category: 'food',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3',
    alt: 'Premium Suite',
    category: 'ambiance',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    alt: 'Special Event',
    category: 'events',
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'ambiance', label: 'Ambiance' },
  { id: 'team', label: 'Our Team' },
  { id: 'events', label: 'Events' },
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === 'all' || img.category === selectedCategory
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Visual Journey
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              <span className="text-foreground">Our</span>{' '}
              <span className="text-gradient-gold">Gallery</span>
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg">
              Take a visual tour through our restaurant, discover our signature dishes,
              and get a glimpse of the magic that happens in our kitchen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-card border-b border-border sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center w-full">
            <div className="flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide max-w-full items-center">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-transparent whitespace-nowrap",
                      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card border-border/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGalleryFilter"
                        className="absolute inset-0 bg-gradient-gold rounded-full shadow-gold"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-foreground font-medium">{image.alt}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-card object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default GalleryPage;
