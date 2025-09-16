import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { AuthDialog } from '@/components/AuthDialog';

export const Login = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(true);

  useEffect(() => {
    if (user && userProfile) {
      // Redirect based on user role
      switch (userProfile.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, userProfile, navigate]);

  const handleClose = () => {
    setIsAuthOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={handleClose} 
        initialTab="login"
      />
    </div>
  );
};

export default Login;