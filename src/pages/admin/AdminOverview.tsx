import { BarChart3, ChefHat, Calendar, DollarSign } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { label: 'Total Orders', value: '156', icon: ChefHat, change: '+12%' },
    { label: 'Revenue', value: '₹45,230', icon: DollarSign, change: '+8%' },
    { label: 'Bookings', value: '24', icon: Calendar, change: '+5%' },
    { label: 'Active Items', value: '48', icon: BarChart3, change: '0%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-primary" />
              <span className="text-sm text-green-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-heading font-semibold mb-4">Recent Activity</h3>
        <p className="text-muted-foreground">Dashboard analytics coming soon...</p>
      </div>
    </div>
  );
};

export default AdminOverview;
