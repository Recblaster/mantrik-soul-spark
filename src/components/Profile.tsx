import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Edit3, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setDisplayName(data.display_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profile')
        .update({ 
          display_name: displayName.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, display_name: displayName.trim() || null } : null);
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open, user]);

  const getInitials = (email: string, name?: string | null) => {
    if (name && name.trim()) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-white hover:bg-white/10"
        >
          <User className="h-5 w-5 mr-2" />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border-purple-500/20 text-white backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6 text-purple-400" />
            My Profile
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : profile && user ? (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-20 border-2 border-purple-400/50">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-semibold">
                  {getInitials(user.email || '', profile.display_name)}
                </AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="bg-white/10 text-purple-200">
                Member since {format(new Date(profile.created_at), 'MMM yyyy')}
              </Badge>
            </div>

            <Separator className="bg-white/10" />

            {/* Profile Information */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Profile Information</span>
                  {!editing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="h-8 w-8 p-0 hover:bg-white/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={updateProfile}
                        disabled={loading}
                        className="h-8 w-8 p-0 hover:bg-green-500/20"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(false);
                          setDisplayName(profile.display_name || '');
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-purple-300">Display Name</Label>
                  {editing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      className="bg-white/5 border-white/20 text-white placeholder-purple-300"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-white/5 rounded-md border border-white/10">
                      {profile.display_name || 'Not set'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-purple-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm py-2 px-3 bg-white/5 rounded-md border border-white/10">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-purple-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last Updated
                  </Label>
                  <p className="text-sm py-2 px-3 bg-white/5 rounded-md border border-white/10">
                    {format(new Date(profile.updated_at), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-purple-300">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Unable to load profile</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};