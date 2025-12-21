import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Users, Shield, ArrowRight, Star, MessageCircle, Bot } from 'lucide-react';

const Index = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [profile, loading, navigate]);

  const features = [
    {
      icon: Building2,
      title: 'Premium Listings',
      description: 'Browse through curated land properties with detailed information and high-quality images.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Chat',
      description: 'Connect directly with property sellers through our real-time messaging system.',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get instant answers about properties, documentation, and pricing with our AI chatbot.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with enterprise-grade security.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Investor',
      content: 'Found my dream land investment within days. The AI assistant helped me understand all the documentation requirements.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Land Developer',
      content: 'As a seller, this platform has transformed how I connect with potential buyers. The chat feature is incredible.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'First-time Buyer',
      content: 'The search filters and detailed property information made my decision so much easier. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <MapPin className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold">RealEstateLandChat</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 animate-fade-in">
              Find Your Perfect
              <span className="text-gradient-gold block">Land Investment</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Connect with sellers, explore premium properties, and make informed decisions with our AI-powered real estate platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Link to="/auth">
                <Button variant="gold" size="xl">
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero-outline" size="xl">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Properties Listed' },
              { value: '1,200+', label: 'Happy Customers' },
              { value: '$50M+', label: 'Transaction Value' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with real estate expertise to deliver the best property search experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card shadow-md hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect property through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-2xl bg-card shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary relative overflow-hidden">
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Ready to Find Your Perfect Land?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of property seekers and sellers on our platform today.
          </p>
          <Link to="/auth">
            <Button variant="gold" size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">RealEstateLandChat</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 RealEstateLandChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
