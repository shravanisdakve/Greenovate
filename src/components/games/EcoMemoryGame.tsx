import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memoryPairs = [
  '🌱', '🌍', '♻️', '🌊', '🌳', '☀️', '🐝', '🌿'
];

interface EcoMemoryGameProps {
  onGameEnd: (score: number) => void;
}

export const EcoMemoryGame = ({ onGameEnd }: EcoMemoryGameProps) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleGameEnd();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  useEffect(() => {
    if (matches === memoryPairs.length && !gameCompleted) {
      setGameCompleted(true);
      const finalScore = Math.max(0, 1000 - (moves * 10) - ((60 - timeLeft) * 5));
      toast.success(`Congratulations! You completed the game with ${moves} moves!`);
      onGameEnd(finalScore);
    }
  }, [matches, gameCompleted, moves, timeLeft, onGameEnd]);

  const initializeGame = () => {
    const shuffledCards = [...memoryPairs, ...memoryPairs]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameCompleted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
          toast.success('Match found! 🎉');
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstId].isFlipped = false;
          resetCards[secondId].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameEnd = () => {
    setGameCompleted(true);
    const finalScore = Math.max(0, matches * 100 - (moves * 10));
    onGameEnd(finalScore);
  };

  if (gameCompleted) {
    const isWin = matches === memoryPairs.length;
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className={`w-16 h-16 ${isWin ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isWin ? 'Congratulations!' : 'Game Over!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-lg">Matches: {matches}/{memoryPairs.length}</p>
            <p className="text-lg">Moves: {moves}</p>
            <p className="text-lg">Time: {60 - timeLeft}s</p>
          </div>
          <Button onClick={initializeGame} className="bg-education-primary hover:bg-education-primary/90">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Matches: {matches}/{memoryPairs.length}</p>
            <p className="text-sm text-muted-foreground">Moves: {moves}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-semibold text-red-500">Time: {timeLeft}s</p>
            {!gameStarted && (
              <p className="text-xs text-muted-foreground">Click any card to start!</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <Button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl p-0 transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-education-light text-education-text'
                  : 'bg-education-primary hover:bg-education-primary/90 text-white'
              } ${card.isMatched ? 'ring-2 ring-green-500' : ''}`}
              disabled={card.isMatched}
            >
              {card.isFlipped || card.isMatched ? card.content : '?'}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};