import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Download, Trophy, Target, TrendingUp, Award, 
  Star, CheckCircle, Clock, Users, BookOpen, Zap, Flame
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProgressReportProps {
  children: React.ReactNode;
  userType?: 'student' | 'teacher' | 'admin';
  targetUserId?: string;
}

interface ReportData {
  user: any;
  stats: {
    totalPoints: number;
    level: number;
    streak: number;
    badges: number;
    completedChallenges: number;
    rank: number;
    averageScore: number;
    activityThisWeek: number;
  };
  challenges: any[];
  badges: any[];
  activityLog: any[];
  videoProgress: any[];
}

export const ProgressReport = ({ children, userType = 'student', targetUserId }: ProgressReportProps) => {
  const { userProfile, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [reportType, setReportType] = useState<'individual' | 'class' | 'summary'>('individual');

  useEffect(() => {
    if (isOpen && (userRole === 'teacher' || userRole === 'admin')) {
      fetchStudentsList();
    }
  }, [isOpen, userRole]);

  const fetchStudentsList = async () => {
    try {
      const { data: students } = await supabase
        .from('profiles')
        .select('id, full_name, email, class_name, school_name')
        .eq('role', 'student')
        .order('full_name');

      setStudentsList(students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const userId = targetUserId || selectedStudent || userProfile?.id;
      if (!userId) return;

      // Fetch user data
      const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch challenge submissions
      const { data: submissions } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          challenge:challenges(title, points_reward, difficulty)
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      // Fetch activity logs
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch video progress
      const { data: videoProgress } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_watched_at', { ascending: false });

      // Calculate stats
      const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || [];
      const totalPoints = approvedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = approvedSubmissions.length > 0 
        ? approvedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / approvedSubmissions.length 
        : 0;

      // Calculate weekly activity
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyActivity = activities?.filter(a => 
        new Date(a.created_at) > oneWeekAgo
      ).length || 0;

      // Get user rank
      const { data: allStudents } = await supabase
        .from('profiles')
        .select('id, points')
        .eq('role', 'student')
        .order('points', { ascending: false });

      const userRank = allStudents?.findIndex(s => s.id === userId) + 1 || 0;

      setReportData({
        user,
        stats: {
          totalPoints: user?.points || 0,
          level: user?.level || 1,
          streak: user?.streak_days || 0,
          badges: userBadges?.length || 0,
          completedChallenges: approvedSubmissions.length,
          rank: userRank,
          averageScore: Math.round(averageScore),
          activityThisWeek: weeklyActivity
        },
        challenges: submissions || [],
        badges: userBadges?.map(ub => ub.badge) || [],
        activityLog: activities || [],
        videoProgress: videoProgress || []
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const reportContent = `
PROGRESS REPORT - ${reportData.user.full_name}
Generated on: ${new Date().toLocaleDateString()}

=== OVERVIEW ===
Total Points: ${reportData.stats.totalPoints}
Current Level: ${reportData.stats.level}
Current Streak: ${reportData.stats.streak} days
Badges Earned: ${reportData.stats.badges}
Completed Challenges: ${reportData.stats.completedChallenges}
Class Rank: #${reportData.stats.rank}
Average Score: ${reportData.stats.averageScore}%
Activity This Week: ${reportData.stats.activityThisWeek} actions

=== RECENT CHALLENGES ===
${reportData.challenges.slice(0, 10).map(c => 
  `- ${c.challenge?.title || 'Unknown'}: ${c.status} (${c.score || 0}%) - ${new Date(c.submitted_at).toLocaleDateString()}`
).join('\n')}

=== BADGES EARNED ===
${reportData.badges.map(b => `- ${b.name}: ${b.description}`).join('\n')}

=== RECENT ACTIVITY ===
${reportData.activityLog.slice(0, 15).map(a => 
  `- ${a.activity_type}: +${a.points_earned} points - ${new Date(a.created_at).toLocaleDateString()}`
).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${reportData.user.full_name.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Progress Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Options */}
          {(userRole === 'teacher' || userRole === 'admin') && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsList.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={loading || (!selectedStudent && userType !== 'student')}>
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
                {reportData && (
                  <Button variant="outline" onClick={downloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          )}

          {userType === 'student' && (
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Progress Report</h3>
              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
                {reportData && (
                  <Button variant="outline" onClick={downloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Report Content */}
          {reportData && (
            <div className="space-y-6">
              {/* Header */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    {reportData.user.full_name}'s Progress Report
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date().toLocaleDateString()} • 
                    Level {reportData.stats.level} • 
                    {reportData.user.class_name && `Class: ${reportData.user.class_name}`}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      Total Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{reportData.stats.totalPoints}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{reportData.stats.completedChallenges}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{reportData.stats.badges}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{reportData.stats.streak}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Class Rank</span>
                          <Badge variant="outline">#{reportData.stats.rank}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Score</span>
                          <Badge variant="outline">{reportData.stats.averageScore}%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Weekly Activity</span>
                          <Badge variant="outline">{reportData.stats.activityThisWeek} actions</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Level Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Level {reportData.stats.level}</span>
                            <span>Level {reportData.stats.level + 1}</span>
                          </div>
                          <Progress value={((reportData.stats.totalPoints % 100) / 100) * 100} />
                          <p className="text-xs text-muted-foreground">
                            {100 - (reportData.stats.totalPoints % 100)} points to next level
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="challenges" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Challenges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reportData.challenges.slice(0, 10).map((challenge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{challenge.challenge?.title || 'Unknown Challenge'}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(challenge.submitted_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                challenge.status === 'approved' ? 'default' :
                                challenge.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {challenge.status}
                              </Badge>
                              {challenge.score && (
                                <Badge variant="outline">{challenge.score}%</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="badges" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Earned Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {reportData.badges.map((badge, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{badge.name}</p>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reportData.activityLog.slice(0, 15).map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{activity.activity_type}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">+{activity.points_earned} pts</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};