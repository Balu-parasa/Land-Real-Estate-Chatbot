import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Profile from './Profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Lock, Shield, User, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <main className="container mx-auto px-4 py-8 mt-16 max-w-5xl">
                <h1 className="text-3xl font-serif font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground mb-8">Manage your account preferences and profile.</p>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px]">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab - Reusing the existing Profile component logic but wrapped neatly */}
                    <TabsContent value="profile" className="animate-in fade-in-50 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>This is how others will see you on the site.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Profile isEmbedded={true} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account" className="animate-in fade-in-50 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>Manage your password and security settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Change Password
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                    </div>
                                    <Button onClick={() => toast.success("Password update simulated")}>Update Password</Button>
                                </div>

                                <div className="pt-6 border-t">
                                    <h3 className="text-sm font-medium flex items-center gap-2 text-red-600 mb-4">
                                        <Shield className="w-4 h-4" /> Danger Zone
                                    </h3>
                                    <Button variant="destructive">Delete Account</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="animate-in fade-in-50 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Choose what you want to be notified about.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">New Property Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Get notified when new properties match your interests.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Marketing Emails</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about new features and special offers.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="animate-in fade-in-50 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize the look and feel of the application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Toggle dark mode on or off.</p>
                                    </div>
                                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    );
};

export default Settings;
