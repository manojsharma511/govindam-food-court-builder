import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, User, CheckCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking, BookingType } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    occasion: '',
    specialRequests: '',
  });

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  ];

  // Convert 12-hour time to 24-hour format for database
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to make a booking.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      // Determine booking type based on time
      const hour = parseInt(formData.time.split(':')[0]);
      const isPM = formData.time.includes('PM');
      const actualHour = isPM && hour !== 12 ? hour + 12 : hour;
      const bookingType: BookingType = actualHour < 15 ? 'lunch' : 'dinner';

      await createBooking.mutateAsync({
        bookingType,
        bookingDate: formData.date,
        bookingTime: convertTo24Hour(formData.time),
        guestCount: formData.guests === '10+' ? 10 : parseInt(formData.guests),
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        specialRequests: formData.occasion 
          ? `Occasion: ${formData.occasion}. ${formData.specialRequests}` 
          : formData.specialRequests,
      });

      setStep(3);
      toast({
        title: 'Booking Confirmed!',
        description: 'We\'ve sent a confirmation to your email.',
      });
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Reserve Your Spot
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              <span className="text-foreground">Book a</span>{' '}
              <span className="text-gradient-gold">Table</span>
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg">
              Reserve your table for an unforgettable dining experience. 
              Perfect for family gatherings, romantic dinners, or celebrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step >= s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-20 h-1 mx-2 transition-colors ${
                        step > s ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-card"
            >
              {step === 1 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-heading font-bold text-center">
                    Select Date & Time
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        Number of Guests
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                        <option value="10+">More than 10</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                            formData.time === time
                              ? 'bg-primary text-primary-foreground shadow-gold'
                              : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={!formData.date || !formData.time}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold text-center">
                    Your Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <User className="w-4 h-4 text-primary" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Occasion (Optional)
                      </label>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select occasion</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="business">Business Meal</option>
                        <option value="date">Date Night</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Any dietary requirements or special requests?"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="flex-1"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-foreground">
                    Booking Confirmed!
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for your reservation. We've sent a confirmation email to{' '}
                    <span className="text-primary">{formData.email}</span>.
                  </p>

                  <div className="bg-muted rounded-xl p-6 max-w-sm mx-auto space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground font-medium">{formData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests:</span>
                      <span className="text-foreground font-medium">{formData.guests}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        date: '',
                        time: '',
                        guests: '2',
                        name: '',
                        email: '',
                        phone: '',
                        occasion: '',
                        specialRequests: '',
                      });
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Make Another Reservation
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
