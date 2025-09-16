import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { EcoQuizGame } from '@/components/games/EcoQuizGame';
import { EcoMemoryGame } from '@/components/games/EcoMemoryGame';
import { EcoBuilderGame } from '@/components/games/EcoBuilderGame';
import { toast } from 'sonner';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameScore, setGameScore] = useState<number | null>(null);

  const handleGameEnd = (score: number) => {
    setGameScore(score);
    toast.success(`Game completed! Score: ${score}`);
  };

  const getGameTitle = (gameId: string) => {
    switch (gameId) {
      case 'eco-quiz': return 'Eco Quiz Adventure';
      case 'eco-memory': return 'Eco Memory Match';
      case 'eco-builder': return 'Eco Builder';
      default: return 'Environmental Game';
    }
  };

  const renderGame = () => {
    switch (gameId) {
      case 'eco-quiz':
        return <EcoQuizGame onGameEnd={handleGameEnd} />;
      case 'eco-memory':
        return <EcoMemoryGame onGameEnd={handleGameEnd} />;
      case 'eco-builder':
        return <EcoBuilderGame onGameEnd={handleGameEnd} />;
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="text-center p-8">
              <p>Game not found!</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-education-light/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          <h1 className="text-3xl font-bold text-education-text text-center">
            {getGameTitle(gameId || '')}
          </h1>
        </div>

        <div className="flex justify-center">
          {renderGame()}
        </div>

        {gameScore !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold">Game Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-education-primary">
                  {gameScore}
                </div>
                <p className="text-muted-foreground">Points earned</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => setGameScore(null)}
                    variant="outline"
                  >
                    Play Again
                  </Button>
                  <Button 
                    onClick={() => navigate('/games')}
                    className="bg-education-primary hover:bg-education-primary/90"
                  >
                    More Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;