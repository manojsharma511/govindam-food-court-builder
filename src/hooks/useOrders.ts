import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/store/cartStore';
import { orderSchema, formatValidationErrors } from '@/lib/validations';

export interface Order {
  id: string;
  user_id: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  special_instructions: string | null;
  delivery_address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const useUserOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      totalAmount,
      specialInstructions,
      deliveryAddress,
      phone,
    }: {
      items: CartItem[];
      totalAmount: number;
      specialInstructions?: string;
      deliveryAddress?: string;
      phone?: string;
    }) => {
      if (!user) throw new Error('Must be logged in to place an order');

      // Validate input data
      const validationResult = orderSchema.safeParse({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        specialInstructions: specialInstructions || '',
        deliveryAddress: deliveryAddress || '',
        phone: phone || '',
      });

      if (!validationResult.success) {
        throw new Error(formatValidationErrors(validationResult.error));
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          special_instructions: specialInstructions || null,
          delivery_address: deliveryAddress || null,
          phone: phone || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
};
