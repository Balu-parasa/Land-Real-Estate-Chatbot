
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, MapPin, ArrowRight, Loader2, IndianRupee } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I'm your AI Real Estate Assistant. I can help you find properties based on your budget, preferred location, or land type. Try asking something like "Find land in Austin under $500k".`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai', { message: text });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response,
        properties: data.properties || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: "I'm having trouble connecting to the server right now. Please try again later."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Plots under $100k",
    "Agricultural land in Austin",
    "Commercial plots under $500k",
    "Residential land in Portland",
    "Cheapest options"
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-6rem)] flex flex-col max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Bot className="w-8 h-8 text-secondary" />
              AI Property Assistant
            </h1>
            <p className="text-muted-foreground">Ask me anything about finding your dream property</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])} className="text-muted-foreground hover:text-red-500">
            Clear Chat
          </Button>
        </div>

        <Card className="flex-1 border shadow-xl overflow-hidden flex flex-col bg-card">
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="space-y-6 pb-4 bg-muted/10 min-h-full p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                    ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'gradient-gold'}
                  `}>
                    {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-dark" />}
                  </div>

                  <div className={`space-y-2 max-w-[85%] lg:max-w-[75%]`}>
                    <div className={`
                      p-3 rounded-2xl shadow-sm text-sm break-words
                      ${msg.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-card border rounded-tl-none'}
                    `}>
                      {msg.text}
                    </div>

                    {msg.properties && msg.properties.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {msg.properties.map(property => (
                          <div
                            key={property._id}
                            onClick={() => navigate(`/property/${property._id}`)}
                            className="bg-white p-3 rounded-xl border border-border/50 hover:border-secondary/50 cursor-pointer transition-all hover:shadow-md group"
                          >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-muted relative">
                              <img
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full capitalize">
                                {property.status}
                              </div>
                            </div>
                            <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-secondary transition-colors">{property.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mb-2 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {property.location}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-secondary text-sm">
                                {formatPrice(property.price)}
                              </span>
                              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                                {property.size} {property.size_unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
                    <Bot className="w-4 h-4 text-slate-dark" />
                  </div>
                  <div className="bg-card p-3 rounded-2xl rounded-tl-sm border shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-card border-t">
            {messages.length === 1 && (
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium hover:bg-secondary/10 hover:text-secondary transition-colors border border-transparent hover:border-secondary/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
