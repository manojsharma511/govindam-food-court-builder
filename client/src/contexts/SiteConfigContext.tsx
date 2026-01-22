import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
    borderRadius: string;
    shadowIntensity: string;
}

interface GlobalSettings {
    siteName: string;
    maintenanceMode: boolean;
    ordersEnabled: boolean;
    bookingsEnabled: boolean;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: any;
    businessHours: any;
}

interface SiteConfigContextType {
    theme: ThemeSettings | null;
    settings: GlobalSettings | null;
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
    const [theme, setTheme] = useState<ThemeSettings | null>(null);
    const [settings, setSettings] = useState<GlobalSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const [themeRes, settingsRes] = await Promise.all([
                api.get('/settings/theme'),
                api.get('/settings/global')
            ]);

            setTheme(themeRes.data);
            setSettings(settingsRes.data);

            // Apply theme
            const root = document.documentElement;
            if (themeRes.data) {
                const t = themeRes.data;
                root.style.setProperty('--primary', t.primaryColor);
                // We might need to handle HSL conversion if ShadCN uses HSL variables
                // For now assuming the backend returns valid CSS color strings or we might need a helper
                root.style.setProperty('--radius', t.borderRadius);
            }

        } catch (error) {
            console.error('Failed to fetch site config', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <SiteConfigContext.Provider value={{ theme, settings, loading, refreshConfig: fetchConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};
