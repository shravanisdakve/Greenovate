import { Game } from '@/types/education';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export const GameCard = ({ game, onPlay }: GameCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGameIcon = (category: string) => {
    switch (category) {
      case 'quiz': return '❓';
      case 'builder': return '👷';
      case 'memory': return '🧠';
      case 'puzzle': return '🧩';
      default: return '🎮';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-education-light">
      <CardHeader className="text-center">
        <div className="w-full h-32 bg-education-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-education-primary/90 transition-colors">
          <span className="text-4xl">{getGameIcon(game.category)}</span>
        </div>
        <CardTitle className="text-xl font-bold text-education-text">
          {game.title}
        </CardTitle>
        <Badge className={`${getDifficultyColor(game.difficulty)} text-white`}>
          {game.difficulty.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <CardDescription className="text-muted-foreground">
          {game.description}
        </CardDescription>
        <Button 
          onClick={() => onPlay(game.id)}
          className="w-full bg-education-primary hover:bg-education-primary/90 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};