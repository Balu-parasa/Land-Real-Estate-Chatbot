import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MapPin, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const MyProperties = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (user) {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        try {
            const { data } = await api.get('/properties/myproperties');
            setProperties(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = p.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

        const price = p.price || 0;
        const matchesPriceMin = priceMin === '' || price >= Number(priceMin);
        const matchesPriceMax = priceMax === '' || price <= Number(priceMax);

        return matchesSearch && matchesLocation && matchesStatus && matchesPriceMin && matchesPriceMax;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold">My Properties</h1>
                        <p className="text-muted-foreground mt-1">Manage and edit your property listings</p>
                    </div>
                    <Button variant="gold" onClick={() => navigate('/admin/add-property')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                    </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-lg shadow-sm border">
                    {/* Search Title */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    {/* Location Filter */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by location..."
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    {/* Price Range */}
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min Price"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            className="h-10"
                        />
                        <Input
                            type="number"
                            placeholder="Max Price"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            className="h-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full h-10">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-xl">
                        <p className="text-muted-foreground">No properties found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <Card
                                key={property._id || property.id}
                                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
                                onClick={() => navigate(`/admin/properties/${property._id || property.id}`)}
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'}
                                        alt={property.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge variant={property.status === 'available' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                            {property.status}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold truncate mb-1">{property.title}</h3>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                        <span>{property.size} {property.size_unit}</span>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">Edit Details</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyProperties;
