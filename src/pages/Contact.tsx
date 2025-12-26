import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { contactMessageSchema, formatValidationErrors } from '@/lib/validations';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: '123 Food Street, Sector 15, Gandhinagar, Gujarat 382015',
  },
  {
    icon: Phone,
    title: 'Phone',
    content: '+91 98765 43210',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@hotelgovindam.com',
  },
  {
    icon: Clock,
    title: 'Hours',
    content: 'Mon - Sun: 11:00 AM - 11:00 PM',
  },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sendMessageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validate input data
      const validationResult = contactMessageSchema.safeParse(data);

      if (!validationResult.success) {
        throw new Error(formatValidationErrors(validationResult.error));
      }

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject || null,
          message: data.message,
        });

      if (error) throw error;
    },
  });

  const validateField = (name: string, value: string) => {
    const partialData = { ...formData, [name]: value };
    const result = contactMessageSchema.safeParse(partialData);
    
    if (!result.success) {
      const fieldError = result.error.errors.find((e) => e.path[0] === name);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const validationResult = contactMessageSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await sendMessageMutation.mutateAsync(formData);
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you shortly.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      toast({
        title: 'Failed to Send',
        description: error instanceof Error ? error.message : 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
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
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              <span className="text-foreground">Contact</span>{' '}
              <span className="text-gradient-gold">Us</span>
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg">
              Have questions or want to make a reservation? We'd love to hear from you. 
              Reach out and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold mb-8">
                <span className="text-foreground">Send us a</span>{' '}
                <span className="text-gradient-gold">Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${
                        errors.name ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${
                        errors.email ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${
                        errors.phone ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-muted border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors ${
                        errors.subject ? 'border-destructive' : 'border-border'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="reservation">Table Reservation</option>
                      <option value="catering">Catering Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-destructive text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none ${
                      errors.message ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full md:w-auto gap-2"
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-heading font-bold">
                <span className="text-foreground">Contact</span>{' '}
                <span className="text-gradient-gold">Information</span>
              </h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground mt-1">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="rounded-xl overflow-hidden border border-border h-64 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">Gandhinagar, Gujarat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
