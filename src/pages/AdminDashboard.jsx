import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, Building2, Users, MessageSquare, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    totalInquiries: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you might have a dedicated dashboard stats endpoint
      // For now, we'll fetch properties and calculate
      const { data: properties } = await api.get('/properties/myproperties');

      setRecentProperties(properties.slice(0, 5));
      setStats({
        totalProperties: properties.length,
        activeListings: properties.filter((p) => p.status === 'available').length,
        soldProperties: properties.filter((p) => p.status === 'sold').length,
        totalInquiries: 0 // Placeholder until messages API is ready
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.full_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properties"
            value={loading ? '-' : stats.totalProperties}
            icon={Building2}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Listings"
            value={loading ? '-' : stats.activeListings}
            icon={LayoutDashboard}
            color="bg-blue-500"
          />
          <StatCard
            title="Properties Sold"
            value={loading ? '-' : stats.soldProperties}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <StatCard
            title="Total Inquiries"
            value={loading ? '-' : stats.totalInquiries}
            icon={MessageSquare}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Properties</h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={() => navigate('/admin/properties')}>
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property._id || property.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => navigate(`/admin/properties/${property._id || property.id}`)}
                  >
                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200'}
                        alt={property.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{property.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(property.price)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${property.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border-dashed border-2">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No properties added yet</p>
                <Button variant="link" onClick={() => navigate('/admin/add-property')}>Add your first property</Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="divide-y">
                  <button
                    onClick={() => navigate('/admin/add-property')}
                    className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Add New Property</p>
                      <p className="text-xs text-muted-foreground">List a new land for sale</p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/admin/messages')}
                    className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Check Messages</p>
                      <p className="text-xs text-muted-foreground">Read new inquiries</p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/admin/settings')}
                    className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Settings</p>
                      <p className="text-xs text-muted-foreground">Manage profile and preferences</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
