import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  link?: string;
  phone?: string;
  lunchTime?: string;
  dinnerTime?: string;
}

export const CTASection = ({
  title = "Ready for a <span class='text-gradient-gold'>Culinary Journey?</span>",
  subtitle = "Book Your Experience",
  description = "Reserve your table today and immerse yourself in an unforgettable dining experience. Perfect for family gatherings, romantic dinners, or corporate events.",
  buttonText = "Reserve a Table",
  link = "/booking",
  phone = "+91 98765 43210",
  lunchTime = "11:00 AM - 3:00 PM",
  dinnerTime = "7:00 PM - 11:00 PM"
}: CTAProps) => {
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
            {subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6" dangerouslySetInnerHTML={{ __html: title }} />
          <div className="ornament-line-long mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={link}>
              <Button variant="hero" size="xl" className="gap-3">
                <Calendar className="w-5 h-5" />
                {buttonText}
              </Button>
            </Link>
            <a href={`tel:${phone.replace(/\s+/g, '').replace('+', '')}`}>
              <Button variant="heroOutline" size="xl" className="gap-3">
                <Phone className="w-5 h-5" />
                {phone}
              </Button>
            </a>
          </div>

          {/* Opening Hours */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground text-sm mb-4">Opening Hours</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div>
                <span className="text-primary font-semibold">Lunch:</span>
                <span className="text-foreground ml-2">{lunchTime}</span>
              </div>
              <div>
                <span className="text-primary font-semibold">Dinner:</span>
                <span className="text-foreground ml-2">{dinnerTime}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
