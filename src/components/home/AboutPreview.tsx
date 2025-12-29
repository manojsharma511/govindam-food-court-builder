import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Clock, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutProps {
  title?: string;
  subtitle?: string;
  description?: string;
  body?: string; // Alias for description from some seed data
  badgeText?: string;
}

const features = [
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for culinary excellence',
  },
  {
    icon: Users,
    title: 'Expert Chefs',
    description: 'Master craftsmen of Indian cuisine',
  },
  {
    icon: Clock,
    title: 'Fresh Daily',
    description: 'Prepared fresh every single day',
  },
  {
    icon: Utensils,
    title: 'Premium Quality',
    description: 'Only the finest ingredients',
  },
];

export const AboutPreview = ({
  title = "<span class='text-foreground'>A Legacy of</span><br /><span class='text-gradient-gold'>Authentic Flavors</span>",
  subtitle = "Our Story",
  description = "Since 1995, Hotel Govindam has been a beacon of authentic Indian cuisine. Our journey began with a simple mission: to share the rich tapestry of Indian flavors with food lovers everywhere.\n\nEvery dish we serve is a testament to our commitment to quality, tradition, and the art of Indian cooking.",
  body,
  badgeText = "25+"
}: AboutProps) => {
  const contentDescription = description || body || "Since 1995, Hotel Govindam has been a beacon of authentic Indian cuisine...";

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
                    alt="Restaurant interior"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
                    alt="Fine dining"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"
                    alt="Chef cooking"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"
                    alt="Indian dishes"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-gold rounded-full flex flex-col items-center justify-center shadow-gold-lg"
            >
              <span className="text-3xl font-heading font-bold text-primary-foreground">{badgeText}</span>
              <span className="text-xs text-primary-foreground/80 uppercase tracking-wider">Years</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                {subtitle}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6" dangerouslySetInnerHTML={{ __html: title }} />
              <div className="ornament-line" />
            </div>

            <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {contentDescription}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/about">
              <Button variant="outline" size="lg" className="group mt-4">
                Learn More About Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
