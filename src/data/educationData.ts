import { SchoolLevel, Topic, Game } from '@/types/education';
import { gamesByModule } from './games';

// Real YouTube videos for environmental education
const createTopics = (level: string): Topic[] => {
  const topicsByLevel = {
    primary: [
      {
        id: 1,
        title: "What is Climate Change?",
        description: "Understanding the basics of climate change and global warming for young learners.",
        videoUrl: "https://www.youtube.com/embed/G4H1N_yXBiA",
        videoId: "G4H1N_yXBiA",
        duration: 180,
      },
      {
        id: 2,
        title: "Recycling for Kids",
        description: "Learn about the importance of recycling and how to sort different materials.",
        videoUrl: "https://www.youtube.com/embed/6jQ7y_qQYUA",
        videoId: "6jQ7y_qQYUA",
        duration: 240,
      },
      {
        id: 3,
        title: "Save Water - Kids Environmental Video",
        description: "Understanding water conservation and simple ways kids can help save water.",
        videoUrl: "https://www.youtube.com/embed/rMH52ioKIhs",
        videoId: "rMH52ioKIhs",
        duration: 300,
      },
      {
        id: 4,
        title: "Renewable vs Non-Renewable Energy",
        description: "Learning about different types of energy sources and sustainability.",
        videoUrl: "https://www.youtube.com/embed/1kUE0BZtTRc",
        videoId: "1kUE0BZtTRc",
        duration: 420,
      },
      {
        id: 5,
        title: "Earth Day Every Day",
        description: "How kids can help protect the environment every single day.",
        videoUrl: "https://www.youtube.com/embed/4MZJfZ2BvJU",
        videoId: "4MZJfZ2BvJU",
        duration: 360,
      },
      {
        id: 6,
        title: "Animals and Their Habitats",
        description: "Understanding how climate change affects different animal habitats.",
        videoUrl: "https://www.youtube.com/embed/qtTi_1eWCk0",
        videoId: "qtTi_1eWCk0",
        duration: 480,
      },
      {
        id: 7,
        title: "Pollution and Its Effects",
        description: "Learning about different types of pollution and their impact on nature.",
        videoUrl: "https://www.youtube.com/embed/Rw5Kt38TFzw",
        videoId: "Rw5Kt38TFzw",
        duration: 390,
      },
      {
        id: 8,
        title: "Going Green - Simple Steps",
        description: "Easy ways for families to live more environmentally friendly lives.",
        videoUrl: "https://www.youtube.com/embed/bG6b8-3qEpE",
        videoId: "bG6b8-3qEpE",
        duration: 300,
      },
    ],
    middle: [
      {
        id: 1,
        title: "Understanding the Greenhouse Effect",
        description: "Deep dive into how greenhouse gases trap heat in Earth's atmosphere.",
        videoUrl: "https://www.youtube.com/embed/sTvqIijqvTg",
        videoId: "sTvqIijqvTg",
        duration: 600,
      },
      {
        id: 2,
        title: "Deforestation and Its Impact",
        description: "How cutting down forests affects climate and biodiversity worldwide.",
        videoUrl: "https://www.youtube.com/embed/Ic-J6hcSKa8",
        videoId: "Ic-J6hcSKa8",
        duration: 720,
      },
      {
        id: 3,
        title: "Ocean Acidification Explained",
        description: "Understanding how CO2 affects ocean chemistry and marine life.",
        videoUrl: "https://www.youtube.com/embed/6P2xGoQdVCM",
        videoId: "6P2xGoQdVCM",
        duration: 540,
      },
      {
        id: 4,
        title: "Sustainable Agriculture",
        description: "How farming practices can help or harm the environment.",
        videoUrl: "https://www.youtube.com/embed/7vOOld_4qG8",
        videoId: "7vOOld_4qG8",
        duration: 480,
      },
      {
        id: 5,
        title: "Renewable Energy Solutions",
        description: "Exploring solar, wind, and other clean energy technologies.",
        videoUrl: "https://www.youtube.com/embed/1kUE0BZtTRc",
        videoId: "1kUE0BZtTRc",
        duration: 660,
      },
    ],
    secondary: [
      {
        id: 1,
        title: "Climate Change Science",
        description: "Comprehensive overview of climate science and evidence.",
        videoUrl: "https://www.youtube.com/embed/dcUuBk8z2qo",
        videoId: "dcUuBk8z2qo",
        duration: 900,
      },
      {
        id: 2,
        title: "Carbon Footprint Analysis",
        description: "Understanding and calculating environmental impact of human activities.",
        videoUrl: "https://www.youtube.com/embed/8q7_aV8eLUE",
        videoId: "8q7_aV8eLUE",
        duration: 720,
      },
      {
        id: 3,
        title: "Environmental Policy and Governance",
        description: "How governments and organizations address climate challenges.",
        videoUrl: "https://www.youtube.com/embed/iPBV3BlV7jk",
        videoId: "iPBV3BlV7jk",
        duration: 1080,
      },
    ],
    higher: [
      {
        id: 1,
        title: "Advanced Climate Modeling",
        description: "Understanding complex climate prediction models and their accuracy.",
        videoUrl: "https://www.youtube.com/embed/7C3s6pKmSBc",
        videoId: "7C3s6pKmSBc",
        duration: 1200,
      },
      {
        id: 2,
        title: "Economics of Climate Change",
        description: "Economic impacts and solutions for climate change mitigation.",
        videoUrl: "https://www.youtube.com/embed/zr2TJvH--_8",
        videoId: "zr2TJvH--_8",
        duration: 1440,
      },
    ],
  };

  return (topicsByLevel[level as keyof typeof topicsByLevel] || []).map(topic => ({
    ...topic,
    completed: false,
    progress: 0,
  }));
};

const commonGames: Game[] = [
  {
    id: 'eco-quiz',
    title: 'Eco Quiz Adventure',
    description: 'Test your knowledge about environment and sustainability through an exciting quiz journey.',
    icon: '❓',
    difficulty: 'medium',
    category: 'quiz',
  },
  {
    id: 'eco-builder',
    title: 'Eco Builder',
    description: 'Build and maintain a balanced ecosystem! Earn sustainability points before the 60-second timer runs out.',
    icon: '👷',
    difficulty: 'hard',
    category: 'builder',
  },
  {
    id: 'eco-memory',
    title: 'Eco Memory Match',
    description: 'Flip cards to match environmental concepts before the timer runs out!',
    icon: '🧠',
    difficulty: 'easy',
    category: 'memory',
  },
  {
    id: 'climate-puzzle',
    title: 'Climate Puzzle',
    description: 'Solve environmental puzzles and learn about climate change solutions.',
    icon: '🧩',
    difficulty: 'medium',
    category: 'puzzle',
  },
];

export const educationData: SchoolLevel[] = [
  {
    id: 'primary',
    name: 'Primary School Standard',
    topics: createTopics('primary'),
    games: gamesByModule.primary,
    overallProgress: 0,
  },
  {
    id: 'middle',
    name: 'Middle School Standard',
    topics: createTopics('middle'),
    games: gamesByModule.middle,
    overallProgress: 0,
  },
  {
    id: 'secondary',
    name: 'Secondary School Standard',
    topics: createTopics('secondary'),
    games: gamesByModule.secondary,
    overallProgress: 0,
  },
  {
    id: 'higher',
    name: 'Higher Secondary Standard',
    topics: createTopics('higher'),
    games: gamesByModule.higher,
    overallProgress: 0,
  },
];

export const getSchoolLevel = (levelId: string): SchoolLevel | undefined => {
  return educationData.find(level => level.id === levelId);
};