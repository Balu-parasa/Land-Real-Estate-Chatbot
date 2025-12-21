import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import PropertyCard from '@/components/PropertyCard';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get('/auth/favorites');
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (propertyId) => {
        try {
            await api.put(`/auth/favorites/${propertyId}`);
            setFavorites(prev => prev.filter(p => p._id !== propertyId));
            toast.success('Removed from favorites');
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('Failed to remove favorite');
        }
    };

    const handleChat = (property) => {
        navigate(`/dashboard/messages?seller=${property.owner}&property=${property._id}`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold">My Favorites</h1>
                        <p className="text-muted-foreground mt-1">Properties you have saved</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (favorites.length === 0) {
        return (
            <DashboardLayout>
                <div className="h-[calc(100vh-8rem)] flex items-center justify-center flex-col bg-card rounded-xl border border-border p-8 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">No Favorites Yet</h1>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You haven't saved any properties yet. Browse our listings to find your perfect land investment.
                    </p>
                    <Button variant="gold" onClick={() => navigate('/dashboard')}>
                        Browse Properties
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold">My Favorites</h1>
                    <p className="text-muted-foreground mt-1">Properties you have saved</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((property, index) => (
                        <div
                            key={property._id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <PropertyCard
                                property={{ ...property, id: property._id }}
                                isFavorite={true}
                                onToggleFavorite={() => handleRemoveFavorite(property._id)}
                                onChat={() => handleChat(property)}
                                onClick={() => navigate(`/property/${property._id}`)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Favorites;
