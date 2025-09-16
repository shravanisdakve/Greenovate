import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Target, TrendingUp, Award, Star, 
  Play, Clock, CheckCircle, Users, BookOpen,
  Zap, Medal, Crown, Flame, FileText
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { ProgressReport } from '@/components/ProgressReport';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    streak: 0,
    badges: 0,
    completedChallenges: 0,
    rank: 0
  });
  const [availableChallenges, setAvailableChallenges] = useState<any[]>([]);
  const [myChallenges, setMyChallenges] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch available challenges for student's level
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .in('target_level', [userProfile?.school_level, 'all'])
        .order('created_at', { ascending: false });

      // Fetch student's challenge submissions
      const { data: submissionsData } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          challenge:challenges(title, points_reward)
        `)
        .eq('user_id', userProfile?.id)
        .order('submitted_at', { ascending: false });

      // Fetch student's badges
      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', userProfile?.id)
        .order('earned_at', { ascending: false });

      // Fetch leaderboard (students in same level/class)
      const { data: leaderboardData } = await supabase
        .from('users')
        .select('id, full_name, points, level, streak, class_name')
        .eq('role', 'student')
        .eq('school_level', userProfile?.school_level)
        .order('points', { ascending: false })
        .limit(10);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userProfile?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setAvailableChallenges(challengesData || []);
      setMyChallenges(submissionsData || []);
      setBadges(userBadgesData?.map(ub => ub.badge) || []);
      setLeaderboard(leaderboardData || []);
      setActivityLog(activityData || []);

      // Calculate student rank
      const studentRank = leaderboardData?.findIndex(student => student.id === userProfile?.id) + 1 || 0;

      setStats({
        totalPoints: userProfile?.points || 0,
        level: userProfile?.level || 1,
        streak: userProfile?.streak || 0,
        badges: userBadgesData?.length || 0,
        completedChallenges: submissionsData?.filter(s => s.status === 'approved').length || 0,
        rank: studentRank
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100; // Each level requires 100 more points than the previous
  };

  const getLevelProgress = () => {
    const currentLevelBase = (stats.level - 1) * 100;
    const nextLevelPoints = getNextLevelPoints(stats.level);
    const pointsInCurrentLevel = stats.totalPoints - currentLevelBase;
    return Math.min((pointsInCurrentLevel / 100) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-education-text mb-2">
                Welcome back, {userProfile?.full_name}! 🌱
              </h1>
              <p className="text-muted-foreground">Ready to make a positive environmental impact today?</p>
            </div>
            <ProgressReport userType="student">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Progress Report
              </Button>
            </ProgressReport>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-education-primary/10 to-education-accent/10 border-education-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-education-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-primary">{stats.totalPoints}</div>
              <Progress value={getLevelProgress()} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {getNextLevelPoints(stats.level) - (stats.totalPoints - (stats.level - 1) * 100)} points to level {stats.level + 1}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Crown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.level}</div>
              <div className="flex items-center gap-1 mt-1">
                <Medal className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-600">Eco Warrior</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
              <p className="text-xs text-orange-600 mt-1">Days in a row!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">#{stats.rank}</div>
              <p className="text-xs text-blue-600 mt-1">of {leaderboard.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Award className="h-8 w-8 text-education-accent mx-auto mb-2" />
              <CardTitle className="text-sm">Badges Earned</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-education-primary">{stats.badges}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-education-accent mx-auto mb-2" />
              <CardTitle className="text-sm">Challenges Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-education-primary">{stats.completedChallenges}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 text-education-accent mx-auto mb-2" />
              <CardTitle className="text-sm">Energy Points</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-education-primary">{Math.floor(stats.totalPoints / 10)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges">Available Challenges</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Eco-Challenges</CardTitle>
                <CardDescription>Complete challenges to earn points and make a real environmental impact!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableChallenges.map((challenge) => (
                    <Card key={challenge.id} className="border-education-primary/20 hover:border-education-primary/40 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            +{challenge.points_reward} pts
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={challenge.challenge_type === 'quiz' ? 'default' : 
                                           challenge.challenge_type === 'activity' ? 'secondary' : 'outline'}>
                              {challenge.challenge_type}
                            </Badge>
                            {challenge.deadline && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Due: {new Date(challenge.deadline).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <Button size="sm" className="bg-education-primary hover:bg-education-primary/90">
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {availableChallenges.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      No challenges available at the moment. Check back soon!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Challenge Progress</CardTitle>
                <CardDescription>Track your submitted challenges and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myChallenges.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{submission.challenge?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                        {submission.review_comment && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Comment: {submission.review_comment}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant={
                            submission.status === 'approved' ? 'default' :
                            submission.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {submission.status}
                          </Badge>
                          {submission.status === 'approved' && (
                            <div className="text-sm text-education-primary font-medium mt-1">
                              +{submission.points_earned} pts
                            </div>
                          )}
                        </div>
                        {submission.status === 'approved' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  {myChallenges.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      You haven't submitted any challenges yet. Start your first challenge above!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Leaderboard 🏆</CardTitle>
                <CardDescription>See how you stack up against your classmates!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((student, index) => (
                    <div 
                      key={student.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        student.id === userProfile?.id ? 'bg-education-primary/5 border-education-primary/30' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 
                        'bg-education-primary'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${student.id === userProfile?.id ? 'text-education-primary' : ''}`}>
                          {student.full_name} {student.id === userProfile?.id && '(You)'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Level {student.level}</span>
                          {student.class_name && <span>Class: {student.class_name}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-education-primary">{student.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      {student.streak > 0 && (
                        <div className="text-center">
                          <Flame className="h-4 w-4 text-orange-500 mx-auto" />
                          <div className="text-xs text-muted-foreground">{student.streak}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Badges Collection</CardTitle>
                <CardDescription>Showcase your environmental achievements!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="text-center p-4 border rounded-lg bg-gradient-to-b from-education-light/20 to-white">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No badges earned yet. Complete challenges to earn your first badge! 🏆
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Games</CardTitle>
                <CardDescription>Learn while having fun with interactive games!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-education-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-education-text mb-2">Ready to Play?</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore our collection of educational games designed for your level
                  </p>
                  <Button 
                    onClick={() => navigate('/games')}
                    className="bg-education-primary hover:bg-education-primary/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Gaming
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;