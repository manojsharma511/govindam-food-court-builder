import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';

interface Testimonial {
  id: string;
  customerName: string;
  customerRole: string;
  imageUrl: string;
  rating: number;
  review: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
}

const reviewSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerRole: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const TestimonialsSection = ({
  title = "What Our <span class='text-gradient-gold'>Guests Say</span>",
  subtitle = "Testimonials"
}: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: "",
      customerRole: "",
      rating: 5,
      review: ""
    }
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials');
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const next = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      await api.post('/testimonials', data);
      toast({
        title: "Review Submitted",
        description: "Thank you! Your review has been submitted for approval.",
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  // Allow rendering even if empty so users can add reviews
  // if (testimonials.length === 0) return null; 

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
                          src={testimonials[currentIndex].imageUrl || `https://ui-avatars.com/api/?name=${testimonials[currentIndex].customerName}&background=random`}
                          alt={testimonials[currentIndex].customerName}
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
                        "{testimonials[currentIndex].review}"
                      </blockquote>

                      {/* Author */}
                      <div>
                        <h4 className="font-heading font-semibold text-primary text-lg">
                          {testimonials[currentIndex].customerName}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {testimonials[currentIndex].customerRole}
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
            <div className="text-center text-muted-foreground py-10 bg-card rounded-xl border border-border">
              <p>Be the first to leave a review!</p>
            </div>
          )}

          {/* Write a Review Button */}
          <div className="flex justify-center mt-12">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-gold gap-2">
                  <PenLine className="w-4 h-4" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Share Your Experience</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" {...form.register("customerName")} placeholder="John Doe" />
                    {form.formState.errors.customerName && <p className="text-xs text-destructive">{form.formState.errors.customerName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role (Optional)</Label>
                    <Input id="role" {...form.register("customerRole")} placeholder="e.g. Tourist, Local Foodie" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input id="rating" type="number" min="1" max="5" {...form.register("rating")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea id="review" {...form.register("review")} placeholder="Tell us about your stay or dining experience..." rows={4} />
                    {form.formState.errors.review && <p className="text-xs text-destructive">{form.formState.errors.review.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Submit Review
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};
