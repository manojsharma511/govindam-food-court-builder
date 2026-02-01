
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

interface GlobalSettings {
    siteName: string;
    siteTagline: string;
    siteLogo: string;
    siteFavicon: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    businessHours: any;
    socialLinks: any;
    aboutTitle: string;
    aboutSubtitle: string;
    aboutStory: string;
    aboutMission: string;
    aboutVision: string;
    statsYears: string;
    statsDishes: string;
    statsCustomers: string;
    statsAwards: string;
    footerDescription: string;
    copyrightText: string;
    maintenanceMode: boolean;
    ordersEnabled: boolean;
    bookingsEnabled: boolean;
    galleryEnabled: boolean;
    testimonialsEnabled: boolean;
    newsletterEnabled: boolean;

    // Home Page
    homeHeroTitle?: string;
    homeHeroSubtitle?: string;
    homeHeroImage?: string;
    homeHeroVideo?: string;
    homeHeroCtaText?: string;
    homeHeroCtaLink?: string;
    homeHeroSlides?: any[]; // Array of slides

    // Interior Pages
    menuTitle?: string;
    menuSubtitle?: string;
    galleryTitle?: string;
    gallerySubtitle?: string;
    contactTitle?: string;
    contactSubtitle?: string;
    contactMapUrl?: string;

    logoUrl?: string; // Backwards compatibility
    faviconUrl?: string; // Backwards compatibility
    description?: string; // Backwards compatibility
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
}

interface Testimonial {
    id: string;
    customerName: string;
    customerRole: string;
    rating: number;
    review: string;
    imageUrl: string;
    sortOrder: number;
}

interface Value {
    id: string;
    title: string;
    description: string;
    icon: string;
    sortOrder: number;
}

interface SiteConfigContextType {
    settings: GlobalSettings | null;
    teamMembers: TeamMember[];
    testimonials: Testimonial[];
    values: Value[];
    loading: boolean;
    refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<GlobalSettings | null>(() => {
        try {
            const cached = localStorage.getItem('site_settings');
            return cached ? JSON.parse(cached) : null;
        } catch { return null; }
    });
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
        try {
            const cached = localStorage.getItem('site_team');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
        try {
            const cached = localStorage.getItem('site_testimonials');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [values, setValues] = useState<Value[]>(() => {
        try {
            const cached = localStorage.getItem('site_values');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [loading, setLoading] = useState(!settings);
    const [socket, setSocket] = useState<Socket | null>(null);

    const fetchConfig = async () => {
        try {
            const [settingsRes, teamRes, testimonialsRes, valuesRes] = await Promise.all([
                api.get('/settings/global'),
                api.get('/team'),
                api.get('/testimonials'),
                api.get('/values')
            ]);

            setSettings(settingsRes.data);
            localStorage.setItem('site_settings', JSON.stringify(settingsRes.data));

            setTeamMembers(teamRes.data);
            localStorage.setItem('site_team', JSON.stringify(teamRes.data));

            setTestimonials(testimonialsRes.data);
            localStorage.setItem('site_testimonials', JSON.stringify(testimonialsRes.data));

            setValues(valuesRes.data);
            localStorage.setItem('site_values', JSON.stringify(valuesRes.data));

            // Apply theme
            if (settingsRes.data) {
                document.title = settingsRes.data.siteName || "Hotel Govindam";
                // Update favicon if available
                if (settingsRes.data.siteFavicon || settingsRes.data.faviconUrl) {
                    const faviconUrl = settingsRes.data.siteFavicon || settingsRes.data.faviconUrl;
                    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = faviconUrl;
                }
            }

        } catch (error) {
            console.error('Failed to fetch site config', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();

        // Initialize Socket.IO for real-time updates
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
        // Remove /api if present for socket connection which usually connects to root
        const socketUrl = apiUrl.replace(/\/api$/, '');

        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('config-update', (data) => {
            console.log('Config update received:', data);

            switch (data.type) {
                case 'global-settings':
                    setSettings(prev => {
                        const updated = { ...prev, ...data.data };
                        localStorage.setItem('site_settings', JSON.stringify(updated));
                        return updated;
                    });
                    if (data.data.siteName) document.title = data.data.siteName;
                    break;
                case 'team-members':
                    fetchConfig(); // Refresh all to maintain order
                    break;
                case 'testimonials':
                    fetchConfig();
                    break;
                case 'values':
                    fetchConfig();
                    break;
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SiteConfigContext.Provider value={{
            settings,
            teamMembers,
            testimonials,
            values,
            loading,
            refreshConfig: fetchConfig
        }}>
            {children}
        </SiteConfigContext.Provider>
    );
};
