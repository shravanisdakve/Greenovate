import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Home, Info, Mail, LogIn, UserPlus, LogOut, Settings, Menu, X } from "lucide-react";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAdminAccess = () => {
    // Hidden admin access: Hold Ctrl+Shift and click the logo
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    }
  };

  return (
    <>
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleAdminAccess}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
                  handleAdminAccess();
                }
              }}
            >
              <Leaf className="h-8 w-8 text-education-accent" />
              <h1 className="text-2xl font-bold">Greenovate</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-education-accent transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/classes" className="flex items-center gap-2 hover:text-education-accent transition-colors">
                <Leaf className="h-4 w-4" />
                Classes
              </Link>
              <Link to="/about" className="flex items-center gap-2 hover:text-education-accent transition-colors">
                <Info className="h-4 w-4" />
                About
              </Link>
              <Link to="/contact" className="flex items-center gap-2 hover:text-education-accent transition-colors">
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </nav>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {userRole === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin-dashboard')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  {userRole === 'teacher' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/teacher-dashboard')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  {userRole === 'student' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/student-dashboard')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAuthTab('login');
                      setAuthDialogOpen(true);
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAuthTab('signup');
                      setAuthDialogOpen(true);
                    }}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20">
              <nav className="flex flex-col gap-4 mt-4">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 hover:text-education-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link 
                  to="/classes" 
                  className="flex items-center gap-2 hover:text-education-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Leaf className="h-4 w-4" />
                  Classes
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center gap-2 hover:text-education-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="h-4 w-4" />
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center gap-2 hover:text-education-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </Link>
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
                  {user ? (
                    <>
                      {userRole === 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate('/admin-dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Button>
                      )}
                      {userRole === 'teacher' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate('/teacher-dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      )}
                      {userRole === 'student' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate('/student-dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAuthTab('login');
                          setAuthDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary justify-start"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setAuthTab('signup');
                          setAuthDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-white text-primary hover:bg-white/90 justify-start"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        initialTab={authTab}
      />
    </>
  );
};

export default Header;