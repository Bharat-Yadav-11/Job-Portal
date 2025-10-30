"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import HomepageButtonControls from "@/components/homepage-button-controls";
import { motion } from "framer-motion";

const featuredCompanies = [
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Netflix", logo: "https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg" },
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
];

const latestJobs = [
    { title: "Software Engineer Intern", company: "Google", location: "Mountain View, CA", type: "Internship", logo: "https://www.vectorlogo.zone/logos/google/google-icon.svg" },
    { title: "Product Manager", company: "Microsoft", location: "Redmond, WA", type: "Full-time", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg" },
    { title: "Data Analyst", company: "Netflix", location: "Los Gatos, CA", type: "Full-time", logo: "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg" },
    { title: "UX/UI Designer", company: "Amazon", location: "Seattle, WA", type: "Contract", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg" },
];

const testimonials = [
    { quote: "HireHub made my job search incredibly easy. I found my dream job within a week.", name: "Sarah Lawson", title: "Senior Software Engineer", image: "https://randomuser.me/api/portraits/women/12.jpg" },
    { quote: "As a recruiter, finding the right talent is crucial. HireHub's platform allowed us to connect with qualified candidates quickly.", name: "Michael Chen", title: "HR Manager at TechSolutions", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { quote: "After creating my profile on HireHub, I started receiving interview requests from great companies. I highly recommend it.", name: "Jessica Patel", title: "UX/UI Designer", image: "https://randomuser.me/api/portraits/women/45.jpg" },
    { quote: "The user interface is clean and the 'Quick Apply' feature is fantastic. My go-to platform for job hunting.", name: "David Rodriguez", title: "Marketing Specialist", image: "https://randomuser.me/api/portraits/men/51.jpg" },
    { quote: "We filled a critical senior developer role in just two weeks using HireHub. The quality of applicants was significantly better.", name: "Emily Roberts", title: "Talent Acquisition Lead", image: "https://randomuser.me/api/portraits/women/68.jpg" },
];

// --- SVG ICONS  ---
const SearchIcon = () => <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const UserGroupIcon = () => <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SparklesIcon = () => <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-2.293-2.293a1 1 0 010-1.414L10 8l4-4z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ApplyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const QuoteIcon = () => (
    <svg className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M9.333 22.667c0 2.946-2.387 5.333-5.333 5.333S-1.333 25.613-1.333 22.667c0-2.946 2.387-5.333 5.333-5.333 1.28 0 2.467.453 3.387 1.2v-4.186c-1.333-.48-2.32-1.68-2.32-3.147 0-1.84 1.493-3.333 3.333-3.333s3.333 1.493 3.333 3.333c0 2.946-2.387 5.333-5.333 5.333a5.283 5.283 0 0 1-1.067-.12V22.667zM25.333 22.667c0 2.946-2.387 5.333-5.333 5.333s-5.333-2.387-5.333-5.333c0-2.946 2.387-5.333 5.333-5.333 1.28 0 2.467.453 3.387 1.2v-4.186c-1.333-.48-2.32-1.68-2.32-3.147 0-1.84 1.493-3.333 3.333-3.333s3.333 1.493 3.333 3.333c0 2.946-2.387 5.333-5.333 5.333a5.283 5.283 0 0 1-1.067-.12V22.667z" /></svg>
);
const LeftArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const RightArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

export default function HomePageClient({ user, profileInfo }) {
    
    const HowItWorks = () => {
        const [activeTab, setActiveTab] = useState('students');

        const studentSteps = [
            { icon: <ProfileIcon />, title: "Create Your Profile", description: "Build a standout profile that showcases your skills, projects, and ambitions to catch the eye of top recruiters." },
            { icon: <SearchIcon />, title: "Discover Opportunities", description: "Use our powerful, intuitive search filters to find internships and full-time jobs that perfectly match your career goals." },
            { icon: <ApplyIcon />, title: "Apply & Get Hired", description: "Apply to your dream jobs with a single click and connect directly with hiring managers and recruiters." },
        ];
        const recruiterSteps = [
            { icon: <BriefcaseIcon />, title: "Post a Job", description: "Easily create and publish detailed job listings to our vast network of talented students and recent graduates." },
            { icon: <SearchIcon />, title: "Source Top Talent", description: "Search our curated database of skilled candidates and use filters to find the perfect fit for your team." },
            { icon: <ApplyIcon />, title: "Hire Professionals", description: "Manage applicants through a streamlined dashboard, conduct interviews, and hire your next great team member." },
        ];

        return (
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">How HireHub Works</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">A straightforward path for everyone involved.</p>
                </div>
                <div className="max-w-2xl mx-auto mb-8 p-1.5 flex bg-gray-200 dark:bg-gray-800 rounded-full">
                    <button onClick={() => setActiveTab('students')} className={`w-1/2 py-2.5 px-4 rounded-full transition-colors duration-300 ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>For Students</button>
                    <button onClick={() => setActiveTab('recruiters')} className={`w-1/2 py-2.5 px-4 rounded-full transition-colors duration-300 ${activeTab === 'recruiters' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>For Recruiters</button>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                    {(activeTab === 'students' ? studentSteps : recruiterSteps).map((step, index) => (
                        <div key={index} className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    function TestimonialCarousel({ testimonials }) {
        const [currentIndex, setCurrentIndex] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const intervalTime = 2500;

        const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

        useEffect(() => {
            if (!isPaused) {
                const timer = setInterval(handleNext, intervalTime);
                return () => clearInterval(timer);
            }
        }, [currentIndex, isPaused]);

        return (
            <div
                className="relative w-full max-w-5xl mx-auto mt-16 h-[26rem] flex items-center justify-center group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* --- The Carousel Container with Perspective for 3D effect --- */}
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                    {testimonials.map((testimonial, index) => {
                        const offset = index - currentIndex;

                        const getStyle = (offset) => {
                            if (offset === 0) return { opacity: 1, transform: 'translateX(0%) scale(1)', zIndex: 3 };
                            if (offset === 1) return { opacity: 0.7, transform: 'translateX(60%) scale(0.8)', zIndex: 2 };
                            if (offset === -1) return { opacity: 0, transform: 'translateX(-60%) scale(0.8)', zIndex: 2 };
                            if (offset === 2) return { opacity: 0, transform: 'translateX(120%) scale(0.6)', zIndex: 1 };
                            return { opacity: 0, transform: 'translateX(-120%) scale(0.6)', zIndex: 1 };
                        };

                        return (
                            <motion.div
                                key={index}
                                className="absolute top-0 left-0 w-full h-full p-4"
                                initial={false}
                                animate={getStyle(offset)}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            >
                                <div className="w-full h-full max-w-2xl mx-auto rounded-2xl p-8 flex flex-col justify-between bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                                    <QuoteIcon />
                                    <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed text-left">
                                        {testimonial.quote}
                                    </p>
                                    <div className="mt-4 flex items-center self-start">
                                        <img className="h-12 w-12 rounded-full shadow-lg" alt={testimonial.name} src={testimonial.image} />
                                        <div className="ml-4 text-left">
                                            <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.title}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* --- Manual Navigation Arrows --- */}
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110"
                >
                    <LeftArrowIcon />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110"
                >
                    <RightArrowIcon />
                </button>

                {/* --- Dots Navigation --- */}
                <div className="absolute -bottom-8 flex justify-center gap-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-4 bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            {/* === HERO SECTION === */}
            <section className="relative w-full h-screen flex items-center">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 flex flex-col justify-center">
                            <span className="flex items-center space-x-2">
                                <span className="block w-14 mb-2 border-b-2 border-indigo-500"></span>
                                <span className="font-semibold text-indigo-500 dark:text-indigo-400 tracking-wide">
                                    One Stop Solution to Find Jobs
                                </span>
                            </span>
                            <h1 className="text-4xl md:text-6xl dark:text-white mt-5 text-black font-extrabold leading-tight">
                                Build your best job community starting from here.
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                                A comprehensive web dashboard aimed at bridging the gap between students, companies, and the placement department.
                            </p>
                            <div className="w-full mt-8 flex items-center text-white justify-start gap-2">
                                <HomepageButtonControls
                                    user={user}
                                    profileInfo={profileInfo}
                                />
                            </div>
                        </div>
                        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
                            <img
                                src="https://utfs.io/f/4c9f7186-8ad0-4680-aece-a5abea608705-k6t10e.png"
                                alt="Hero"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* === FEATURED COMPANIES SECTION === */}
            <section className="w-full text-center py-16 bg-white dark:bg-black">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-10">
                        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            Trusted by Industry Leaders
                        </p>
                        <h2 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            500+ Top Companies are Hiring on HireHub
                        </h2>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden mt-10">
                    <div
                        className="scroller group"
                        style={{
                            "--duration": "40s",
                            mask: "linear-gradient(90deg, transparent, white 20%, white 80%, transparent)"
                        }}
                    >
                        <div className="flex min-w-full shrink-0 gap-20 py-4 w-max flex-nowrap animate-scroll group-hover:[animation-play-state:paused]">
                            {featuredCompanies.concat(featuredCompanies).map((company, index) => (
                                <div key={index} className="flex items-center justify-center">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="h-12 object-contain 
                                opacity-40 dark:opacity-50 
                                transition-all duration-500 
                                hover:opacity-100 dark:hover:opacity-100 
                                dark:grayscale dark:invert"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* === WHY CHOOSE US SECTION === */}
            <section className="py-20 mb-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">The Ultimate Toolkit for Your Career</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">We've streamlined the job search and hiring process.</p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 mx-auto"><SearchIcon /></div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Intelligent Search</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Quickly find relevant job opportunities with our powerful and intuitive search filters.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 mx-auto"><UserGroupIcon /></div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Direct-to-Recruiter Access</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Connect directly with recruiters from top companies and build your professional network.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 mx-auto"><SparklesIcon /></div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Seamless Applications</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Apply to jobs in just a few clicks with your saved profile and resume. It's that simple.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS SECTION === */}
            <section className="py-20 mb-20 bg-white dark:bg-black"><HowItWorks /></section>

            {/* === LATEST JOBS (NEW DESIGN) SECTION === */}
            <section className="w-full py-24 mb-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Latest Job Openings
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Your next career move is just a click away. Explore fresh opportunities from our partner companies.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {latestJobs.map((job, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex flex-col sm:flex-row items-center justify-between">
                                        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0 text-center sm:text-left">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={job.logo}
                                                    alt={`${job.company} logo`}
                                                    className="h-14 w-14 p-1 bg-white rounded-md shadow-md"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {job.company}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center w-full sm:w-auto">
                                            <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-sm mr-6">
                                                <LocationPinIcon />
                                                {job.location}
                                            </div>
                                            <a
                                                href="#"
                                                className="w-full sm:w-auto text-center bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <a href="/jobs" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-lg">
                                View All Jobs
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* === TESTIMONIALS SECTION === */}
            <section className="w-full py-24 bg-slate-50 dark:bg-black antialiased">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                        Loved by Professionals Worldwide
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        Discover how HireHub has transformed careers and recruitment.
                    </p>
                </div>

                <TestimonialCarousel testimonials={testimonials} />
            </section>


            {/* === FINAL CTA SECTION === */}
            <section className="py-20 w-full antialiased">
                <div className="container mx-auto px-6 text-center">
                    <div className="bg-indigo-600 dark:bg-indigo-700 rounded-lg p-8 md:p-12 shadow-xl">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to Find Your Next Opportunity?</h2>
                        <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">Join thousands of students and hundreds of companies. Create your profile today and take the next step in your career journey.</p>
                        <div className="mt-8">
                            <a href="/sign-up" className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg">Get Started Now</a>
                        </div>
                    </div>
                </div>
            </section>

        </Fragment>
    );
}