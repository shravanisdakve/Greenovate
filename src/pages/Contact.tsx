import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setLoading(false);
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <MessageSquare className="h-16 w-16 text-education-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-education-text mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team to learn more about Greenovate
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="border-education-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-education-text">Get in Touch</CardTitle>
                  <CardDescription>
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Your first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Your last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role</Label>
                      <Select name="role" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="administrator">School Administrator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-education-primary hover:bg-education-primary/90"
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-education-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-education-text">Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-education-primary/10 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-education-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-education-text">Email</h3>
                      <p className="text-muted-foreground">adi31082004@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-education-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-education-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-education-text">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-education-primary/10 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-education-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-education-text">Address</h3>
                      <p className="text-muted-foreground">
                        123 Green Education St.<br />
                        Eco City, EC 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-education-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-education-text">Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="text-education-text">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="text-education-text">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-education-text">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-education-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-education-text">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-education-text mb-1">How do I access the platform?</h4>
                    <p className="text-sm text-muted-foreground">
                      Simply sign up for a free account and start exploring our courses immediately.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-education-text mb-1">Is there a mobile app?</h4>
                    <p className="text-sm text-muted-foreground">
                      Our platform is fully responsive and works great on all devices.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-education-text mb-1">Can schools get bulk access?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer special pricing for schools and educational institutions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;