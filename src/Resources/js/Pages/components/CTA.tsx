import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface CTAProps {
    settings?: any;
}

const CTA_VARIANTS = {
    cta1: {
        section: 'bg-neutral-950 py-24 md:py-32',
        container: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center',
        title: 'text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6',
        subtitle: 'text-lg md:text-xl text-white/70 mb-8 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4 justify-center',
        layout: 'centered'
    },
    cta2: {
        section: 'bg-white py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        title: 'text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6',
        subtitle: 'text-lg md:text-xl text-gray-500 mb-8 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4',
        layout: 'split'
    },
    cta3: {
        section: 'bg-gray-50 py-24 md:py-32',
        container: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
        title: 'text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6',
        subtitle: 'text-lg text-gray-500 mb-8 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4 justify-center',
        layout: 'card'
    },
    cta4: {
        section: 'bg-neutral-950 py-24 md:py-32',
        container: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center',
        title: 'text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6',
        subtitle: 'text-lg md:text-xl text-white/70 mb-10 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-6 justify-center',
        layout: 'gradient'
    },
    cta5: {
        section: 'bg-white py-24 md:py-32 border-t border-gray-100',
        container: 'max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center',
        title: 'text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-6',
        subtitle: 'text-base md:text-lg text-gray-500 mb-8 font-normal',
        buttons: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
        layout: 'minimal'
    }
};

export default function CTA({ settings }: CTAProps) {
    const { t } = useTranslation();
    const sectionData = settings?.config_sections?.sections?.cta || {};
    const variant = sectionData.variant || 'cta1';
    const config = CTA_VARIANTS[variant as keyof typeof CTA_VARIANTS] || CTA_VARIANTS.cta1;
    
    const title = sectionData.title || 'Ready to Transform Your Business?';
    const subtitle = sectionData.subtitle || 'Join thousands of businesses already using Zerp to streamline their operations.';
    const primaryButton = sectionData.primary_button || 'Start Free Trial';
    const secondaryButton = sectionData.secondary_button || 'Contact Sales';
    const colors = settings?.config_sections?.colors || { primary: '#DA8F29', secondary: '#B8741F', accent: '#f59e0b' };

    const sectionRef = useRef<HTMLElement>(null);
    useScrollReveal(sectionRef, { itemSelector: '.reveal-item', stagger: 0.15 });

    const renderButtons = () => {
        const primaryLink = sectionData.primary_button_link || '#';
        const secondaryLink = sectionData.secondary_button_link || '#';
        
        const isDark = config.layout === 'centered' || config.layout === 'gradient';

        return (
            <div className={config.buttons}>
                <a
                    href={primaryLink}
                    className={`inline-flex items-center justify-center text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                        config.layout === 'minimal' || config.layout === 'card' ? 'text-base px-8 py-3' : 'text-lg'
                    }`}
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.secondary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
                >
                    {primaryButton}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                    href={secondaryLink}
                    className={`inline-flex items-center justify-center border px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                        config.layout === 'minimal' || config.layout === 'card' ? 'text-base px-8 py-3' : 'text-lg'
                    } ${
                        isDark
                            ? 'border-white/20 text-white hover:bg-white/10'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                    {secondaryButton}
                </a>
            </div>
        );
    };

    if (config.layout === 'split') {
        return (
            <section ref={sectionRef} className={config.section}>
                <div className={config.container}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="reveal-item">
                            <h2 className={config.title}>{title}</h2>
                            <p className={config.subtitle}>{subtitle}</p>
                            {renderButtons()}
                        </div>
                        <div className="reveal-item relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            {sectionData.image ? (
                                <img 
                                    src={sectionData.image.startsWith('http') ? sectionData.image : getImagePath(sectionData.image)}
                                    alt="CTA Image"
                                    className="w-full h-80 object-cover"
                                />
                            ) : (
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium">{t('Upload CTA Image')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (config.layout === 'card') {
        return (
            <section ref={sectionRef} className={config.section}>
                <div className={config.container}>
                    <div className="reveal-item bg-white p-8 md:p-12 lg:p-16 rounded-2xl shadow-sm text-center border border-gray-200">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: `${colors.primary}15` }}>
                                    <svg className="w-8 h-8" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">{title}</h2>
                                    <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                {renderButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (config.layout === 'minimal') {
        return (
            <section ref={sectionRef} className={config.section}>
                <div className={`${config.container} reveal-item`}>
                    <div className="w-16 h-1 mx-auto mb-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                    <h2 className={`${config.title} leading-tight tracking-tight`}>{title}</h2>
                    <p className={`${config.subtitle} max-w-2xl mx-auto leading-relaxed`}>{subtitle}</p>
                    {renderButtons()}
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className={config.section}>
            <div className={`${config.container} relative z-10 reveal-item`}>
                <h2 className={config.title}>{title}</h2>
                <p className={config.subtitle}>{subtitle}</p>
                {renderButtons()}
            </div>
        </section>
    );
}