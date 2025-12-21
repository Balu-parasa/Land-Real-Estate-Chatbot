import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize, Heart, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';



const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  onChat,
  onClick,
}) => {
  const statusColors = {
    available: 'bg-green-500/10 text-green-600 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    sold: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <Card 
      className="group overflow-hidden hover-lift cursor-pointer border-0 shadow-md hover:shadow-elegant"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge className={`${statusColors[property.status]} border`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-muted-foreground hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-2xl font-bold text-white font-serif">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Maximize className="w-4 h-4" />
            <span className="text-sm">
              {property.size} {property.size_unit}
            </span>
          </div>
          
          {onChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onChat();
              }}
              className="text-secondary hover:text-secondary hover:bg-secondary/10"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
