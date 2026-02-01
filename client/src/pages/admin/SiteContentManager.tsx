
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import {
    Globe,
    Phone,
    Mail,
    MapPin,
    Clock,
    Users,
    Image as ImageIcon,
    Save,
    Loader2,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin
} from 'lucide-react';

const SiteContentManager = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const [settings, setSettings] = useState({
        siteName: '',
        siteTagline: '',
        siteLogo: '',
        siteFavicon: '',
        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        businessHours: {} as any,
        socialLinks: {} as any,
        aboutTitle: '',
        aboutSubtitle: '',
        aboutStory: '',
        aboutMission: '',
        aboutVision: '',
        statsYears: '',
        statsDishes: '',
        statsCustomers: '',
        statsAwards: '',
        footerDescription: '',
        copyrightText: '',
        maintenanceMode: false,
        ordersEnabled: true,
        bookingsEnabled: true,
        galleryEnabled: true,
        testimonialsEnabled: true,
        newsletterEnabled: true,
        homeHeroTitle: '',
        homeHeroSubtitle: '',
        homeHeroImage: '',
        homeHeroVideo: '',
        homeHeroCtaText: '',
        homeHeroCtaLink: '',
        menuTitle: '',
        menuSubtitle: '',
        galleryTitle: '',
        gallerySubtitle: '',
        contactTitle: '',
        contactSubtitle: '',
        contactMapUrl: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings/global');
            // Ensure nested objects exist
            setSettings({
                ...data,
                businessHours: data.businessHours || {},
                socialLinks: data.socialLinks || {}
            });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings/global', settings);
            toast({ title: 'Success', description: 'Settings saved successfully' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground">
                        Site Content Manager
                    </h2>
                    <p className="text-muted-foreground">
                        Manage all website content - changes reflect in real-time
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Changes
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card border border-border flex flex-wrap h-auto p-2 gap-2">
                    <TabsTrigger value="general">Global Settings</TabsTrigger>
                    <TabsTrigger value="home">Home Page</TabsTrigger>
                    <TabsTrigger value="menu">Menu Page</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery Page</TabsTrigger>
                    <TabsTrigger value="about">About Page</TabsTrigger>
                    <TabsTrigger value="contact">Contact Page</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Site Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Name</label>
                                <Input
                                    value={settings.siteName || ''}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    placeholder="Hotel Govindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Tagline</label>
                                <Input
                                    value={settings.siteTagline || ''}
                                    onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                                    placeholder="Food Court"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Logo URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.siteLogo || ''}
                                        onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    {settings.siteLogo && <img src={settings.siteLogo} className="w-9 h-9 object-contain border rounded bg-white" alt="Logo" />}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Favicon URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.siteFavicon || ''}
                                        onChange={(e) => setSettings({ ...settings, siteFavicon: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    {settings.siteFavicon && <img src={settings.siteFavicon} className="w-9 h-9 object-contain border rounded bg-white" alt="Favicon" />}
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Footer Description</label>
                                <Textarea
                                    value={settings.footerDescription || ''}
                                    onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                                    placeholder="Brief description used in the footer..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Copyright Text</label>
                                <Input
                                    value={settings.copyrightText || ''}
                                    onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                                    placeholder="© 2024 Hotel Govindam. All rights reserved."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6 mt-6">
                        <h3 className="text-xl font-bold mb-6">Feature Management</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Maintenance Mode</label>
                                    <p className="text-xs text-muted-foreground">Take the website offline</p>
                                </div>
                                <Switch
                                    checked={settings.maintenanceMode}
                                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Enable Orders</label>
                                    <p className="text-xs text-muted-foreground">Allow customers to place orders</p>
                                </div>
                                <Switch
                                    checked={settings.ordersEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, ordersEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Enable Bookings</label>
                                    <p className="text-xs text-muted-foreground">Allow table reservations</p>
                                </div>
                                <Switch
                                    checked={settings.bookingsEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, bookingsEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Enable Gallery</label>
                                    <p className="text-xs text-muted-foreground">Show gallery page</p>
                                </div>
                                <Switch
                                    checked={settings.galleryEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, galleryEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Enable Testimonials</label>
                                    <p className="text-xs text-muted-foreground">Show customer reviews</p>
                                </div>
                                <Switch
                                    checked={settings.testimonialsEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, testimonialsEnabled: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium">Enable Newsletter</label>
                                    <p className="text-xs text-muted-foreground">Show newsletter signup</p>
                                </div>
                                <Switch
                                    checked={settings.newsletterEnabled}
                                    onCheckedChange={(checked) => setSettings({ ...settings, newsletterEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Home Page */}
                <TabsContent value="home" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6">Home Page Hero</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Title</label>
                                <Input
                                    value={settings.homeHeroTitle || ''}
                                    onChange={(e) => setSettings({ ...settings, homeHeroTitle: e.target.value })}
                                    placeholder="Welcome to Hotel Govindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Subtitle</label>
                                <Input
                                    value={settings.homeHeroSubtitle || ''}
                                    onChange={(e) => setSettings({ ...settings, homeHeroSubtitle: e.target.value })}
                                    placeholder="Authentic Flavors, Royal Ambience"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CTA Button Text</label>
                                    <Input
                                        value={settings.homeHeroCtaText || ''}
                                        onChange={(e) => setSettings({ ...settings, homeHeroCtaText: e.target.value })}
                                        placeholder="View Menu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CTA Button Link</label>
                                    <Input
                                        value={settings.homeHeroCtaLink || ''}
                                        onChange={(e) => setSettings({ ...settings, homeHeroCtaLink: e.target.value })}
                                        placeholder="/menu"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 border-t pt-6 mt-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-bold">Hero Carousel Slides</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newSlides = [...(settings.homeHeroSlides || []), { image: '', title: '', subtitle: '' }];
                                            setSettings({ ...settings, homeHeroSlides: newSlides });
                                        }}
                                    >
                                        Add Slide
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {settings.homeHeroSlides?.map((slide: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg bg-card/50 relative group">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const newSlides = settings.homeHeroSlides?.filter((_, i) => i !== index);
                                                    setSettings({ ...settings, homeHeroSlides: newSlides });
                                                }}
                                            >
                                                <span className="sr-only">Delete</span>
                                                &times;
                                            </Button>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Slide Image URL</label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={slide.image || ''}
                                                            onChange={(e) => {
                                                                const newSlides = [...(settings.homeHeroSlides || [])];
                                                                newSlides[index] = { ...newSlides[index], image: e.target.value };
                                                                setSettings({ ...settings, homeHeroSlides: newSlides });
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                        {slide.image && <img src={slide.image} className="w-10 h-10 object-cover rounded" alt="Preview" />}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Title</label>
                                                        <Input
                                                            value={slide.title || ''}
                                                            onChange={(e) => {
                                                                const newSlides = [...(settings.homeHeroSlides || [])];
                                                                newSlides[index] = { ...newSlides[index], title: e.target.value };
                                                                setSettings({ ...settings, homeHeroSlides: newSlides });
                                                            }}
                                                            placeholder="Slide Title"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Subtitle</label>
                                                        <Input
                                                            value={slide.subtitle || ''}
                                                            onChange={(e) => {
                                                                const newSlides = [...(settings.homeHeroSlides || [])];
                                                                newSlides[index] = { ...newSlides[index], subtitle: e.target.value };
                                                                setSettings({ ...settings, homeHeroSlides: newSlides });
                                                            }}
                                                            placeholder="Slide Subtitle"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!settings.homeHeroSlides || settings.homeHeroSlides.length === 0) && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No slides added. Default text above will be used with a single static image if provided.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-medium">Static Hero Image URL (Fallback)</label>
                                <Input
                                    value={settings.homeHeroImage || ''}
                                    onChange={(e) => setSettings({ ...settings, homeHeroImage: e.target.value })}
                                    placeholder="https://"
                                />
                                {settings.homeHeroImage && (
                                    <img src={settings.homeHeroImage} alt="Hero" className="w-full h-48 object-cover rounded-lg mt-2" />
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Menu Page */}
                <TabsContent value="menu" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6">Menu Page Header</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Title</label>
                                <Input
                                    value={settings.menuTitle || ''}
                                    onChange={(e) => setSettings({ ...settings, menuTitle: e.target.value })}
                                    placeholder="Our Menu"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Subtitle</label>
                                <Input
                                    value={settings.menuSubtitle || ''}
                                    onChange={(e) => setSettings({ ...settings, menuSubtitle: e.target.value })}
                                    placeholder="Explore our culinary delights"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Gallery Page */}
                <TabsContent value="gallery" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6">Gallery Page Header</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Title</label>
                                <Input
                                    value={settings.galleryTitle || ''}
                                    onChange={(e) => setSettings({ ...settings, galleryTitle: e.target.value })}
                                    placeholder="Our Gallery"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Subtitle</label>
                                <Input
                                    value={settings.gallerySubtitle || ''}
                                    onChange={(e) => setSettings({ ...settings, gallerySubtitle: e.target.value })}
                                    placeholder="Visual feast of our ambiance and food"
                                />
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed border-primary/20 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-primary">Manage Gallery Images</h4>
                                <p className="text-sm text-muted-foreground">Upload, organizing and delete individual images.</p>
                            </div>
                            <Button variant="outline" onClick={() => window.open('/admin/gallery', '_self')}>
                                Go to Gallery Manager
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* Contact Information */}
                <TabsContent value="contact" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-primary" />
                            Contact Page Content
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-border pb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Title</label>
                                <Input
                                    value={settings.contactTitle || ''}
                                    onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
                                    placeholder="Contact Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Subtitle</label>
                                <Input
                                    value={settings.contactSubtitle || ''}
                                    onChange={(e) => setSettings({ ...settings, contactSubtitle: e.target.value })}
                                    placeholder="Get in touch..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Google Map Embed URL</label>
                                <Input
                                    value={settings.contactMapUrl || ''}
                                    onChange={(e) => setSettings({ ...settings, contactMapUrl: e.target.value })}
                                    placeholder="https://www.google.com/maps/embed?..."
                                />
                            </div>
                        </div>

                        <h4 className="text-lg font-bold mb-6">Contact Details (Global)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <Input
                                    value={settings.contactEmail || ''}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    placeholder="info@hotelgovindam.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input
                                    value={settings.contactPhone || ''}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">WhatsApp Number</label>
                                <Input
                                    value={settings.whatsappNumber || ''}
                                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Textarea
                                    value={settings.address || ''}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    placeholder="123 Food Street, Sector 15, Gandhinagar"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input
                                    value={settings.city || ''}
                                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                    placeholder="Gandhinagar"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">State</label>
                                <Input
                                    value={settings.state || ''}
                                    onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                                    placeholder="Gujarat"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pincode</label>
                                <Input
                                    value={settings.pincode || ''}
                                    onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                                    placeholder="382015"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <Input
                                    value={settings.country || ''}
                                    onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                                    placeholder="India"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Business Hours
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                <div key={day} className="space-y-2">
                                    <label className="text-sm font-medium capitalize">{day}</label>
                                    <Input
                                        value={settings.businessHours?.[day] || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            businessHours: { ...settings.businessHours, [day]: e.target.value }
                                        })}
                                        placeholder="10:00 AM - 10:00 PM"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* About Page */}
                <TabsContent value="about" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6">About Page Content</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Page Title</label>
                                    <Input
                                        value={settings.aboutTitle || ''}
                                        onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                                        placeholder="A Legacy of Authentic Flavors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Page Subtitle</label>
                                    <Input
                                        value={settings.aboutSubtitle || ''}
                                        onChange={(e) => setSettings({ ...settings, aboutSubtitle: e.target.value })}
                                        placeholder="Our Story"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Our Story</label>
                                <Textarea
                                    value={settings.aboutStory || ''}
                                    onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
                                    placeholder="Since 1995, Hotel Govindam has been..."
                                    rows={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Our Mission</label>
                                <Textarea
                                    value={settings.aboutMission || ''}
                                    onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
                                    placeholder="To serve authentic Indian food..."
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Our Vision</label>
                                <Textarea
                                    value={settings.aboutVision || ''}
                                    onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                                    placeholder="To become the most loved Indian restaurant..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Statistics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Years of Excellence</label>
                                <Input
                                    value={settings.statsYears || ''}
                                    onChange={(e) => setSettings({ ...settings, statsYears: e.target.value })}
                                    placeholder="25+"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Signature Dishes</label>
                                <Input
                                    value={settings.statsDishes || ''}
                                    onChange={(e) => setSettings({ ...settings, statsDishes: e.target.value })}
                                    placeholder="100+"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Happy Customers</label>
                                <Input
                                    value={settings.statsCustomers || ''}
                                    onChange={(e) => setSettings({ ...settings, statsCustomers: e.target.value })}
                                    placeholder="50K+"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Awards Won</label>
                                <Input
                                    value={settings.statsAwards || ''}
                                    onChange={(e) => setSettings({ ...settings, statsAwards: e.target.value })}
                                    placeholder="15+"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Social Media */}
                <TabsContent value="social" className="space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-xl font-bold mb-6">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook</label>
                                <Input
                                    value={settings.socialLinks?.facebook || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                                    })}
                                    placeholder="https://facebook.com/hotelgovindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</label>
                                <Input
                                    value={settings.socialLinks?.instagram || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                                    })}
                                    placeholder="https://instagram.com/hotelgovindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</label>
                                <Input
                                    value={settings.socialLinks?.twitter || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                                    })}
                                    placeholder="https://twitter.com/hotelgovindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Youtube className="w-4 h-4" /> YouTube</label>
                                <Input
                                    value={settings.socialLinks?.youtube || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                                    })}
                                    placeholder="https://youtube.com/hotelgovindam"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</label>
                                <Input
                                    value={settings.socialLinks?.linkedin || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                                    })}
                                    placeholder="https://linkedin.com/company/hotelgovindam"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>


            </Tabs>
        </div>
    );
};

export default SiteContentManager;
