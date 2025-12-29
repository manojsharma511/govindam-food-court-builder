import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Utensils, IndianRupee, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
  items: OrderItem[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  READY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Dont show toast on initial empty load to avoid spam if just empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s for faster updates
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast({ title: "Status Updated", description: `Order status changed to ${newStatus}` });
      fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Orders Management</h2>
        {pendingOrders > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {pendingOrders} Pending Order{pendingOrders !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm flex justify-between gap-4">
                          <span>{item.quantity}x {item.menuItem.name}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{order.items.length - 2} more items</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex items-center">
                      <IndianRupee className="w-3 h-3" />
                      {order.totalAmount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => updateStatus(order.id, val)}
                      >
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PREPARING">Preparing</SelectItem>
                          <SelectItem value="READY">Ready</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Order #{order.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Status</p>
                                <Badge variant="secondary" className={statusColors[order.status]}>{order.status}</Badge>
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
                              <h4 className="text-sm font-semibold mb-2">Items</h4>
                              <div className="border rounded-md divide-y">
                                {order.items.map((item) => (
                                  <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-muted-foreground">{item.quantity}x</span>
                                      <span>{item.menuItem.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <IndianRupee className="w-3 h-3 text-muted-foreground" />
                                      {item.price}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Customer</p>
                                <p className="text-sm">{order.user?.name || 'Guest'}</p>
                                <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Ordered At</p>
                                <p className="text-sm">{format(new Date(order.createdAt), 'PPpp')}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
