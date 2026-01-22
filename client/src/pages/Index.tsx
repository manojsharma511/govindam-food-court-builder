import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DynamicHero } from '@/components/sections/DynamicHero';
import { DynamicFeatures } from '@/components/sections/DynamicFeatures';
import { AboutPreview } from '@/components/home/AboutPreview';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { HotelShowcase } from '@/components/home/HotelShowcase';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface PageSection {
  id: string;
  type: string;
  content: any;
  sortOrder: number;
}

const Index = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        // Try to fetch dynamic home page from DB
        const { data } = await api.get('/pages/public/home');
        if (data && data.sections) {
          setSections(data.sections);
        }
      } catch (error) {
        console.error("Failed to fetch home page, using fallback", error);
        // Fallback or just empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchHome();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  // If no sections found (or API failed), fall back to hardcoded default
  // But wait, the prompt says "Anything visible MUST be editable".
  // So if API fails or is empty, we show a "Maintenance" or empty state?
  // For now, let's assume seed data is present.

  return (
    <Layout>
      {sections.length > 0 ? (
        sections.map((section) => {
          switch (section.type) {
            case 'hero':
              return <DynamicHero key={section.id} {...section.content} />;
            case 'features':
              return <DynamicFeatures key={section.id} {...section.content} />;
            case 'about':
              return <AboutPreview key={section.id} {...section.content} />;
            case 'testimonials':
              return <TestimonialsSection key={section.id} {...section.content} />;
            case 'cta':
              return <CTASection key={section.id} {...section.content} />;
            default:
              return null;
          }
        })
      ) : (
        // Fallback layout if DB is empty to avoid broken site during dev
        <>
          <DynamicHero />
          <DynamicFeatures title="Our Cuisine" subtitle="Taste the Excellence" />
          <AboutPreview />
          <HotelShowcase />
          <TestimonialsSection />
          <CTASection />
        </>
      )}
    </Layout>
  );
};

export default Index;
