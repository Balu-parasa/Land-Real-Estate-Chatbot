import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MoreVertical, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch conversations on load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll for new messages if active conversation
  useEffect(() => {
    let interval;
    if (activeConversation) {
      loadMessages(activeConversation.id);
      interval = setInterval(() => {
        loadMessages(activeConversation.id, true); // true = silent refresh
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data.map(c => ({
        ...c,
        time: new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
      setLoading(false);

      // Handle redirect from LandDetails
      if (location.state?.selectedContactId) {
        const contactId = location.state.selectedContactId;
        const initialMessage = location.state.initialMessage;

        // Check if conversation already exists
        const existingConv = data.find(c => c.id === contactId);
        if (existingConv) {
          setActiveConversation(existingConv);
        } else {
          // If fresh conversation
          const newConv = {
            id: contactId,
            name: location.state.contactName || 'Seller',
            avatar: '',
            messages: []
          };
          setConversations(prev => [newConv, ...prev]);
          setActiveConversation(newConv);
          if (initialMessage) setMessageInput(initialMessage);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  const loadMessages = async (contactId, silent = false) => {
    try {
      const { data } = await api.get(`/chat/${contactId}`);
      setActiveConversation(prev => ({
        ...prev,
        messages: data.map(m => ({
          id: m._id,
          text: m.content,
          sender: m.sender === user?._id ? 'me' : 'them',
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      }));
    } catch (error) {
      console.error("Error loading messages", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    try {
      await api.post('/chat/send', {
        receiverId: activeConversation.id,
        content: messageInput
      });
      setMessageInput('');
      loadMessages(activeConversation.id); // Reload messages immediately
      fetchConversations(); // Update conversation list (last message)
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClearChat = async () => {
    if (!activeConversation) return;
    if (!window.confirm("Are you sure you want to clear this chat? This cannot be undone.")) return;

    try {
      await api.delete(`/chat/${activeConversation.id}`);
      setActiveConversation(prev => ({ ...prev, messages: [] }));
      fetchConversations();
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-4">
        {/* Sidebar - Conversation List */}
        <Card className="w-80 flex flex-col border-0 shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-xl mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 bg-muted/50" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveConversation(chat)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${activeConversation?.id === chat.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground flex items-center justify-center rounded-full border-2 border-background">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium truncate ${activeConversation?.id === chat.id ? 'text-primary' : ''}`}>
                        {chat.name}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || 'Start a conversation'}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col border-0 shadow-sm overflow-hidden">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-card z-10">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeConversation.avatar} />
                    <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeConversation.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleClearChat} className="text-destructive font-medium">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages List */}
              <ScrollArea className="flex-1 p-4 bg-muted/30">
                <div className="space-y-4">
                  {activeConversation.messages?.length > 0 ? (
                    activeConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.sender === 'me'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card border rounded-tl-none'
                            }`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <span
                            className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'
                              }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground text-sm mt-10">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 bg-card border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
              <p>Choose a contact from the left to start chatting.</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
