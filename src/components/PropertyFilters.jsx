import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, SlidersHorizontal } from 'lucide-react';



const PropertyFiltersComponent = ({ filters, onFilterChange, onClear }) => {
  const landTypes = ['Residential', 'Commercial', 'Agricultural', 'Industrial'];
  const facingDirections = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
  const statuses = ['available', 'pending', 'sold'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'views', label: 'Most Viewed' },
  ];

  const updateFilter = (key: keyof Filters, value) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  return (
    <Card className="border-0 shadow-md mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold">Filters & Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">City</Label>
            <Input
              placeholder="Enter city"
              value={filters.city || ''}
              onChange={(e) => updateFilter('city', e.target.value)}
            />
          </div>

          {/* Sort */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Sort By</Label>
            <Select value={filters.sortBy || 'newest'} onValueChange={(v) => updateFilter('sortBy', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Min Price (₹)</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Max Price (₹)</Label>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Area Range */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Min Area</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minArea || ''}
              onChange={(e) => updateFilter('minArea', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Max Area</Label>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxArea || ''}
              onChange={(e) => updateFilter('maxArea', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Land Type */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Land Type</Label>
            <Select value={filters.landType || ''} onValueChange={(v) => updateFilter('landType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {landTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Facing */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Facing Direction</Label>
            <Select value={filters.facingDirection || ''} onValueChange={(v) => updateFilter('facingDirection', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Direction</SelectItem>
                {facingDirections.map((dir) => (
                  <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select value={filters.status || ''} onValueChange={(v) => updateFilter('status', v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <Button variant="outline" onClick={onClear} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFiltersComponent;
