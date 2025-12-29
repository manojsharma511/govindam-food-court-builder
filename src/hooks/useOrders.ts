import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/store/cartStore';

// Type definition matching Prisma Backend response
export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem?: {
    name: string;
    image?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export const useUserOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Use the Express API instead of Supabase direct call
      const { data } = await api.get('/orders/my-orders');
      return data as Order[];
    },
    enabled: !!user,
    // Poll every 5 seconds to get real-time status updates
    refetchInterval: 5000,
  });
};

export const useCreateOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      totalAmount,
    }: {
      items: CartItem[];
      totalAmount: number;
    }) => {
      if (!user) throw new Error('Must be logged in to place an order');

      // Post to Express API
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
};
