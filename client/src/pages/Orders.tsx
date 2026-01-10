import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useUserOrders, Order } from '@/hooks/useOrders';
import { format } from 'date-fns';

const statusConfig: Record<string, { icon: any, color: string, bg: string, label: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
  PREPARING: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Preparing' },
  READY: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Ready' },
  COMPLETED: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10', label: 'Completed' },
  CANCELLED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OrderCard = ({ order }: { order: Order }) => {
  const status = statusConfig[order.status] || statusConfig.PENDING;
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
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm text-foreground">{item.menuItem?.name || 'Unknown Item'}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-primary">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
          </p>
          <p className="text-lg font-heading font-bold text-primary mt-1">₹{order.totalAmount}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Summary</DialogTitle>
              <DialogDescription>
                Order #{order.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={`${status.bg} ${status.color} border-0`}>{status.label}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-primary flex items-center justify-end">
                    <IndianRupee className="w-4 h-4" />
                    {order.totalAmount}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Items Ordered</h4>
                <div className="border rounded-md divide-y">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{item.quantity}x</span>
                        <span>{item.menuItem?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-3 h-3 text-muted-foreground" />
                        {item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Order Date</p>
                  <p>{format(new Date(order.createdAt), 'PPpp')}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
