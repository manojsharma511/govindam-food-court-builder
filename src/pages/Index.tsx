import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedMenu } from '@/components/home/FeaturedMenu';
import { AboutPreview } from '@/components/home/AboutPreview';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedMenu />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
