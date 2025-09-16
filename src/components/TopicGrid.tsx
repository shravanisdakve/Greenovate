import { Topic } from '@/types/education';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play } from 'lucide-react';
import { toast } from 'sonner';

interface TopicGridProps {
  topics: Topic[];
  onTopicClick: (topic: Topic) => void;
}

export const TopicGrid = ({ topics, onTopicClick }: TopicGridProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-education-text mb-2">TOPICS</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className="aspect-square flex items-center justify-center bg-education-primary hover:bg-education-primary/90 cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-lg"
            onClick={() => onTopicClick(topic)}
          >
            <div className="text-center">
              <span className="text-3xl font-bold text-white">
                {topic.id}
              </span>
              {topic.completed && (
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-education-text mb-2">Progress</h3>
        <Progress 
          value={topics.filter(t => t.completed).length / topics.length * 100} 
          className="w-full max-w-md mx-auto h-3"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(topics.filter(t => t.completed).length / topics.length * 100)}%
        </p>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => toast("Games loading soon!")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Click here to play some games!
        </Button>
      </div>
    </div>
  );
};