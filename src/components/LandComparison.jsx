import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, Minus, Scale } from 'lucide-react';
import { formatPrice } from '@/lib/utils';



const LandComparison = ({ properties, onRemove, onClose }) => {
  const features = [
    { key: 'price', label: 'Price', format: (v) => formatPrice(v) },
    { key: 'size', label: 'Size', format: (v, p) => `${v} ${p.size_unit}` },
    { key: 'land_type', label: 'Land Type', format: (v) => v || '-' },
    { key: 'facing_direction', label: 'Facing', format: (v) => v || '-' },
    { key: 'road_width_feet', label: 'Road Width', format: (v) => v ? `${v} ft` : '-' },
    { key: 'zoning', label: 'Zoning', format: (v) => v || '-' },
    { key: 'is_clear_title', label: 'Clear Title', format: (v) => v },
    { key: 'is_rera_approved', label: 'RERA Approved', format: (v) => v },
    { key: 'water_available', label: 'Water', format: (v) => v },
    { key: 'electricity_available', label: 'Electricity', format: (v) => v },
    { key: 'drainage', label: 'Drainage', format: (v) => v },
    { key: 'distance_to_main_road_km', label: 'Distance to Main Road', format: (v) => v ? `${v} km` : '-' },
    { key: 'distance_to_school_km', label: 'Distance to School', format: (v) => v ? `${v} km` : '-' },
    { key: 'distance_to_hospital_km', label: 'Distance to Hospital', format: (v) => v ? `${v} km` : '-' },
  ];

  const renderValue = (value, format, property) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-400" />
      );
    }
    return <span className="text-sm">{format(value, property)}</span>;
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-xl fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-hidden animate-slide-up">
      <CardHeader className="pb-2 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-secondary" />
            Compare Properties ({properties.length}/3)
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(70vh-80px)] p-0">
        <table className="w-full">
          <thead className="sticky top-0 bg-background z-10">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground w-40">Feature</th>
              {properties.map((p) => (
                <th key={p.id} className="p-4 min-w-48">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200'}
                      alt={p.title}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <p className="font-semibold text-sm text-center line-clamp-2">{p.title}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(p.id)}
                      className="text-xs text-muted-foreground"
                    >
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={feature.key} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                <td className="p-4 font-medium text-sm">{feature.label}</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    {renderValue((p)[feature.key], feature.format, p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default LandComparison;
