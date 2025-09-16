import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from '@/types/education';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the main cause of climate change?",
    options: ["Solar flares", "Greenhouse gas emissions", "Ocean currents", "Volcanic activity"],
    correctAnswer: 1,
    explanation: "Greenhouse gas emissions from human activities are the primary driver of climate change."
  },
  {
    id: 2,
    question: "Which of these is a renewable energy source?",
    options: ["Coal", "Natural gas", "Solar power", "Nuclear power"],
    correctAnswer: 2,
    explanation: "Solar power is renewable because it harnesses energy from the sun, which is constantly available."
  },
  {
    id: 3,
    question: "What percentage of Earth's water is freshwater?",
    options: ["50%", "25%", "10%", "3%"],
    correctAnswer: 3,
    explanation: "Only about 3% of Earth's water is freshwater, making it a precious resource."
  },
  {
    id: 4,
    question: "Which gas makes up the largest portion of greenhouse gases?",
    options: ["Methane", "Carbon dioxide", "Nitrous oxide", "Fluorinated gases"],
    correctAnswer: 1,
    explanation: "Carbon dioxide makes up about 76% of all greenhouse gas emissions."
  },
  {
    id: 5,
    question: "What is the process by which plants absorb CO2?",
    options: ["Respiration", "Photosynthesis", "Transpiration", "Germination"],
    correctAnswer: 1,
    explanation: "Photosynthesis is the process where plants convert CO2 and sunlight into energy and oxygen."
  }
];

interface EcoQuizGameProps {
  onGameEnd: (score: number) => void;
}

export const EcoQuizGame = ({ onGameEnd }: EcoQuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameCompleted]);

  const handleTimeUp = () => {
    setShowResult(true);
    toast.error("Time's up!");
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Incorrect! 😞");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setGameCompleted(true);
      onGameEnd(score);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
    setTimeLeft(30);
  };

  if (gameCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-education-primary">
            {score}/{quizQuestions.length}
          </div>
          <p className="text-lg">
            You scored {Math.round((score / quizQuestions.length) * 100)}%
          </p>
          <Button onClick={resetGame} className="bg-education-primary hover:bg-education-primary/90">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
          <div className="text-sm font-semibold text-red-500">
            Time: {timeLeft}s
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} />
        <CardTitle className="text-xl mt-4">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => !showResult && handleAnswerSelect(index)}
            variant={
              showResult
                ? index === question.correctAnswer
                  ? 'default'
                  : index === selectedAnswer
                  ? 'destructive'
                  : 'outline'
                : 'outline'
            }
            className={`w-full text-left justify-start p-4 h-auto ${
              showResult && index === question.correctAnswer
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : showResult && index === selectedAnswer && index !== question.correctAnswer
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : ''
            }`}
            disabled={showResult}
          >
            <div className="flex items-center">
              {showResult && index === question.correctAnswer && (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {option}
            </div>
          </Button>
        ))}
        
        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {question.explanation}
            </p>
            <Button 
              onClick={handleNextQuestion}
              className="mt-4 bg-education-primary hover:bg-education-primary/90"
            >
              {currentQuestion + 1 < quizQuestions.length ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};