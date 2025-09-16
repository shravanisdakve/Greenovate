import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, BookOpen, Trophy, Target, TrendingUp, 
  Plus, Eye, CheckCircle, Clock, Award, Star, Flame, FileText
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { ProgressReport } from '@/components/ProgressReport';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const TeacherDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    myStudents: 0,
    myChallenges: 0,
    pendingReviews: 0,
    totalPointsAwarded: 0
  });
  const [students, setStudents] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students in teacher's class/level
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .eq('school_level', userProfile?.school_level)
        .order('points', { ascending: false });

      // Fetch challenges created by this teacher
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('created_by', userProfile?.id)
        .order('created_at', { ascending: false });

      // Fetch submissions for teacher's challenges
      const { data: submissionsData } = await supabase
        .from('challenge_submissions')
        .select(`
          *,
          challenge:challenges(title),
          user:users(full_name, email)
        `)
        .in('challenge_id', challengesData?.map(c => c.id) || [])
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      setStudents(studentsData || []);
      setChallenges(challengesData || []);
      setSubmissions(submissionsData || []);

      // Calculate stats
      setStats({
        myStudents: studentsData?.length || 0,
        myChallenges: challengesData?.length || 0,
        pendingReviews: submissionsData?.length || 0,
        totalPointsAwarded: 0 // TODO: Calculate from approved submissions
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const reviewSubmission = async (submissionId: string, status: 'approved' | 'rejected', points = 0, comment = '') => {
    try {
      const { error } = await supabase
        .from('challenge_submissions')
        .update({
          status,
          reviewed_by: userProfile?.id,
          review_comment: comment,
          points_earned: points,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // If approved, award points to student
      if (status === 'approved' && points > 0) {
        const submission = submissions.find(s => s.id === submissionId);
        if (submission) {
          await supabase.rpc('award_points', {
            user_id: submission.user_id,
            points_to_add: points
          });
        }
      }

      toast.success(`Submission ${status} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error reviewing submission:', error);
      toast.error(error.message || 'Failed to review submission');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-education-light/30 to-education-card/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading teacher dashboard...</div>
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
              <h1 className="text-3xl font-bold text-education-text mb-2">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userProfile?.full_name}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{userProfile?.school_level} Level</Badge>
                {userProfile?.class_name && (
                  <Badge variant="outline">Class: {userProfile.class_name}</Badge>
                )}
              </div>
            </div>
            <ProgressReport userType="teacher">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Student Reports
              </Button>
            </ProgressReport>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-primary">{stats.myStudents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Challenges</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-primary">{stats.myChallenges}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-primary">{stats.pendingReviews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-education-primary">{stats.totalPointsAwarded}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="challenges">My Challenges</TabsTrigger>
            <TabsTrigger value="reviews">Pending Reviews</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Monitor your students' progress and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-education-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-education-primary">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          {student.class_name && (
                            <p className="text-xs text-muted-foreground">Class: {student.class_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-education-primary">{student.points} pts</div>
                          <div className="text-sm text-muted-foreground">Level {student.level}</div>
                          <div className="text-xs text-muted-foreground">Streak: {student.streak}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <ProgressReport userType="teacher" targetUserId={student.id}>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              Report
                            </Button>
                          </ProgressReport>
                        </div>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No students found in your level/class.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Challenges</CardTitle>
                    <CardDescription>Challenges you've created for students</CardDescription>
                  </div>
                  <Button className="bg-education-primary hover:bg-education-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{challenge.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={challenge.is_active ? 'default' : 'secondary'}>
                              {challenge.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {challenge.challenge_type}
                            </Badge>
                            <Badge variant="outline">
                              {challenge.points_reward} pts
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {challenges.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      You haven't created any challenges yet.
                      <br />
                      <Button className="mt-4 bg-education-primary hover:bg-education-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Challenge
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>Student submissions waiting for your review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{submission.challenge?.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Submitted by: {submission.user?.full_name}
                          </p>
                          <p className="text-sm mb-3">{submission.content}</p>
                          {submission.file_url && (
                            <div className="mb-3">
                              <Badge variant="outline">📎 File Attached</Badge>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => reviewSubmission(submission.id, 'approved', 10, 'Great work!')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-600"
                            onClick={() => reviewSubmission(submission.id, 'rejected', 0, 'Please try again')}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No submissions pending review.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Leaderboard</CardTitle>
                <CardDescription>Top performers in your class/level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.slice(0, 10).map((student, index) => (
                    <div key={student.id} className="flex items-center gap-4 p-3 border rounded-lg">
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
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-sm text-muted-foreground">Level {student.level}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-education-primary">{student.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      {student.streak > 0 && (
                        <div className="text-center">
                          <Flame className="h-4 w-4 text-orange-500 mx-auto" />
                          <div className="text-xs text-muted-foreground">{student.streak} streak</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;