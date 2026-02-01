import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { useSiteConfig } from '@/contexts/SiteConfigContext';

export const Footer = () => {
  const { settings } = useSiteConfig();
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold overflow-hidden">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🍽️</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-bold text-gradient-gold">
                  {settings?.siteName || 'Hotel Govindam'}
                </span>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">
                  Food Court
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings?.footerDescription || settings?.description || 'Experience the finest Indian cuisine crafted with love and tradition.'}
            </p>
            <div className="flex gap-4">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Facebook className="w-5 h-5" /></a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Instagram className="w-5 h-5" /></a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Twitter className="w-5 h-5" /></a>
              )}
              {settings?.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Youtube className="w-5 h-5" /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Our Menu', href: '/menu' },
                { label: 'About Us', href: '/about' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Book a Table', href: '/booking' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-primary">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm break-words">
                  {settings?.address || '123 Food Street, Sector 15, Gandhinagar, Gujarat 382015'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{settings?.contactPhone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{settings?.contactEmail || 'info@hotelgovindam.com'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground text-sm">
                  {settings?.businessHours ? (
                    typeof settings.businessHours === 'string' ? (
                      <p>{settings.businessHours}</p>
                    ) : (
                      Object.entries(settings.businessHours || {}).slice(0, 1).map(([day, time]) => (
                        <p key={day}><span className="capitalize">{day}</span>: {time} <span className="text-xs ml-1">(See contact page for all)</span></p>
                      ))
                    )
                  ) : (
                    <p>Mon - Sun: 10:00 AM - 10:00 PM</p>
                  )}
                  <p className="text-primary text-xs mt-1">Open all days</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-primary">Newsletter</h3>
            <p className="text-muted-foreground text-sm">
              {settings?.newsletterText || 'Subscribe for exclusive offers, new dishes, and special events.'}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-gold text-primary-foreground font-semibold rounded-lg hover:shadow-gold transition-all duration-300 text-sm uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>{settings?.copyrightText || '© 2024 Hotel Govindam Food Court. All rights reserved.'}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
