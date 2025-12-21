import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, User, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-gold flex items-center justify-center">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-secondary-foreground" />
                    </div>
                    <span className="text-lg md:text-xl font-serif font-bold truncate">RealEstateLandChat</span>
                </Link>

                <div className="flex items-center gap-2 md:gap-4">


                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-9 w-9 border border-border">
                                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                                        <AvatarFallback>{getInitials(profile?.full_name || 'U')}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        {profile?.full_name && (
                                            <p className="font-medium">{profile.full_name}</p>
                                        )}
                                        {profile?.email && (
                                            <p className="w-[200px] truncate text-xs text-muted-foreground">{profile.email}</p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Properties</span>
                                </DropdownMenuItem>
                                {location.pathname !== '/settings' && location.pathname !== '/admin/settings' && (
                                    <DropdownMenuItem onClick={() => navigate(profile?.role === 'admin' ? '/admin/settings' : '/settings')}>
                                        {profile?.role === 'admin' ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/auth">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link to="/auth">
                                <Button variant="gold" size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
