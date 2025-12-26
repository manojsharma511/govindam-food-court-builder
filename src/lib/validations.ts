import { z } from 'zod';

// Booking validation schema
export const bookingSchema = z.object({
  bookingType: z.enum(['table', 'lunch', 'dinner', 'event'], {
    errorMap: () => ({ message: 'Please select a valid booking type' }),
  }),
  bookingDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return date >= today && date <= maxDate;
    },
    { message: 'Date must be today or within the next year' }
  ),
  bookingTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
    'Invalid time format'
  ),
  guestCount: z.number().min(1, 'At least 1 guest required').max(50, 'Maximum 50 guests allowed'),
  guestName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  guestEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  guestPhone: z.string().regex(
    /^\+?[0-9\s\-()]{10,20}$/,
    'Invalid phone number format'
  ),
  specialRequests: z.string().max(500, 'Special requests too long').optional().or(z.literal('')),
});

export type BookingInput = z.infer<typeof bookingSchema>;

// Order validation schema
export const orderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('Invalid item ID'),
      name: z.string().min(1, 'Item name required'),
      price: z.number().positive('Price must be positive'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Maximum 99 items'),
    })
  ).min(1, 'At least one item required'),
  totalAmount: z.number().positive('Total must be positive'),
  specialInstructions: z.string().max(500, 'Instructions too long').optional().or(z.literal('')),
  deliveryAddress: z.string().max(300, 'Address too long').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

export type OrderInput = z.infer<typeof orderSchema>;

// Contact message validation schema
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,20}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  subject: z.string().max(100, 'Subject too long').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// Helper function to get user-friendly validation errors
export const formatValidationErrors = (error: z.ZodError): string => {
  return error.errors.map((e) => e.message).join(', ');
};
