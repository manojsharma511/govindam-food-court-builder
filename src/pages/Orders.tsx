import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useUserOrders, Order } from '@/hooks/useOrders';
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Confirmed' },
  preparing: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Ready' },
  delivered: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

const OrderCard = ({ order }: { order: Order }) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Order ID</p>
          <p className="text-sm font-mono text-foreground">{order.id.slice(0, 8)}...</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm text-foreground">{item.item_name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-primary">₹{item.total_price}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(order.created_at), 'MMM dd, yyyy • hh:mm a')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-heading font-bold text-primary">₹{order.total_amount}</p>
        </div>
      </div>
    </motion.div>
  );
};

const OrdersPage = () => {
  const { data: orders, isLoading, error } = useUserOrders();

  return (
    <Layout>
      <section className="py-32 min-h-screen bg-gradient-hero pattern-overlay">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Order History</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Your <span className="text-gradient-gold">Orders</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track your current orders and view your order history
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Failed to load orders. Please try again.</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  No orders yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring our delicious menu and place your first order!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrdersPage;
