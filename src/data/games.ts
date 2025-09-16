import { Game } from '@/types/education';

export const gamesByModule: Record<string, Game[]> = {
  primary: [
    {
      id: 'eco-memory',
      title: 'Eco Memory Match',
      description: 'Match environmental concepts and learn through fun memory games!',
      icon: '🧠',
      difficulty: 'easy',
      category: 'memory',
    },
    {
      id: 'nature-explorer',
      title: 'Nature Explorer',
      description: 'Discover different ecosystems and learn about biodiversity!',
      icon: '🌿',
      difficulty: 'easy',
      category: 'explorer',
    },
    {
      id: 'recycling-hero',
      title: 'Recycling Hero',
      description: 'Sort waste correctly and become a recycling champion!',
      icon: '♻️',
      difficulty: 'easy',
      category: 'sorting',
    },
  ],
  middle: [
    {
      id: 'eco-quiz',
      title: 'Eco Quiz Adventure',
      description: 'Test your environmental knowledge with challenging quizzes!',
      icon: '❓',
      difficulty: 'medium',
      category: 'quiz',
    },
    {
      id: 'climate-simulator',
      title: 'Climate Simulator',
      description: 'Simulate climate changes and understand their impacts!',
      icon: '🌡️',
      difficulty: 'medium',
      category: 'simulation',
    },
    {
      id: 'water-cycle-game',
      title: 'Water Cycle Adventure',
      description: 'Follow water through its journey in the water cycle!',
      icon: '💧',
      difficulty: 'medium',
      category: 'adventure',
    },
  ],
  secondary: [
    {
      id: 'eco-builder',
      title: 'Eco Builder',
      description: 'Build sustainable cities and manage environmental resources!',
      icon: '🏗️',
      difficulty: 'hard',
      category: 'builder',
    },
    {
      id: 'carbon-calculator',
      title: 'Carbon Footprint Challenge',
      description: 'Calculate and reduce carbon footprints in various scenarios!',
      icon: '🌍',
      difficulty: 'hard',
      category: 'calculator',
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy Tycoon',
      description: 'Build renewable energy infrastructure and manage power grids!',
      icon: '⚡',
      difficulty: 'hard',
      category: 'strategy',
    },
  ],
  higher: [
    {
      id: 'policy-maker',
      title: 'Environmental Policy Maker',
      description: 'Create environmental policies and see their global impact!',
      icon: '📊',
      difficulty: 'expert',
      category: 'strategy',
    },
    {
      id: 'research-lab',
      title: 'Environmental Research Lab',
      description: 'Conduct virtual environmental research and analyze data!',
      icon: '🔬',
      difficulty: 'expert',
      category: 'research',
    },
    {
      id: 'sustainability-consultant',
      title: 'Sustainability Consultant',
      description: 'Advise organizations on sustainable practices and solutions!',
      icon: '💼',
      difficulty: 'expert',
      category: 'consulting',
    },
  ],
};

export const getAllGames = (): Game[] => {
  return Object.values(gamesByModule).flat();
};

export const getGamesByLevel = (levelId: string): Game[] => {
  return gamesByModule[levelId] || [];
};