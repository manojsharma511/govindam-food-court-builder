import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type BookingType = 'table' | 'lunch' | 'dinner' | 'event';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  user_id: string | null;
  booking_type: BookingType;
  status: BookingStatus;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingType,
      bookingDate,
      bookingTime,
      guestCount,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    }: {
      bookingType: BookingType;
      bookingDate: string;
      bookingTime: string;
      guestCount: number;
      guestName: string;
      guestEmail?: string;
      guestPhone: string;
      specialRequests?: string;
    }) => {
      if (!user) throw new Error('Must be logged in to make a booking');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          booking_type: bookingType,
          booking_date: bookingDate,
          booking_time: bookingTime,
          guest_count: guestCount,
          guest_name: guestName,
          guest_email: guestEmail || null,
          guest_phone: guestPhone,
          special_requests: specialRequests || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    },
  });
};
