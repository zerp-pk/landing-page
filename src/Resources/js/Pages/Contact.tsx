import { Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from '@/components/cookie-consent';
import { getAdminSetting, getImagePath } from '@/utils/helpers';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ContactProps {
    settings?: any;
}

export default function Contact({ settings }: ContactProps) {
    const { t } = useTranslation();
    const favicon = getAdminSetting('favicon');
    const faviconUrl = favicon ? getImagePath(favicon) : null;
    const { adminAllSetting, auth } = usePage().props as any;
    const mergedSettings = { ...settings, is_authenticated: (auth?.user?.id !== undefined && auth?.user?.id !== null) };
    const colors = mergedSettings?.config_sections?.colors || { primary: '#DA8F29', secondary: '#B8741F', accent: '#f59e0b' };

    const contactEmail = mergedSettings?.contact_email || 'support@zerp.pk';
    const contactPhone = mergedSettings?.contact_phone;
    const contactAddress = mergedSettings?.contact_address;

    const sectionRef = useRef<HTMLElement>(null);
    useScrollReveal(sectionRef);

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error(t('Please fill in your name, email, and message.'));
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(route('contact.submit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || t('Message sent!'));
                setForm({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.message || t('Failed to send your message. Please try again.'));
            }
        } catch (error) {
            toast.error(t('An error occurred. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title={t('Contact Us')}>
                {faviconUrl && <link rel="icon" type="image/x-icon" href={faviconUrl} />}
            </Head>

            <Header settings={mergedSettings} />

            <main className="min-h-screen bg-white py-24 md:py-32">
                <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 reveal-item">
                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">{t('Contact Us')}</h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-normal">
                            {t('Have a question or need help? Send us a message and our team will get back to you.')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="reveal-item lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15` }}>
                                    <Mail className="h-5 w-5" style={{ color: colors.primary }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{t('Email')}</h3>
                                    <a href={`mailto:${contactEmail}`} className="text-gray-500 hover:underline">{contactEmail}</a>
                                </div>
                            </div>

                            {contactPhone && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15` }}>
                                        <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t('Phone')}</h3>
                                        <a href={`tel:${contactPhone}`} className="text-gray-500 hover:underline">{contactPhone}</a>
                                    </div>
                                </div>
                            )}

                            {contactAddress && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15` }}>
                                        <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{t('Address')}</h3>
                                        <p className="text-gray-500">{contactAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="reveal-item lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Name')}</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange('name')}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                                            style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Email')}</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange('email')}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                                            style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Subject')}</label>
                                    <input
                                        type="text"
                                        value={form.subject}
                                        onChange={handleChange('subject')}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                                        style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Message')}</label>
                                    <textarea
                                        value={form.message}
                                        onChange={handleChange('message')}
                                        rows={6}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
                                        style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-60"
                                    style={{ backgroundColor: colors.primary }}
                                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = colors.secondary; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}
                                >
                                    {isSubmitting ? t('Sending...') : t('Send Message')}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer settings={mergedSettings} />

            <CookieConsent settings={adminAllSetting || {}} />
        </>
    );
}
