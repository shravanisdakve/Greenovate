import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthDialog = ({ isOpen, onClose, initialTab = 'login' }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const { signIn, signUp } = useAuth();

  // Handle admin login separately
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Check for hardcoded admin credentials
    if (email === 'admin123' && password === 'admin123') {
      try {
        // Try to create admin user using edge function first
        const { data: setupResult } = await supabase.functions.invoke('setup-admin', {
          method: 'POST'
        });
        
        if (setupResult?.success) {
          console.log('Admin user setup successful');
        }
        
        // Then sign in normally
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin123@greenovate.com',
          password: 'admin123'
        });
        
        if (signInError && !signInError.message.includes('Invalid login credentials')) {
          // If signin fails, try the manual setup approach
          const { data: adminProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'admin123@greenovate.com')
            .maybeSingle();
            
          if (!adminProfile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: '00000000-0000-0000-0000-000000000001',
                email: 'admin123@greenovate.com',
                full_name: 'System Administrator',
                role: 'admin'
              });
              
            if (insertError) {
              console.error('Error creating admin profile:', insertError);
            }
          }
          
          // Try to sign up admin user in auth if doesn't exist
          await supabase.auth.signUp({
            email: 'admin123@greenovate.com',
            password: 'admin123',
            options: {
              data: { 
                full_name: 'System Administrator',
                role: 'admin'
              }
            }
          });
          
          // Try signin again
          await supabase.auth.signInWithPassword({
            email: 'admin123@greenovate.com',
            password: 'admin123'
          });
        }
        
        toast.success('Admin login successful!');
        onClose();
      } catch (error: any) {
        toast.error('Admin login failed');
        console.error('Admin login error:', error);
      }
    } else {
      toast.error('Invalid admin credentials');
    }
    
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes('email_not_confirmed')) {
        toast.error('Please check your email and click the confirmation link before logging in.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Make sure you have confirmed your email.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Welcome back!');
      onClose();
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as 'teacher' | 'student';
    const schoolName = formData.get('schoolName') as string;
    const className = formData.get('className') as string;

    const { error } = await signUp(email, password, {
      full_name: fullName,
      role,
      school_name: schoolName || undefined,
      class_name: className || undefined
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists. Please try logging in instead.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created successfully! Please check your email and click the confirmation link to activate your account.');
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-education-primary">Welcome to Greenovate</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={adminMode ? 'admin' : initialTab} className="w-full">
          <TabsList className={`grid w-full ${adminMode ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            {adminMode && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-education-primary hover:bg-education-primary/90"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    name="password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  name="schoolName"
                  type="text"
                  placeholder="Enter your school name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-name">Class/Grade (Students only)</Label>
                <Input
                  id="class-name"
                  name="className"
                  type="text"
                  placeholder="Enter your class/grade"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-education-primary hover:bg-education-primary/90"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
          
          {adminMode && (
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin ID</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="text"
                    placeholder="Enter admin ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Admin Login'}
                </Button>
              </form>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdminMode(!adminMode)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {adminMode ? 'Hide Admin' : 'Admin Access'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};