import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { TopicGrid } from '@/components/TopicGrid';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getSchoolLevel } from '@/data/educationData';
import { Topic } from '@/types/education';

const LevelPage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  
  const schoolLevel = getSchoolLevel(levelId || '');

  const handleTopicClick = (topic: Topic) => {
    navigate(`/level/${levelId}/topic/${topic.id}`);
  };

  if (!schoolLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>School level not found!</p>
            <Button onClick={() => navigate('/classes')} className="mt-4">
              Back to Classes
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/classes')}
            className="mb-4 hover:bg-education-light/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
          <div className="text-center">
            <div className="bg-education-primary/80 text-white py-6 rounded-2xl mb-8">
              <h1 className="text-4xl font-bold">
                {schoolLevel.name}
              </h1>
            </div>
          </div>
        </div>

        <TopicGrid 
          topics={schoolLevel.topics} 
          onTopicClick={handleTopicClick}
        />
      </main>
    </div>
  );
};

export default LevelPage;