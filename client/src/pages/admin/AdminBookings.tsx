import { useState, useEffect } from 'react';
import { Loader2, Calendar, Users, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface Booking {
  id: string;
  userId: string | null;
  date: string;
  time: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
  createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
  occasion?: string;
  user: {
    name: string | null;
    email: string;
  } | null;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      toast({ title: "Status Updated", description: `Booking status changed to ${newStatus}` });
      fetchBookings();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Booking Management</h2>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Occasion / Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.name || booking.user?.name || 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">{booking.email || booking.user?.email}</div>
                    {booking.phone && <div className="text-xs text-muted-foreground">{booking.phone}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.occasion && (
                      <div className="text-sm font-semibold text-primary mb-1">
                        {booking.occasion}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {booking.guests} People
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={booking.status}
                        onValueChange={(val) => updateStatus(booking.id, val)}
                      >
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
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
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>Full details for this booking.</DialogDescription>
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
                                <p className="text-xs font-medium text-muted-foreground">Guest Name</p>
                                <p className="text-sm">{booking.name || booking.user?.name || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Occasion</p>
                                <p className="text-sm font-semibold text-primary">{booking.occasion || 'General'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Contact</p>
                                <p className="text-sm">{booking.email || 'N/A'}</p>
                                <p className="text-sm">{booking.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Date & Time</p>
                                <p className="text-sm">{format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.time}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Party Size</p>
                                <p className="text-sm">{booking.guests} Guests</p>
                              </div>
                            </div>
                            {booking.specialRequests && (
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Special Requests</p>
                                <p className="text-sm">{booking.specialRequests}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-muted-foreground">Created on {format(new Date(booking.createdAt), 'PPpp')}</p>
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

export default AdminBookings;
