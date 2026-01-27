import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tilt3DProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    shine?: boolean;
}

export const Tilt3D = ({ children, className, intensity = 20, shine = true, ...props }: Tilt3DProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

    // Shine effect calculations based on mouse position
    const shineOpacity = useTransform(mouseX, [-0.5, 0.5], [0, 0.5]);
    const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
    const shineY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;

        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative transition-all duration-200 ease-out", className)}
            {...(props as any)}
        >
            <div style={{ transform: "translateZ(50px)" }} className="h-full w-full">
                {children}
            </div>

            {shine && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-50 rounded-inherit overflow-hidden"
                    style={{
                        opacity: useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.3, 0]),
                        background: `radial-gradient(circle at ${50 + x.get() * 100}% ${50 + y.get() * 100}%, rgba(255,255,255,0.8), transparent 50%)`,
                        mixBlendMode: 'overlay'
                    }}
                />
            )}
        </motion.div>
    );
};
