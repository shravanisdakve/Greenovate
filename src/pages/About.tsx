import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Target, Award, BookOpen, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Leaf className="h-16 w-16 text-education-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-education-text mb-4">About Greenovate</h1>
            <p className="text-xl text-muted-foreground">
              Empowering the next generation through gamified environmental education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-education-primary/20 shadow-lg">
              <CardHeader>
                <Target className="h-12 w-12 text-education-primary mb-4" />
                <CardTitle className="text-education-text">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To revolutionize environmental education by making learning interactive, engaging, 
                  and accessible to students across all educational levels. We believe in nurturing 
                  environmentally conscious global citizens through innovative technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-education-primary/20 shadow-lg">
              <CardHeader>
                <Globe className="h-12 w-12 text-education-primary mb-4" />
                <CardTitle className="text-education-text">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A world where every student has access to quality environmental education, 
                  fostering a generation that understands and actively contributes to 
                  sustainability and environmental conservation.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-education-primary/20 shadow-lg mb-12">
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-education-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-education-text">What We Offer</CardTitle>
              <CardDescription>Comprehensive environmental education solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-education-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-education-text mb-2">Multi-Level Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailored content for Primary, Middle, Secondary, and Higher Secondary levels
                  </p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-education-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-education-text mb-2">Gamified Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive games that make learning fun and memorable
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-education-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-education-text mb-2">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor learning progress with detailed analytics and achievements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-education-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-education-text text-center">Why Choose Greenovate?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-education-primary/10 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-education-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-education-text mb-2">Research-Based Curriculum</h4>
                    <p className="text-muted-foreground text-sm">
                      Our content is developed in collaboration with environmental scientists and educators
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-education-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-education-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-education-text mb-2">Adaptive Learning</h4>
                    <p className="text-muted-foreground text-sm">
                      Personalized learning paths that adapt to individual student needs and progress
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-education-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-education-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-education-text mb-2">Real-World Impact</h4>
                    <p className="text-muted-foreground text-sm">
                      Connect classroom learning with real-world environmental challenges and solutions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;