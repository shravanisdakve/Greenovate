import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Trophy, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface EcosystemElement {
  id: string;
  name: string;
  icon: string;
  cost: number;
  impact: number;
  count: number;
}

const ecosystemElements: EcosystemElement[] = [
  { id: 'tree', name: 'Tree', icon: '🌳', cost: 10, impact: 15, count: 0 },
  { id: 'flower', name: 'Flower', icon: '🌸', cost: 5, impact: 8, count: 0 },
  { id: 'bee', name: 'Bee', icon: '🐝', cost: 15, impact: 20, count: 0 },
  { id: 'bird', name: 'Bird', icon: '🐦', cost: 12, impact: 18, count: 0 },
  { id: 'water', name: 'Water', icon: '💧', cost: 8, impact: 12, count: 0 },
  { id: 'solar', name: 'Solar Panel', icon: '☀️', cost: 20, impact: 25, count: 0 },
];

interface EcoBuilderGameProps {
  onGameEnd: (score: number) => void;
}

export const EcoBuilderGame = ({ onGameEnd }: EcoBuilderGameProps) => {
  const [elements, setElements] = useState<EcosystemElement[]>(ecosystemElements);
  const [points, setPoints] = useState(100);
  const [sustainability, setSustainability] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleGameEnd();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const handleGameEnd = () => {
    setGameCompleted(true);
    const finalScore = sustainability;
    if (sustainability >= 300) {
      toast.success(`Excellent! You built a sustainable ecosystem with ${sustainability} points!`);
    } else if (sustainability >= 200) {
      toast.success(`Good job! Your ecosystem scored ${sustainability} points!`);
    } else {
      toast.error(`Try again! Your ecosystem needs more balance. Score: ${sustainability}`);
    }
    onGameEnd(finalScore);
  };

  const addElement = (elementId: string) => {
    if (!gameStarted) setGameStarted(true);
    
    const element = elements.find(e => e.id === elementId);
    if (!element || points < element.cost) {
      toast.error("Not enough points!");
      return;
    }

    const newElements = elements.map(e => 
      e.id === elementId 
        ? { ...e, count: e.count + 1 }
        : e
    );
    
    setElements(newElements);
    setPoints(points - element.cost);
    setSustainability(sustainability + element.impact);
    toast.success(`Added ${element.name}! +${element.impact} sustainability`);
  };

  const removeElement = (elementId: string) => {
    const element = elements.find(e => e.id === elementId);
    if (!element || element.count === 0) return;

    const newElements = elements.map(e => 
      e.id === elementId 
        ? { ...e, count: e.count - 1 }
        : e
    );
    
    setElements(newElements);
    setPoints(points + Math.floor(element.cost / 2));
    setSustainability(Math.max(0, sustainability - element.impact));
    toast.info(`Removed ${element.name}! -${element.impact} sustainability`);
  };

  const resetGame = () => {
    setElements(ecosystemElements.map(e => ({ ...e, count: 0 })));
    setPoints(100);
    setSustainability(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const isSuccess = sustainability >= 200;
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className={`w-16 h-16 ${isSuccess ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? 'Ecosystem Complete!' : 'Time\'s Up!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-education-primary">
            {sustainability} Points
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              {isSuccess 
                ? 'You built a balanced ecosystem!' 
                : 'Your ecosystem needs more balance.'}
            </p>
            <Progress value={Math.min(100, (sustainability / 500) * 100)} />
          </div>
          <Button onClick={resetGame} className="bg-education-primary hover:bg-education-primary/90">
            <RotateCcw className="w-4 h-4 mr-2" />
            Build Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Eco Builder</h3>
            <div className="flex gap-4">
              <span className="text-sm">Points: {points}</span>
              <span className="text-sm">Sustainability: {sustainability}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-red-500">Time: {timeLeft}s</p>
            {!gameStarted && (
              <p className="text-xs text-muted-foreground">Add elements to start!</p>
            )}
          </div>
        </div>
        <Progress value={Math.min(100, (sustainability / 500) * 100)} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {elements.map((element) => (
            <Card key={element.id} className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl">{element.icon}</div>
                <h4 className="font-semibold">{element.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Cost: {element.cost} | Impact: +{element.impact}
                </p>
                <p className="text-sm font-bold">Count: {element.count}</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeElement(element.id)}
                    disabled={element.count === 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addElement(element.id)}
                    disabled={points < element.cost}
                    className="bg-education-primary hover:bg-education-primary/90"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-education-light/20 rounded-lg">
          <h4 className="font-semibold mb-2">Goal:</h4>
          <p className="text-sm text-muted-foreground">
            Build a balanced ecosystem! Reach 300+ sustainability points before time runs out. 
            Each element costs points but increases your sustainability score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};