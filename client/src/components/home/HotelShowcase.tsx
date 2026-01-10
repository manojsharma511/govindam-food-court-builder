
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SHOWCASE_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3",
        title: "Grand Lobby",
        category: "Architecture"
    },
    {
        src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3",
        title: "Luxury Spa",
        category: "Wellness"
    },
    {
        src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3",
        title: "Executive Conference",
        category: "Business"
    },
    {
        src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3",
        title: "State-of-the-art Gym",
        category: "Fitness"
    },
    {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
        title: "Rooftop Pool",
        category: "Leisure"
    },
    {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3",
        title: "Premium Suites",
        category: "Accommodation"
    }
];

export const HotelShowcase = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6"
                >
                    <div>
                        <span className="text-primary text-sm font-medium uppercase tracking-widest">Discover Our World</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2 text-white">
                            Experience the <span className="text-primary">Ambiance</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="rounded-full border-white/20 hover:bg-white/10 hover:text-white"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>

            <div className="pl-4 md:pl-0">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6 md:gap-8 cursor-grab active:cursor-grabbing pb-12 pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2+1rem))]">
                        {SHOWCASE_IMAGES.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_35%] relative group aspect-[4/3] overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="text-primary text-sm font-medium uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {image.category}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{image.title}</h3>
                                    <div className="w-12 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>

                                <button className="absolute top-4 right-4 p-3 bg-black/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50">
                                    <Expand className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
