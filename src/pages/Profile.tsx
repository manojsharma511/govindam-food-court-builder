import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X, ChefHat, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
  });

  const handleSave = () => {
    // TODO: Implement profile update via Supabase
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <section className="py-32 min-h-screen bg-gradient-hero pattern-overlay">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">My Account</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Your <span className="text-gradient-gold">Profile</span>
              </h1>
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="text-4xl">👤</span>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 text-primary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground ${
                      !isEditing ? 'cursor-not-allowed opacity-70' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground ${
                      !isEditing ? 'cursor-not-allowed opacity-70' : ''
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="hero" className="flex-1 gap-2" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/orders">
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                  <ChefHat className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    My Orders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View your order history and track current orders
                  </p>
                </div>
              </Link>

              <Link to="/booking">
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                  <Calendar className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    My Bookings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your table and event reservations
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
