import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'eco-quiz',
      title: 'Eco Quiz Adventure',
      description: 'Test your knowledge about environment and sustainability through an exciting quiz journey.',
      icon: '❓',
      difficulty: 'medium' as const,
      category: 'quiz' as const,
    },
    {
      id: 'eco-builder',
      title: 'Eco Builder',
      description: 'Build and maintain a balanced ecosystem! Earn sustainability points before the 60-second timer runs out.',
      icon: '👷',
      difficulty: 'hard' as const,
      category: 'builder' as const,
    },
    {
      id: 'eco-memory',
      title: 'Eco Memory Match',
      description: 'Flip cards to match environmental concepts before the timer runs out!',
      icon: '🧠',
      difficulty: 'easy' as const,
      category: 'memory' as const,
    },
  ];

  const handlePlayGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

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
            <h1 className="text-4xl font-bold text-education-text mb-4">
              Games Secondary school
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Learn about the environment while having fun!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={handlePlayGame}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Games;