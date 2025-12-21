import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { Calendar, CreditCard, Shield, Clock, CheckCircle, Loader2, IndianRupee, Building, FileText } from 'lucide-react';
import { toast } from 'sonner';



const PropertyBookingSection = ({ property }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('site_visit');

  // Form states
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  // Pricing calculations
  const siteVisitFee = 500;
  const advanceBookingPercent = 10;
  const advanceAmount = Math.round(property.price * (advanceBookingPercent / 100));

  const bookingOptions = [
    {
      id: 'site_visit',
      title: 'Site Visit',
      description: 'Book a guided tour of the property',
      amount: siteVisitFee,
      icon: Calendar,
      features: ['Personal guide', 'Document verification', 'Q&A session'],
      badge: 'Popular',
    },
    {
      id: 'advance_booking',
      title: 'Advance Booking',
      description: `Reserve with ${advanceBookingPercent}% token amount`,
      amount: advanceAmount,
      icon: Shield,
      features: ['Property reserved for you', '30-day lock period', 'Refundable*'],
      badge: 'Recommended',
    },
    {
      id: 'full_payment',
      title: 'Full Payment',
      description: 'Complete purchase with full payment',
      amount: property.price,
      icon: Building,
      features: ['Immediate ownership', 'All documents included', 'Priority support'],
      badge: null,
    },
  ];

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to proceed with booking');
      return;
    }

    if (profile?.role !== 'customer') {
      toast.error('Only customers can make bookings');
      return;
    }

    if (activeTab === 'site_visit' && (!bookingDate || !timeSlot)) {
      toast.error('Please select date and time slot for site visit');
      return;
    }

    toast.info('Booking Feature Coming Soon on MERN Stack!');
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-secondary" />
          Book This Property
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none h-auto p-0 bg-muted/50">
            {bookingOptions.map((option) => (
              <TabsTrigger
                key={option.id}
                value={option.id}
                className="py-4 px-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm flex flex-col gap-1"
              >
                <option.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{option.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {bookingOptions.map((option) => (
            <TabsContent key={option.id} value={option.id} className="p-6 m-0 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{option.title}</h3>
                    {option.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {option.amount.toLocaleString('en-IN')}
                  </p>
                  {option.id === 'advance_booking' && (
                    <p className="text-xs text-muted-foreground">
                      {advanceBookingPercent}% of {formatPrice(property.price)}
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm font-medium mb-3">What's included:</p>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Site Visit Form */}
              {option.id === 'site_visit' && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Select Visit Schedule
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Preferred Date
                      </label>
                      <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={minDate}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Time Slot
                      </label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes for advance/full payment */}
              {(option.id === 'advance_booking' || option.id === 'full_payment') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Any specific requirements or questions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={loading || property.status !== 'available'}
                className="w-full h-12 text-base"
                variant="gold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : property.status !== 'available' ? (
                  'Property Not Available'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay {formatPrice(option.amount)}
                  </>
                )}
              </Button>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <Shield className="w-4 h-4" />
                Secured by Stripe. Your payment is 100% safe.
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyBookingSection;
