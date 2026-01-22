import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { toast } = useToast();
  const { user } = useAuth(); // Import useAuth
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to place an order", variant: "destructive" });
      navigate('/login');
      return;
    }

    try {
      await api.post('/orders', {
        items: items,
        totalAmount: getTotalPrice()
      });
      toast({
        title: 'Order Placed!',
        description: 'Your order has been successfully placed. You will receive a confirmation shortly.',
      });
      clearCart();
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" });
    }
  };

  const deliveryFee = items.length > 0 ? 50 : 0;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  return (
    <Layout>
      <section className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/menu" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-heading font-bold">
              <span className="text-foreground">Your</span>{' '}
              <span className="text-gradient-gold">Cart</span>
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/menu">
                <Button variant="hero" size="lg">
                  Browse Menu
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl p-4 border border-border flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-heading font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.isVeg ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-lg font-semibold text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-6 border border-border sticky top-32"
                >
                  <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{total}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By placing this order, you agree to our terms and conditions.
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
