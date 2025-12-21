import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import PropertyBookingSection from '@/components/PropertyBookingSection';
import EMICalculator from '@/components/EMICalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { MapPin, Maximize, Compass, Trees, Signpost, FileCheck, CheckCircle2, Share2, Heart, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load property details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:pl-2 transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-muted relative group">
                <img
                  src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className={`
                    ${property.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                    ${property.status === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    ${property.status === 'sold' ? 'bg-red-500 hover:bg-red-600' : ''}
                    text-white shadow-lg border-0 px-3 py-1 capitalize
                  `}>
                    {property.status}
                  </Badge>
                </div>
              </div>

              {property.images && property.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`
                        relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
                        ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}
                      `}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(property.price / property.size)} / {property.size_unit}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FeatureItem icon={Maximize} label="Plot Size" value={`${property.size} ${property.size_unit}`} />
              <FeatureItem icon={Compass} label="Facing" value={property.facing_direction || 'N/A'} />
              <FeatureItem icon={Trees} label="Land Type" value={property.land_type || 'Residential'} />
              <FeatureItem icon={Signpost} label="Road Width" value={`${property.road_width_feet || 30} Ft`} />
            </div>

            {/* Description */}
            <Card className="border-0 shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-primary" />
                  Description & Highlights
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {property.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Utilities & Amenities */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Infrastructure & Approvals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CheckItem label="Clear Title & Ownership" checked={property.is_clear_title ?? true} />
                <CheckItem label="Water Connection Available" checked={property.water_available ?? true} />
                <CheckItem label="Electricity Connection" checked={property.electricity_available ?? true} />
                <CheckItem label="DTCP / RERA Approved" checked={property.is_rera_approved ?? false} />
                <CheckItem label="Bank Loan Available" checked={property.has_loan ?? true} />
                <CheckItem label="Corner Bit" checked={false} />
              </div>
            </div>

            {/* EMI Calculator Section */}
            <div className="pt-6">
              <h3 className="text-xl font-serif font-bold mb-4">Mortgage Calculator</h3>
              <EMICalculator defaultPrice={property.price} />
            </div>
          </div>

          {/* Right Column - Booking & Contact */}
          <div className="lg:col-span-1 space-y-6">
            <PropertyBookingSection property={property} />

            {/* Seller Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {(property.owner)?.full_name?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-lg">{(property.owner)?.full_name || 'Property Owner'}</p>
                    <p className="text-sm text-muted-foreground">Certified Seller</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => {
                      if (!property.owner) {
                        toast.error("Seller information missing");
                        return;
                      }
                      navigate('/dashboard/messages', {
                        state: {
                          selectedContactId: property.owner._id,
                          contactName: property.owner.full_name,
                          initialMessage: `Hi, I am interested in your property "${property.title}" in ${property.location}. Is it still available?`
                        }
                      });
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat with Seller
                  </Button>

                  <div className="space-y-2 pt-2 border-t text-sm">
                    {property.owner?.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{property.owner.phone}</span>
                      </div>
                    )}
                    {property.owner?.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-4 h-4 flex items-center justify-center">@</div>
                        <span>{property.owner.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Similar Properties Section */}
      <section className="container mx-auto px-4 py-8 mb-20 max-w-7xl">
        <h2 className="text-2xl font-serif font-bold mb-6">Similar Properties You Might Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-muted/30 rounded-xl text-center text-muted-foreground border border-dashed">
            <p>Explore more properties in <span className="font-semibold text-primary">{property.city || property.location}</span> on the dashboard.</p>
            <Button variant="link" onClick={() => navigate('/dashboard')} className="mt-2">View All Properties</Button>
          </div>
        </div>
      </section>

    </div>
  );
};

const FeatureItem = ({ icon: Icon, label, value }) => (
  <div className="p-4 rounded-xl bg-card border shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
    <Icon className="w-6 h-6 text-primary mb-2" />
    <span className="text-sm text-muted-foreground mb-1">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

const CheckItem = ({ label, checked }) => (
  <div className="flex items-center p-3 rounded-lg bg-card border">
    <div className={`mr-3 p-1 rounded-full ${checked ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-muted dark:text-muted-foreground'}`}>
      <CheckCircle2 className="w-4 h-4" />
    </div>
    <span className={checked ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
  </div>
);

export default LandDetails;
