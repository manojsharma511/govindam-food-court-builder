import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { bookingSchema, formatValidationErrors } from '@/lib/validations';

export type BookingType = 'table' | 'lunch' | 'dinner' | 'event';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  userId: string | null;
  status: BookingStatus;
  date: string;
  time: string;
  guests: number;
  name?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
  createdAt: string;
}

export const useUserBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get('/bookings/my-bookings');
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

      // Validate input data
      const validationResult = bookingSchema.safeParse({
        bookingType,
        bookingDate,
        bookingTime,
        guestCount,
        guestName,
        guestEmail: guestEmail || '',
        guestPhone,
        specialRequests: specialRequests || '',
      });

      if (!validationResult.success) {
        throw new Error(formatValidationErrors(validationResult.error));
      }

      const { data } = await api.post('/bookings', {
        bookingType,
        bookingDate,
        bookingTime,
        guestCount,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    },
  });
};
