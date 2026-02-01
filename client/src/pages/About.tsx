import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Utensils, Heart, ChefHat, Target, Sparkles, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

// Icon mapping helper
const IconMap: any = {
  Award, Users, Clock, Utensils, Heart, ChefHat, Target, Sparkles
};

// --- Dynamic Components ---

const AboutHero = ({ content }: { content: any }) => (
  <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
    <div className="absolute inset-0 pattern-overlay" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto"
      >
        <span className="text-primary text-sm font-medium uppercase tracking-widest">
          {content.subtitle}
        </span>
        <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
          {content.title}
        </h1>
        <div className="ornament-line-long mx-auto" />
        <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
          {content.description}
        </p>
      </motion.div>
    </div>
  </section>
);

const AboutStats = ({ content }: { content: any }) => (
  <section className="py-16 bg-card border-b border-border">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {content.stats.map((stat: any, index: number) => {
          const Icon = IconMap[stat.icon] || Clock;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-heading font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

const AboutStory = ({ content }: { content: any }) => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {content.images[0] && (
                <img
                  src={content.images[0]}
                  alt="Restaurant"
                  className="rounded-2xl shadow-card w-full h-48 object-cover"
                />
              )}
              {content.images[1] && (
                <img
                  src={content.images[1]}
                  alt="Food"
                  className="rounded-2xl shadow-card w-full h-64 object-cover"
                />
              )}
            </div>
            <div className="space-y-4 pt-8">
              {content.images[2] && (
                <img
                  src={content.images[2]}
                  alt="Chef"
                  className="rounded-2xl shadow-card w-full h-64 object-cover"
                />
              )}
              {content.images[3] && (
                <img
                  src={content.images[3]}
                  alt="Dining"
                  className="rounded-2xl shadow-card w-full h-48 object-cover"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            {content.subtitle}
          </span>
          <h2 className="text-4xl font-heading font-bold">
            {content.title}
          </h2>
          <div className="ornament-line" />
          {content.paragraphs.map((p: string, idx: number) => (
            <p key={idx} className="text-muted-foreground text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const AboutValues = ({ content }: { content: any }) => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-medium uppercase tracking-widest">
          {content.subtitle}
        </span>
        <h2 className="text-4xl font-heading font-bold mt-4 mb-6">
          {content.title}
        </h2>
        <div className="ornament-line-long mx-auto" />
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {content.values.map((value: any, index: number) => {
          const Icon = IconMap[value.icon] || Star;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

const Star = ({ className }: { className?: string }) => <span className={className}>★</span>;

const AboutTeam = ({ content }: { content: any }) => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-medium uppercase tracking-widest">
          {content.subtitle}
        </span>
        <h2 className="text-4xl font-heading font-bold mt-4 mb-6">
          {content.title}
        </h2>
        <div className="ornament-line-long mx-auto" />
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {content.members.map((member: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
          >
            <div className="h-64 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
              <p className="text-muted-foreground text-sm mt-3">{member.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AboutPage = () => {
  const { settings, teamMembers, values, loading } = useSiteConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              {settings?.aboutSubtitle || 'Our Story'}
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              {settings?.aboutTitle || 'A Legacy of Authentic Flavors'}
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
              {settings?.aboutStory || settings?.description || "Since 1995, Hotel Govindam has been a beacon of authentic Indian cuisine..."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: settings?.statsYears || '25+', label: 'Years of Excellence', icon: Clock },
              { value: settings?.statsDishes || '100+', label: 'Signature Dishes', icon: Utensils },
              { value: settings?.statsCustomers || '50K+', label: 'Happy Customers', icon: Users },
              { value: settings?.statsAwards || '15+', label: 'Awards Won', icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-heading font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      {values.length > 0 && (
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                Our Values
              </span>
              <h2 className="text-4xl font-heading font-bold mt-4 mb-6">
                What Drives Us Forward
              </h2>
              <div className="ornament-line-long mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                Meet The Team
              </span>
              <h2 className="text-4xl font-heading font-bold mt-4 mb-6">
                Our Culinary Masters
              </h2>
              <div className="ornament-line-long mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.imageUrl || 'https://via.placeholder.com/400'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-heading font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                    <p className="text-muted-foreground text-sm mt-3">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AboutPage;
