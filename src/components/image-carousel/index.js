"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LeftArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const RightArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;


export default function ImageCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalTime = 3000;

    const shouldAnimate = images.length > 1;

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        if (!isPaused && shouldAnimate) {
            const timer = setInterval(handleNext, intervalTime);
            return () => clearInterval(timer);
        }
    }, [currentIndex, isPaused, shouldAnimate]);

    return (
        <div
            className="relative w-full max-w-5xl mx-auto h-[28rem] flex items-center justify-center group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                {images.map((item, index) => {
                    const offset = index - currentIndex;

                    const getStyle = (offset) => {
                        if (!shouldAnimate) return { opacity: 1, transform: 'translateX(0%) scale(1)', zIndex: 3 };

                        if (offset === 0) return { opacity: 1, transform: 'translateX(0%) scale(1)', zIndex: 3 };
                        if (offset === 1) return { opacity: 0.7, transform: 'translateX(60%) scale(0.8)', zIndex: 2 };
                        if (offset === -1) return { opacity: 0, transform: 'translateX(-60%) scale(0.8)', zIndex: 2 };

                        return { opacity: 0, transform: `translateX(${offset > 0 ? 120 : -120}%) scale(0.6)`, zIndex: 1 };
                    };

                    return (
                        <motion.div
                            key={index}
                            className="absolute top-0 left-0 w-full h-full p-4"
                            initial={false}
                            animate={getStyle(offset)}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        >
                            {/* THE NEW CARD STYLING */}
                            <div className="w-full h-full max-w-2xl mx-auto rounded-2xl p-4 flex items-center justify-center bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                                <img src={item.image} alt={`Post image ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {shouldAnimate && (
                <>
                    <button onClick={handlePrev} className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110 z-20">
                        <LeftArrowIcon />
                    </button>
                    <button onClick={handleNext} className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110 z-20">
                        <RightArrowIcon />
                    </button>

                    <div className="absolute -bottom-8 flex justify-center gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-4 bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}