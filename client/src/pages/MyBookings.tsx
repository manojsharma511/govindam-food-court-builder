import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useUserBookings, Booking } from '@/hooks/useBookings';
import { format } from 'date-fns';

const statusConfig: Record<string, { icon: any, color: string, bg: string, label: string }> = {
    PENDING: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
    CONFIRMED: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Confirmed' },
    CANCELLED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
    REJECTED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
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
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

const BookingCard = ({ booking }: { booking: Booking }) => {
    const status = statusConfig[booking.status] || statusConfig.PENDING;
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 border border-border"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
                    <p className="text-sm font-mono text-foreground">{booking.id.slice(0, 8)}...</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-foreground">Date & Time</p>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.time}
                        </p>
                    </div>
                </div>
                {booking.occasion && (
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-foreground">Occasion</p>
                            <p className="text-xs text-muted-foreground font-medium text-primary">{booking.occasion}</p>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-foreground">Guests</p>
                        <p className="text-xs text-muted-foreground">{booking.guests} People</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
                <div>
                    <p className="text-xs text-muted-foreground">
                        Created: {format(new Date(booking.createdAt), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>Full details for your reservation.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Booking ID</p>
                                    <p className="text-sm font-mono">{booking.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                                    <Badge variant="outline">{booking.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Occasion</p>
                                    <p className="text-sm text-primary font-medium">{booking.occasion || 'General'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Date & Time</p>
                                    <p className="text-sm">{format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.time}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Party Size</p>
                                    <p className="text-sm">{booking.guests} Guests</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Contact Used</p>
                                    <p className="text-sm">{booking.email || 'N/A'}</p>
                                </div>
                            </div>
                            {booking.specialRequests ? (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Special Requests</p>
                                    <p className="text-sm">{booking.specialRequests}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No special requests.</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );
};

const MyBookingsPage = () => {
    const { data: bookings, isLoading, error } = useUserBookings();

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
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm text-primary font-medium">Booking History</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                                Your <span className="text-gradient-gold">Bookings</span>
                            </h1>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                View upcoming and past reservations
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
                                <p className="text-muted-foreground">Failed to load bookings. Please try again.</p>
                            </div>
                        ) : bookings && bookings.length > 0 ? (
                            <div className="space-y-6">
                                {bookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                                    No bookings yet
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Make a reservation to dine with us!
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MyBookingsPage;
