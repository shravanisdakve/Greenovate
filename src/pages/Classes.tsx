import Header from "@/components/Header";
import ClassCard from "@/components/ClassCard";
import { useNavigate } from "react-router-dom";
import primarySchoolImage from "@/assets/primary-school.jpg";
import middleSchoolImage from "@/assets/middle-school.jpg";
import highSchoolImage from "@/assets/high-school.jpg";
import higherSecondaryImage from "@/assets/higher-secondary.jpg";

const Classes = () => {
  const navigate = useNavigate();

  const classData = [
    {
      id: "primary",
      title: "Primary School Standard",
      image: primarySchoolImage,
      description: "Foundation learning with interactive activities, basic literacy, numeracy, and creative play-based education for young minds."
    },
    {
      id: "middle",
      title: "Middle School Standard", 
      image: middleSchoolImage,
      description: "Comprehensive curriculum covering science, mathematics, language arts, and social studies with hands-on learning experiences."
    },
    {
      id: "secondary",
      title: "Secondary School Standard",
      image: highSchoolImage,
      description: "Advanced academic preparation with specialized subjects, critical thinking development, and career exploration opportunities."
    },
    {
      id: "higher-secondary",
      title: "Higher Secondary Standard",
      image: higherSecondaryImage,
      description: "Pre-university education with advanced coursework, exam preparation, and university admission guidance and support."
    }
  ];

  const handleClassClick = (classItem: typeof classData[0]) => {
    navigate(`/level/${classItem.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-education-text mb-4">
            Educational <span className="text-primary">Classes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your educational level and start your learning journey with our comprehensive courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {classData.map((classItem) => (
            <ClassCard
              key={classItem.id}
              title={classItem.title}
              image={classItem.image}
              description={classItem.description}
              onClick={() => handleClassClick(classItem)}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-bold text-education-text mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who are already advancing their education with Greenovate's interactive learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Get Started Today
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classes;