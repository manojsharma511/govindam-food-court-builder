import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export interface HeroSlide {
    image: string;
    title: string;
    subtitle: string;
}

interface HeroProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    backgroundImage?: string;
    badgeText?: string;
    slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
    {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
        title: "Experience <span class='text-primary'>Luxury</span> Like Never Before",
        subtitle: "Immerse yourself in the elegance and comfort of our world-class accommodations."
    },
    {
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
        title: "Your <span class='text-primary'>Sanctuary</span> in the City",
        subtitle: "Relax in our meticulously designed rooms that blend modern amenities with timeless style."
    },
    {
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3",
        title: "Unwind by the <span class='text-primary'>Poolside</span> Paradise",
        subtitle: "Escape the ordinary and rejuvenate your senses in our breathtaking azure waters."
    },
    {
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3",
        title: "Exquisite <span class='text-primary'>Dining</span> Experiences",
        subtitle: "Savor gourmet flavors crafted by our expert chefs in an ambiance of pure sophistication."
    }
];

export const DynamicHero = ({ title: propTitle, subtitle: propSubtitle, buttonText, badgeText, slides }: HeroProps) => {
    const activeSlides = slides || DEFAULT_SLIDES;
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Carousel Background */}
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {activeSlides.map((slide, index) => (
                        <div key={index} className="relative flex-[0_0_100%] h-full w-full min-h-screen">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms]"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transform: currentIndex === index ? 'scale(1.05)' : 'scale(1)'
                                }}
                            />
                            {/* Dark Overlay with Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/90" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Content - Using AnimatePresence to rerender text on slide change */}
            <div className="container mx-auto px-4 relative z-10 pt-20">
                <div className="max-w-5xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            {/* Badge */}
                            {(badgeText || "Five Star Experience") && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8 backdrop-blur-sm">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span className="text-sm text-primary font-medium tracking-wide uppercase">{badgeText || "World Class Luxury"}</span>
                                </div>
                            )}

                            {/* Heading */}
                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight mb-8 text-white drop-shadow-xl"
                                dangerouslySetInnerHTML={{ __html: propTitle || activeSlides[currentIndex].title }}
                            />

                            {/* Subtitle */}
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
                                {propSubtitle || activeSlides[currentIndex].subtitle}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link to="/menu">
                                    <Button className="h-14 px-8 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,165,0,0.5)]">
                                        {buttonText || 'Reserve Your Stay'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="outline" className="h-14 px-8 text-lg font-medium text-white border-white/30 hover:bg-white/10 hover:text-white rounded-full backdrop-blur-sm">
                                        Explore Amenities
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/10 pt-8"
                    >
                        {[
                            { value: '500+', label: 'Luxury Rooms' },
                            { value: '5', label: 'Star Rating' },
                            { value: '24/7', label: 'Room Service' },
                            { value: '100%', label: 'Satisfaction' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group cursor-default">
                                <div className="text-3xl md:text-4xl font-heading font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 mt-2 uppercase tracking-widest text-[10px]">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button onClick={scrollPrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white hover:bg-primary/80 hover:text-black transition-all border border-white/10 backdrop-blur-sm z-20 hidden md:block group">
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button onClick={scrollNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white hover:bg-primary/80 hover:text-black transition-all border border-white/10 backdrop-blur-sm z-20 hidden md:block group">
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {activeSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-primary w-10" : "bg-white/30 hover:bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
