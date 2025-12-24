import { motion } from 'framer-motion';
import { Award, Users, Clock, Utensils, Heart, ChefHat, Target, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const stats = [
  { value: '25+', label: 'Years of Excellence', icon: Clock },
  { value: '100+', label: 'Signature Dishes', icon: Utensils },
  { value: '50K+', label: 'Happy Customers', icon: Users },
  { value: '15+', label: 'Awards Won', icon: Award },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Food',
    description: 'Every dish is crafted with love and dedication to bring you the authentic taste of India.',
  },
  {
    icon: ChefHat,
    title: 'Expert Craftsmanship',
    description: 'Our master chefs bring decades of experience and traditional knowledge to every recipe.',
  },
  {
    icon: Target,
    title: 'Quality First',
    description: 'We source only the finest, freshest ingredients to ensure every meal is exceptional.',
  },
  {
    icon: Sparkles,
    title: 'Memorable Experience',
    description: 'From ambiance to service, we create dining experiences that stay with you forever.',
  },
];

const team = [
  {
    name: 'Chef Ramesh Kumar',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    description: '25 years of culinary expertise in traditional Indian cuisine.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head Pastry Chef',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    description: 'Specialist in Indian desserts and fusion sweets.',
  },
  {
    name: 'Vikram Singh',
    role: 'Sous Chef',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    description: 'Expert in North Indian and Mughlai cuisine.',
  },
];

const AboutPage = () => {
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
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mt-4 mb-6">
              <span className="text-foreground">A Legacy of</span>{' '}
              <span className="text-gradient-gold">Authentic Flavors</span>
            </h1>
            <div className="ornament-line-long mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
              Since 1995, Hotel Govindam has been a beacon of authentic Indian cuisine, 
              bringing the rich culinary heritage of India to food lovers everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Story Section */}
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
                  <img
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400"
                    alt="Restaurant"
                    className="rounded-2xl shadow-card w-full h-48 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"
                    alt="Food"
                    className="rounded-2xl shadow-card w-full h-64 object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400"
                    alt="Chef cooking"
                    className="rounded-2xl shadow-card w-full h-64 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400"
                    alt="Dining"
                    className="rounded-2xl shadow-card w-full h-48 object-cover"
                  />
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
                How It Started
              </span>
              <h2 className="text-4xl font-heading font-bold">
                <span className="text-foreground">From Humble Beginnings</span>
                <br />
                <span className="text-gradient-gold">To Culinary Excellence</span>
              </h2>
              <div className="ornament-line" />
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our journey began in 1995 when Chef Govindam, inspired by his grandmother's 
                recipes, opened a small eatery with just 5 tables. His vision was simple: 
                to serve authentic Indian food that reminded people of home.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, that small eatery has grown into a beloved institution. 
                What hasn't changed is our commitment to quality, authenticity, and the 
                joy of sharing good food with good company.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we proudly serve over 100 signature dishes, each one a testament 
                to our dedication to preserving and celebrating India's rich culinary 
                heritage while embracing innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              <span className="text-foreground">What Drives</span>{' '}
              <span className="text-gradient-gold">Us Forward</span>
            </h2>
            <div className="ornament-line-long mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
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

      {/* Team Section */}
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
              <span className="text-foreground">Our Culinary</span>{' '}
              <span className="text-gradient-gold">Masters</span>
            </h2>
            <div className="ornament-line-long mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
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
    </Layout>
  );
};

export default AboutPage;
