import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Leaf, Drumstick, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, MenuItem } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { Tilt3D } from '@/components/ui/Tilt3D';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity === 0) {
      addItem(item);
    }
    navigate('/cart');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <Tilt3D className="h-full" intensity={10}>
      <div
        className="group relative h-full bg-card/80 backdrop-blur-md rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-card hover:shadow-gold flex flex-col"
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Gradient Overlay - Subtle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/10',
                item.isVeg
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white'
                  : 'bg-gradient-to-r from-red-600 to-rose-500 text-white'
              )}
            >
              {item.isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-gold border border-white/10 flex items-center gap-1">
              <span className="text-[10px] opacity-80">₹</span>
              {item.price}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-card/50 to-card">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-90">
              {item.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="pt-6 mt-auto space-y-3">
            {quantity === 0 ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="w-full bg-transparent border-2 border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-bold group/btn"
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Add
                    </>
                  ) : 'N/A'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-gold-dark shadow-gold hover:shadow-gold-lg font-bold group/buy"
                  disabled={!item.isAvailable}
                >
                  {item.isAvailable ? (
                    <>
                      Buy Now
                      <CreditCard className="w-4 h-4 ml-2 group-hover/buy:translate-x-1 transition-transform" />
                    </>
                  ) : 'Sold Out'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-muted/50 rounded-xl p-1.5 border border-border/50">
                  <Button
                    onClick={handleDecrement}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold text-foreground min-w-[1.5rem] text-center">{quantity}</span>
                  <Button
                    onClick={handleIncrement}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleBuyNow}
                  variant="secondary"
                  className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group/checkout"
                >
                  Checkout Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/checkout:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Tilt3D>
  );
};
