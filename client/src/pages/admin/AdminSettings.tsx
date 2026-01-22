import { useState, useEffect } from 'react';
import { Loader2, Save, Eye, EyeOff, Layout, Palette, Trash2, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { ImageUpload } from '@/components/ui/image-upload';

interface PageSection {
  id: string;
  type: string;
  content: any;
  isVisible: boolean;
  sortOrder: number;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  isSystem: boolean;
  sections: PageSection[];
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: string;
}

interface GlobalSettings {
  siteName: string;
  maintenanceMode: boolean;
  ordersEnabled: boolean;
  bookingsEnabled: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

const AdminSettings = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>({
    primaryColor: '#eab308',
    secondaryColor: '#1a1a1a',
    accentColor: '#ffffff',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamilyHeading: 'Inter',
    fontFamilyBody: 'Inter',
    borderRadius: '0.5rem'
  });
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSections, setSavingSections] = useState<Record<string, boolean>>({});
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [pagesRes, themeRes, globalRes] = await Promise.all([
        api.get('/pages'),
        api.get('/settings/theme'),
        api.get('/settings/global')
      ]);
      setPages(pagesRes.data);
      if (themeRes.data) setTheme(themeRes.data);
      if (globalRes.data) setGlobalSettings(globalRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSectionUpdate = async (pageIndex: number, sectionIndex: number, newSectionState: PageSection) => {
    const sectionId = newSectionState.id;
    setSavingSections(prev => ({ ...prev, [sectionId]: true }));

    try {
      await api.put(`/pages/section/${sectionId}`, {
        content: newSectionState.content,
        isVisible: newSectionState.isVisible,
        sortOrder: newSectionState.sortOrder
      });

      const newPages = [...pages];
      newPages[pageIndex].sections[sectionIndex] = newSectionState;
      setPages(newPages);

      toast({ title: 'Success', description: 'Section updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update section', variant: 'destructive' });
    } finally {
      setSavingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleThemeUpdate = async () => {
    setIsSavingTheme(true);
    try {
      await api.put('/settings/theme', theme);
      toast({ title: 'Success', description: 'Theme updated successfully' });
      // Apply loosely for preview
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--radius', theme.borderRadius);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update theme', variant: 'destructive' });
    } finally {
      setIsSavingTheme(false);
    }
  }

  const handleGlobalUpdate = async () => {
    setIsSavingGlobal(true);
    try {
      await api.put('/settings/global', globalSettings);
      toast({ title: 'Success', description: 'Global settings updated' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    } finally {
      setIsSavingGlobal(false);
    }
  }

  // --- UI Helpers ---

  const formatContent = (content: any) => {
    return JSON.stringify(content, null, 2);
  };

  const renderField = (label: string, value: string, onChange: (val: string) => void, type = "text") => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="h-9" />
    </div>
  );

  const renderColorPicker = (label: string, value: string, onChange: (val: string) => void) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded border border-border shadow-sm" style={{ backgroundColor: value }} />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9 font-mono" />
      </div>
    </div>
  );

  if (isLoading) return <Loader2 className="animate-spin w-8 h-8 mx-auto mt-10" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">GOD MODE: Builder & Settings</h2>
        <p className="text-muted-foreground">Full control over the entire website ecosystem.</p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="pages">Website Builder</TabsTrigger>
          <TabsTrigger value="theme">Theme & UI</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
        </TabsList>

        {/* --- WEBSITE BUILDER TAB --- */}
        <TabsContent value="pages" className="space-y-8">
          {pages.map((page, pageIndex) => (
            <div key={page.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-lg leading-none">{page.title}</h3>
                    <span className="text-xs text-muted-foreground font-mono">slug: /{page.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Add Section Button Placeholder */}
                  <Button variant="outline" size="sm">Add Section</Button>
                </div>
              </div>

              <div className="p-4 bg-card">
                <Accordion type="multiple" className="w-full space-y-2">
                  {page.sections.map((section, sectionIndex) => (
                    <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-2">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-4 w-full">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase w-24 text-center tracking-wider">
                            {section.type}
                          </span>
                          <span className="text-xs text-muted-foreground">Order: {section.sortOrder}</span>

                          <div className="ml-auto flex items-center gap-3 mr-4" onClick={(e) => e.stopPropagation()}>
                            {section.isVisible ?
                              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><Eye className="w-3 h-3" /> Visible</span> :
                              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full"><EyeOff className="w-3 h-3" /> Hidden</span>
                            }
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Editor Column */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                              <h4 className="text-sm font-semibold">Section Controls</h4>
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-medium">Visible</label>
                                <Switch
                                  checked={section.isVisible}
                                  onCheckedChange={(checked) => {
                                    const updated = { ...section, isVisible: checked };
                                    handleSectionUpdate(pageIndex, sectionIndex, updated);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-medium uppercase text-muted-foreground">Detailed Content (JSON Mode)</label>
                              <Textarea
                                className="font-mono text-xs min-h-[200px] leading-relaxed bg-muted/50"
                                defaultValue={formatContent(section.content)}
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value);
                                    const newPages = [...pages];
                                    newPages[pageIndex].sections[sectionIndex].content = parsed;
                                    setPages(newPages);
                                  } catch (err) { /* ignore */ }
                                }}
                              />
                              <p className="text-[10px] text-muted-foreground">
                                *Modify fields directly. E.g. "title", "subtitle", "buttonText".
                              </p>
                            </div>
                          </div>

                          {/* Preview/Actions Column - simplified for now */}
                          <div className="flex flex-col justify-end space-y-4">
                            <div className="p-4 bg-primary/10 rounded border border-primary/20 text-primary text-xs">
                              <strong>Tip:</strong> Changes to "content" JSON update the live site immediately after saving.
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground uppercase">Quick Asset Upload</label>
                              <ImageUpload
                                onChange={(url) => {
                                  navigator.clipboard.writeText(url);
                                  toast({ title: "URL Copied", description: "Image URL copied to clipboard!" });
                                }}
                                placeholder="Upload for JSON URL"
                                className="h-32"
                              />
                              <p className="text-[10px] text-muted-foreground text-center">URL will be copied to clipboard automatically.</p>
                            </div>

                            <Button
                              className="w-full"
                              disabled={savingSections[section.id]}
                              onClick={() => handleSectionUpdate(pageIndex, sectionIndex, section)}
                            >
                              {savingSections[section.id] ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                              Save Changes to Website
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {page.sections.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No content sections yet.</p>
                    <Button variant="link" className="mt-2 text-primary">Add your first section</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* --- THEME TAB --- */}
        <TabsContent value="theme">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" /> Core Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderColorPicker("Primary Color", theme.primaryColor, (v) => setTheme({ ...theme, primaryColor: v }))}
                  {renderColorPicker("Secondary Color", theme.secondaryColor, (v) => setTheme({ ...theme, secondaryColor: v }))}
                  {renderColorPicker("Accent Color", theme.accentColor, (v) => setTheme({ ...theme, accentColor: v }))}
                  {renderColorPicker("Background Color", theme.backgroundColor, (v) => setTheme({ ...theme, backgroundColor: v }))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" /> Typography & Shape
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField("Heading Font", theme.fontFamilyHeading, (v) => setTheme({ ...theme, fontFamilyHeading: v }))}
                  {renderField("Body Font", theme.fontFamilyBody, (v) => setTheme({ ...theme, fontFamilyBody: v }))}
                  {renderField("Border Radius", theme.borderRadius, (v) => setTheme({ ...theme, borderRadius: v }))}
                </div>
              </div>

              <Button onClick={handleThemeUpdate} disabled={isSavingTheme} size="lg" className="w-full md:w-auto">
                {isSavingTheme ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Theme Configuration
              </Button>
            </div>

            {/* Live Preview Panel (Mockup) */}
            <div className="hidden lg:block">
              <div className="sticky top-6 bg-card border border-border rounded-xl p-6 shadow-md">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Live Preview</h4>
                <div className="border rounded-lg p-4 space-y-4" style={{ backgroundColor: theme.backgroundColor }}>
                  <h1 style={{ color: theme.primaryColor, fontFamily: theme.fontFamilyHeading }} className="text-2xl font-bold">Heading Preview</h1>
                  <p style={{ fontFamily: theme.fontFamilyBody, color: theme.textColor }} className="text-sm">
                    This is how your body text will look. The buttons below reflect your radius settings.
                  </p>
                  <div className="flex gap-2">
                    <button style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }} className="px-4 py-2 text-white text-sm font-medium">Primary</button>
                    <button style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.borderRadius }} className="px-4 py-2 text-white text-sm font-medium">Secondary</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- GLOBAL SETTINGS TAB --- */}
        <TabsContent value="global">
          <div className="bg-card rounded-xl border border-border p-6 max-w-2xl space-y-8 shadow-sm">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> General Info</h3>
              <div className="grid gap-4">
                {renderField("Website Name", globalSettings?.siteName || '', (v) => setGlobalSettings(prev => prev ? ({ ...prev, siteName: v }) : null))}
                {renderField("Contact Email", globalSettings?.contactEmail || '', (v) => setGlobalSettings(prev => prev ? ({ ...prev, contactEmail: v }) : null))}
                {renderField("Phone Number", globalSettings?.contactPhone || '', (v) => setGlobalSettings(prev => prev ? ({ ...prev, contactPhone: v }) : null))}
                {renderField("Address", globalSettings?.address || '', (v) => setGlobalSettings(prev => prev ? ({ ...prev, address: v }) : null))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Functional Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Maintenance Mode</label>
                    <p className="text-xs text-muted-foreground">Take the website offline</p>
                  </div>
                  <Switch
                    checked={globalSettings?.maintenanceMode}
                    onCheckedChange={(c) => setGlobalSettings(prev => prev ? ({ ...prev, maintenanceMode: c }) : null)}
                  />
                </div>
                <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Enable Orders</label>
                    <p className="text-xs text-muted-foreground">Allow customers to place orders</p>
                  </div>
                  <Switch
                    checked={globalSettings?.ordersEnabled}
                    onCheckedChange={(c) => setGlobalSettings(prev => prev ? ({ ...prev, ordersEnabled: c }) : null)}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleGlobalUpdate} disabled={isSavingGlobal} className="w-full">
              {isSavingGlobal ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Global Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
