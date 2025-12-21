import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    fetchProperties();

  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.favorites) {
      setFavorites(user.favorites);
    }
  }, [user]);

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    // Optimistic update
    const isCurrentlyFavorite = favorites.includes(propertyId);
    setFavorites(prev =>
      isCurrentlyFavorite
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );

    try {
      await api.put(`/auth/favorites/${propertyId}`);
      toast.success(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      // Revert on error
      setFavorites(prev =>
        isCurrentlyFavorite
          ? [...prev, propertyId]
          : prev.filter(id => id !== propertyId)
      );
    }
  };

  const handleChat = (property) => {
    navigate(`/dashboard/messages?seller=${property.owner}&property=${property._id}`);
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === 'under50L') matchesPrice = property.price < 5000000;
    else if (priceFilter === '50L-1Cr') matchesPrice = property.price >= 5000000 && property.price <= 10000000;
    else if (priceFilter === '1Cr-5Cr') matchesPrice = property.price >= 10000000 && property.price <= 50000000;
    else if (priceFilter === 'above5Cr') matchesPrice = property.price > 50000000;

    let matchesLocation = true;
    if (locationFilter !== 'all') {
      matchesLocation = property.location.toLowerCase().includes(locationFilter.toLowerCase());
    }

    return matchesSearch && matchesPrice && matchesLocation;
  });

  const uniqueLocations = [...new Set(properties.map(p => p.location.split(',')[0].trim()))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold">Discover Properties</h1>
          <p className="text-muted-foreground mt-1">Find your perfect land investment</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under50L">Under ₹50 Lakhs</SelectItem>
              <SelectItem value="50L-1Cr">₹50 Lakhs - ₹1 Cr</SelectItem>
              <SelectItem value="1Cr-5Cr">₹1 Cr - ₹5 Cr</SelectItem>
              <SelectItem value="above5Cr">Above ₹5 Cr</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <div
                key={property._id || property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard
                  property={{ ...property, id: property._id }} // Adapt Mongo _id to id
                  isFavorite={favorites.includes(property._id || property.id)}
                  onToggleFavorite={() => toggleFavorite(property._id || property.id)}
                  onChat={() => handleChat(property)}
                  onClick={() => navigate(`/property/${property._id || property.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
