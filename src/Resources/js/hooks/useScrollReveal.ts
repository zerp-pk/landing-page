import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

interface ScrollRevealOptions {
    /** Selector (within the section) for children to stagger in, e.g. '.reveal-item'. */
    itemSelector?: string;
    y?: number;
    duration?: number;
    stagger?: number;
    /** Called once, the moment the section's reveal animation starts. */
    onEnter?: () => void;
}

/**
 * Fades/slides/scales a section in as it enters the viewport, staggering any
 * matching children. No-ops (renders final state immediately) if the user
 * has requested reduced motion.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, options: ScrollRevealOptions = {}) {
    const { itemSelector = '.reveal-item', y = 40, duration = 0.8, stagger = 0.12, onEnter } = options;
    const onEnterRef = useRef(onEnter);
    onEnterRef.current = onEnter;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (prefersReducedMotion()) {
            onEnterRef.current?.();
            return;
        }

        const items = el.querySelectorAll(itemSelector);
        const targets: (Element)[] = items.length > 0 ? Array.from(items) : [el];

        gsap.set(targets, { opacity: 0, y, scale: 0.96 });

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(targets, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration,
                    stagger,
                    ease: 'power3.out',
                    // Drop the inline styles once settled so they don't outrank
                    // Tailwind's hover: transform/opacity utilities afterwards.
                    clearProps: 'opacity,transform',
                });
                onEnterRef.current?.();
            },
        });

        return () => {
            trigger.kill();
        };
    }, [ref, itemSelector, y, duration, stagger]);
}

/**
 * Animates a stat's displayed value counting up from 0. Handles values like
 * "20,000+", "99.9%", "70+" by animating the numeric portion and re-applying
 * the original formatting/suffix. Non-numeric values (e.g. "24/7") are left
 * untouched.
 */
export function animateCountUp(el: Element | null, rawValue: string, duration = 1.6) {
    if (!el) return;
    const match = rawValue.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (Number.isNaN(target)) return;

    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const useGrouping = numStr.includes(',');

    if (prefersReducedMotion()) {
        el.textContent = rawValue;
        return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
        value: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            const formatted = counter.value.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
                useGrouping,
            });
            el.textContent = `${prefix}${formatted}${suffix}`;
        },
        onComplete: () => {
            el.textContent = rawValue;
        },
    });
}
