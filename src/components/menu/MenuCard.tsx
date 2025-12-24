import { motion } from 'framer-motion';
import { Plus, Minus, Leaf, Drumstick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, MenuItem } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-gradient-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-gold"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Veg/Non-Veg Badge */}
        <div
          className={cn(
            'absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            item.isVeg
              ? 'bg-green-500/90 text-primary-foreground'
              : 'bg-red-500/90 text-primary-foreground'
          )}
        >
          {item.isVeg ? (
            <>
              <Leaf className="w-3 h-3" />
              Veg
            </>
          ) : (
            <>
              <Drumstick className="w-3 h-3" />
              Non-Veg
            </>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-gold">
          ₹{item.price}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Add to Cart */}
        <div className="pt-2">
          {quantity === 0 ? (
            <Button
              onClick={handleAdd}
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              disabled={!item.isAvailable}
            >
              {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-lg p-1">
              <Button
                onClick={handleDecrement}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold text-foreground">{quantity}</span>
              <Button
                onClick={handleIncrement}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
