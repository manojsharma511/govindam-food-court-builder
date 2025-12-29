import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Food Blogger',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    text: 'The best Indian food I\'ve ever had! The butter chicken here is absolutely divine. The ambiance is perfect for family dinners and special occasions.',
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    role: 'Regular Customer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    text: 'Been coming here for 10 years. The consistency in quality and taste is remarkable. Their biryani is simply the best in town!',
  },
  {
    id: 3,
    name: 'Anita Desai',
    role: 'Corporate Event Planner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    text: 'We hosted our company event here and the team went above and beyond. Amazing food, impeccable service, and beautiful presentation.',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Food Critic',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    text: 'A rare find - authentic flavors with modern presentation. The chefs clearly understand the nuances of traditional Indian cooking.',
  },
];

export const TestimonialsSection = ({
  title = "What Our <span class='text-gradient-gold'>Guests Say</span>",
  subtitle = "Testimonials",
  testimonials = defaultTestimonials
}: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 opacity-10">
        <Quote className="w-40 h-40 text-primary" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-180">
        <Quote className="w-40 h-40 text-primary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            {subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6" dangerouslySetInnerHTML={{ __html: title }} />
          <div className="ornament-line-long mx-auto" />
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          {testimonials.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-gold">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Stars */}
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                        "{testimonials[currentIndex].text}"
                      </blockquote>

                      {/* Author */}
                      <div>
                        <h4 className="font-heading font-semibold text-primary text-lg">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                          ? 'w-8 bg-primary'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">No testimonials available.</div>
          )}
        </div>
      </div>
    </section>
  );
};
