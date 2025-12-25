import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  BarChart3,
  Image,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Admin sub-pages
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminMenu from './AdminMenu';
import AdminBookings from './AdminBookings';
import AdminGallery from './AdminGallery';
import AdminMessages from './AdminMessages';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/orders', icon: ChefHat, label: 'Orders' },
  { href: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/gallery', icon: Image, label: 'Gallery' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/users', icon: Users, label: 'Users', superAdminOnly: true },
  { href: '/admin/settings', icon: Settings, label: 'Settings', superAdminOnly: true },
];

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isSuperAdmin, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredLinks = sidebarLinks.filter(
    (link) => !link.superAdminOnly || isSuperAdmin
  );

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <span className="text-xl">🍽️</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-heading font-bold text-gradient-gold">
                  Admin Panel
                </span>
                <span className="text-xs text-muted-foreground">Hotel Govindam</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive(link.href, link.exact)
                    ? 'bg-primary text-primary-foreground shadow-gold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-heading font-semibold text-foreground">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">View Site</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
