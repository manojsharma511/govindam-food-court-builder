import { useState, useEffect } from 'react';
import { BarChart3, ChefHat, Calendar, DollarSign, Loader2, Users } from 'lucide-react';
import api from '@/lib/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics/overview');
        setStats(data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ChefHat },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: 'Bookings', value: stats.totalBookings.toString(), icon: Calendar },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users },
  ];

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
