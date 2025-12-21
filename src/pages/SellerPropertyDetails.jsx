
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize, Edit, Trash2, ArrowLeft, Ruler } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const SellerPropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const { data } = await api.get(`/properties/${id}`);
            setProperty(data);
        } catch (error) {
            console.error('Error fetching property:', error);
            toast.error('Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/properties/${id}`);
            toast.success('Property deleted successfully');
            navigate('/admin/properties');
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!property) return <div>Property not found</div>;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate('/admin/properties')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold">{property.title}</h1>
                        <div className="flex items-center text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.location}, {property.city}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate(`/admin/edit-property/${id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Section */}
                    <Card className="overflow-hidden border-0 shadow-lg">
                        <div className="aspect-video relative">
                            <img
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                                <Badge variant={property.status === 'available' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                                    {property.status}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Details Section */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Price</h3>
                                <div className="text-3xl font-bold text-secondary flex items-center">
                                    {formatPrice(property.price)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Land Size</h3>
                                    <div className="flex items-center text-lg font-semibold">
                                        <Ruler className="w-4 h-4 mr-2 text-muted-foreground" />
                                        {property.size} {property.size_unit}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                                    <div className="text-lg font-semibold capitalize">
                                        {property.land_type}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {property.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SellerPropertyDetails;
