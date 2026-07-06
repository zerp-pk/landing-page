import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useScrollReveal, prefersReducedMotion } from '../../hooks/useScrollReveal';

interface HeroProps {
    settings?: any;
}

const HERO_VARIANTS = {
    hero1: {
        section: 'bg-white py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        title: 'text-4xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight',
        subtitle: 'text-lg md:text-xl text-gray-500 mb-8 leading-relaxed font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4',
        primaryBtn: 'text-white px-8 py-3 rounded-lg text-lg font-medium flex items-center transition-all duration-300 shadow-sm hover:shadow-md',
        secondaryBtn: 'border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-all duration-300',
        layout: 'right-split',
        showImage: true
    },
    hero2: {
        section: 'bg-white py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        title: 'text-4xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight',
        subtitle: 'text-lg md:text-xl text-gray-500 mb-8 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4 justify-center',
        primaryBtn: 'text-white px-8 py-3 rounded-lg text-lg font-medium flex items-center justify-center transition-colors shadow-sm hover:shadow-md',
        secondaryBtn: 'border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50',
        layout: 'split',
        showImage: true
    },
    hero3: {
        section: 'relative bg-neutral-950 py-32 md:py-40 overflow-hidden',
        container: 'relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10',
        title: 'text-4xl md:text-6xl lg:text-7xl font-semibold mb-8 leading-tight tracking-tight',
        subtitle: 'text-lg md:text-2xl mb-12 max-w-4xl mx-auto text-white/70 leading-relaxed font-normal',
        buttons: 'flex flex-col sm:flex-row gap-6 justify-center items-center',
        primaryBtn: 'text-white px-10 py-4 rounded-lg text-lg font-semibold flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md',
        secondaryBtn: 'border border-white/20 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300',
        layout: 'background',
        showImage: false
    },
    hero4: {
        section: 'bg-white py-24 md:py-32 border-b border-gray-100',
        container: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center',
        title: 'text-3xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight',
        subtitle: 'text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed font-normal',
        buttons: 'flex flex-col sm:flex-row gap-3 justify-center items-center',
        primaryBtn: 'text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md',
        secondaryBtn: 'text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300',
        layout: 'minimal',
        showImage: false
    }
};

export default function Hero({ settings }: HeroProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.hero || {};
    const variant = sectionData.variant || 'hero1';
    const config = HERO_VARIANTS[variant as keyof typeof HERO_VARIANTS] || HERO_VARIANTS.hero1;

    const sectionRef = useRef<HTMLElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
    useScrollReveal(sectionRef);

    // Subtle 3D tilt on the hero image, following the cursor.
    useEffect(() => {
        const section = sectionRef.current;
        const imageEl = imageWrapRef.current;
        if (!section || !imageEl || !config.showImage || prefersReducedMotion()) return;

        const setRotateX = gsap.quickTo(imageEl, 'rotateX', { duration: 0.6, ease: 'power3.out' });
        const setRotateY = gsap.quickTo(imageEl, 'rotateY', { duration: 0.6, ease: 'power3.out' });

        const handleMouseMove = (e: MouseEvent) => {
            const rect = imageEl.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setRotateY(px * 14);
            setRotateX(-py * 14);
        };
        const handleMouseLeave = () => {
            setRotateX(0);
            setRotateY(0);
        };

        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
            section.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [config.showImage]);

    // Floating gradient orbs drifting with scroll (parallax).
    useEffect(() => {
        if (prefersReducedMotion()) return;
        const triggers = orbRefs.current
            .filter((el): el is HTMLDivElement => el !== null)
            .map((el, i) => gsap.to(el, {
                y: (i + 1) * -70,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            }));
        return () => triggers.forEach((tw) => tw.scrollTrigger?.kill());
    }, []);

    const title = sectionData.title || 'Transform Your Business with Zerp';
    const subtitle = sectionData.subtitle || 'The complete all-in-one business management solution that combines ERP, Accounting, CRM, POS, HRM, and Project Management into a single powerful platform.';
    const primaryButtonText = sectionData.primary_button_text || 'Start Free Trial';
    const primaryButtonLink = sectionData.primary_button_link || route('register');
    const secondaryButtonText = sectionData.secondary_button_text || 'Request Demo';
    const secondaryButtonLink = sectionData.secondary_button_link || route('login');
    const highlightText = sectionData.highlight_text;
    const heroImage = sectionData.image;
    const colors = settings?.config_sections?.colors || { primary: '#DA8F29', secondary: '#B8741F', accent: '#f59e0b' };

    const renderTitle = () => {
        if (highlightText && title?.includes(highlightText)) {
            const titleParts = title.split(highlightText);
            return (
                <>
                    {titleParts[0]}
                    <span style={{ color: colors.primary }}>{highlightText}</span>
                    {titleParts[1]}
                </>
            );
        }
        return title;
    };

    const renderButtons = () => (
        <div className={config.buttons}>
            <button 
                className={config.primaryBtn} 
                style={{ backgroundColor: colors.primary }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                onClick={() => window.location.href = primaryButtonLink}
            >
                {primaryButtonText}
                {config.layout !== 'minimal' && <ArrowRight className="ml-3 h-6 w-6" />}
            </button>
            <button 
                className={config.secondaryBtn}
                onClick={() => window.location.href = secondaryButtonLink}
            >
                {secondaryButtonText}
            </button>
        </div>
    );

    const renderBackgroundImage = () => {
        if (config.layout !== 'background') return null;
        return (
            <>
                {heroImage && (
                    <div className="absolute inset-0">
                        <img src={getImagePath(heroImage)} alt="Hero Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
                    </div>
                )}
                {!heroImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                )}
                <div className="absolute inset-0">
                    <div ref={(el) => { orbRefs.current[0] = el; }} className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div ref={(el) => { orbRefs.current[1] = el; }} className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div ref={(el) => { orbRefs.current[2] = el; }} className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                </div>
            </>
        );
    };

    const renderFloatingOrbs = () => {
        if (config.layout === 'background') return null;
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div ref={(el) => { orbRefs.current[0] = el; }} className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-[0.07]" style={{ backgroundColor: colors.primary }}></div>
                <div ref={(el) => { orbRefs.current[1] = el; }} className="absolute bottom-0 right-10 w-56 h-56 rounded-full blur-3xl bg-gray-200 opacity-40"></div>
                <div ref={(el) => { orbRefs.current[2] = el; }} className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full blur-2xl opacity-[0.06]" style={{ backgroundColor: colors.secondary }}></div>
            </div>
        );
    };

    const renderImage = () => {
        if (!config.showImage || config.layout === 'background') return null;

        return (
            <div className="reveal-item" style={{ perspective: 1000 }}>
                <div
                    ref={imageWrapRef}
                    className={`bg-gray-100 rounded-xl ${config.layout === 'split' || config.layout === 'right-split' ? '' : 'mt-12'} flex items-center justify-center overflow-hidden shadow-[0px_2px_4px_0px_rgba(14,30,37,0.12),0px_2px_16px_0px_rgba(14,30,37,0.32)]`}
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                    {heroImage ? (
                        <img src={getImagePath(heroImage)} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500">{t('Hero Image')}</span>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => (
        <div className={config.layout === 'split' || config.layout === 'right-split' ? '' : 'w-full text-center'}>
            <h1 className={`${config.title} reveal-item`}>
                {renderTitle()}
            </h1>
            <p className={`${config.subtitle} reveal-item`}>
                {subtitle}
            </p>
            <div className="reveal-item">
                {renderButtons()}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} className={`${config.section} relative`}>
            {renderBackgroundImage()}
            {renderFloatingOrbs()}
            <div className={config.container}>
                {config.layout === 'split' || config.layout === 'right-split' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {config.layout === 'right-split' ? (
                            <>
                                {renderImage()}
                                {renderContent()}
                            </>
                        ) : (
                            <>
                                {renderContent()}
                                {renderImage()}
                            </>
                        )}
                    </div>
                ) : config.layout === 'background' ? (
                    <div className="relative">
                        {renderContent()}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/70 rounded-full animate-ping delay-700"></div>
                            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping delay-1000"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {renderContent()}
                        {renderImage()}
                    </>
                )}
            </div>
        </section>
    );
}