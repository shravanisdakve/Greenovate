import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-education-text mb-6">
              Welcome to <span className="text-primary">Greenovate</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering students with innovative educational technology and personalized learning experiences for every grade level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/classes">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Classes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-education-text mb-4">
                Why Choose Greenovate?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform offers comprehensive educational solutions designed to enhance learning outcomes for students of all ages.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl shadow-[var(--shadow-card)]">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-education-text mb-2">
                  Comprehensive Curriculum
                </h3>
                <p className="text-muted-foreground">
                  From primary to higher secondary, access quality education content aligned with academic standards.
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-xl shadow-[var(--shadow-card)]">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-education-text mb-2">
                  Interactive Learning
                </h3>
                <p className="text-muted-foreground">
                  Engage with multimedia content, interactive exercises, and collaborative learning environments.
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-xl shadow-[var(--shadow-card)]">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-education-text mb-2">
                  Track Progress
                </h3>
                <p className="text-muted-foreground">
                  Monitor learning progress with detailed analytics and personalized feedback for continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="bg-card rounded-2xl p-12 max-w-3xl mx-auto shadow-[var(--shadow-card)]">
              <h2 className="text-3xl font-bold text-education-text mb-4">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of students who are already achieving their educational goals with Greenovate's innovative platform.
              </p>
              <Link to="/classes">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;