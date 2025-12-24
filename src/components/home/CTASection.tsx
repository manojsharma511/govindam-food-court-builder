import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-card rounded-3xl p-12 md:p-16 border border-border shadow-card"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Book Your Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            <span className="text-foreground">Ready for a</span>{' '}
            <span className="text-gradient-gold">Culinary Journey?</span>
          </h2>
          <div className="ornament-line-long mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Reserve your table today and immerse yourself in an unforgettable dining experience. 
            Perfect for family gatherings, romantic dinners, or corporate events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/booking">
              <Button variant="hero" size="xl" className="gap-3">
                <Calendar className="w-5 h-5" />
                Reserve a Table
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button variant="heroOutline" size="xl" className="gap-3">
                <Phone className="w-5 h-5" />
                +91 98765 43210
              </Button>
            </a>
          </div>

          {/* Opening Hours */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground text-sm mb-4">Opening Hours</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div>
                <span className="text-primary font-semibold">Lunch:</span>
                <span className="text-foreground ml-2">11:00 AM - 3:00 PM</span>
              </div>
              <div>
                <span className="text-primary font-semibold">Dinner:</span>
                <span className="text-foreground ml-2">7:00 PM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
