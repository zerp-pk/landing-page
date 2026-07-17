import { useRef } from 'react';
import { useScrollReveal, animateCountUp } from '../../hooks/useScrollReveal';

interface StatsProps {
    settings?: any;
}

const STATS_VARIANTS = {
    stats1: {
        section: 'bg-neutral-950 py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        grid: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center',
        statValue: 'text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2',
        statLabel: 'text-white/60 text-sm md:text-base',
        layout: 'colored'
    },
    stats2: {
        section: 'bg-gray-50 py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
        statValue: 'text-4xl md:text-5xl font-semibold tracking-tight mb-3',
        statLabel: 'text-gray-500 text-sm md:text-base font-medium',
        layout: 'cards'
    },
    stats3: {
        section: 'bg-white py-24 md:py-32',
        container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
        grid: 'grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12',
        statValue: 'text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2',
        statLabel: 'text-gray-500 text-sm md:text-base font-medium',
        layout: 'minimal'
    },
    stats4: {
        section: 'bg-neutral-950 py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        grid: 'grid grid-cols-2 md:grid-cols-4 gap-8',
        statValue: 'text-xl md:text-2xl font-semibold tracking-tight text-white',
        statLabel: 'text-white/50 text-xs md:text-sm font-medium',
        layout: 'circular'
    },
    stats5: {
        section: 'bg-neutral-950 py-24 md:py-32',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        grid: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center',
        statValue: 'text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2',
        statLabel: 'text-white/60 text-sm md:text-base',
        layout: 'gradient'
    }
};

export default function Stats({ settings }: StatsProps) {
    const sectionData = settings?.config_sections?.sections?.stats || {};
    const variant = sectionData.variant || 'stats1';
    const config = STATS_VARIANTS[variant as keyof typeof STATS_VARIANTS] || STATS_VARIANTS.stats1;
    
    const colors = settings?.config_sections?.colors || { primary: '#DA8F29', secondary: '#B8741F', accent: '#f59e0b' };
    
    const defaultStats = [
        { label: 'Businesses Trust Us', value: '200+' },
        { label: 'Uptime Guarantee', value: '99.9%' },
        { label: 'Customer Support', value: '24/7' },
        { label: 'Countries Worldwide', value: '16+' }
    ];
    
    const stats = sectionData.stats?.length > 0 ? sectionData.stats : defaultStats;

    const sectionRef = useRef<HTMLElement>(null);
    const valueRefs = useRef<(HTMLElement | null)[]>([]);
    useScrollReveal(sectionRef, {
        onEnter: () => {
            valueRefs.current.forEach((el, i) => {
                if (el) animateCountUp(el, String(stats[i]?.value ?? ''));
            });
        },
    });

    const renderStat = (stat: any, index: number) => {
        if (config.layout === 'cards') {
            return (
                <div key={index} className="reveal-item group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center border border-gray-200 hover:border-gray-300">
                    <div ref={(el) => { valueRefs.current[index] = el; }} className={config.statValue} style={{ color: colors.primary }}>{stat.value}</div>
                    <div className={config.statLabel}>{stat.label}</div>
                    <div className="mt-4 w-12 h-1 mx-auto rounded-full transition-all duration-300" style={{ backgroundColor: colors.primary, opacity: 0.3 }}></div>
                </div>
            );
        }

        if (config.layout === 'minimal') {
            return (
                <div key={index} className="reveal-item text-center group">
                    <div ref={(el) => { valueRefs.current[index] = el; }} className={`${config.statValue} transition-all duration-300 group-hover:scale-105`} style={{ color: colors.primary }}>{stat.value}</div>
                    <div className={config.statLabel}>{stat.label}</div>
                    <div className="mt-3 w-8 h-0.5 mx-auto rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: colors.primary }}></div>
                </div>
            );
        }

        if (config.layout === 'circular') {
            return (
                <div key={index} className="reveal-item text-center group">
                    <div className="relative w-28 h-28 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 transition-all duration-300 group-hover:border-white/40"></div>
                        <div className="absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: `${colors.primary}20` }}>
                            <div ref={(el) => { valueRefs.current[index] = el; }} className={config.statValue}>{stat.value}</div>
                        </div>
                    </div>
                    <div className={config.statLabel}>{stat.label}</div>
                </div>
            );
        }

        // Default layout (colored/gradient)
        return (
            <div key={index} className="reveal-item">
                <div ref={(el) => { valueRefs.current[index] = el; }} className={config.statValue}>{stat.value}</div>
                <div className={config.statLabel}>{stat.label}</div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className={config.section}>
            <div className={config.container}>
                <div className={config.grid}>
                    {stats.map((stat, index) => renderStat(stat, index))}
                </div>
            </div>
        </section>
    );
}