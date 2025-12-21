import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    city: '',
    state: '',
    price: '',
    size: '',
    size_unit: 'acres',
    land_type: 'Residential',
    facing_direction: 'North',
    road_width_feet: '',
    description: '',
    images: '',
    is_clear_title: false,
    water_available: false,
    electricity_available: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const images = form.images.split(',').map(url => url.trim()).filter(Boolean);

    try {
      await api.post('/properties', {
        ...form,
        price: parseFloat(form.price),
        size: parseFloat(form.size),
        road_width_feet: parseFloat(form.road_width_feet) || 0,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      });
      toast.success('Property added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Add New Property</h1>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="land_type">Land Type</Label>
                  <Select value={form.land_type} onValueChange={(v) => setForm({ ...form, land_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facing">Facing Direction</Label>
                  <Select value={form.facing_direction} onValueChange={(v) => setForm({ ...form, facing_direction: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="road_width">Road Width (ft)</Label>
                  <Input id="road_width" type="number" value={form.road_width_feet} onChange={(e) => setForm({ ...form, road_width_feet: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <div className="flex gap-2">
                    <Input id="size" type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={form.size_unit} onValueChange={(v) => setForm({ ...form, size_unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acres">Acres</SelectItem>
                      <SelectItem value="sq. yards">Sq. Yards</SelectItem>
                      <SelectItem value="hectares">Hectares</SelectItem>
                      <SelectItem value="gunthas">Gunthas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_clear_title} onChange={(e) => setForm({ ...form, is_clear_title: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Clear Title</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.water_available} onChange={(e) => setForm({ ...form, water_available: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Water Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.electricity_available} onChange={(e) => setForm({ ...form, electricity_available: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm">Electricity</span>
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input id="images" placeholder="https://..." value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
                {form.images && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {form.images.split(',').map((url, i) => (
                      url.trim() && (
                        <img key={i} src={url.trim()} alt="Preview" className="h-20 w-20 object-cover rounded-md border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      )
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" variant="gold" disabled={loading}>{loading ? 'Adding...' : 'Add Property'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
