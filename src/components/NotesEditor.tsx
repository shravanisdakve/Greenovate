import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit, FileText } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface NotesEditorProps {
  levelId: string;
  topicId: number;
}

export const NotesEditor = ({ levelId, topicId }: NotesEditorProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, levelId, topicId]);

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('notes')
        .eq('user_id', user.id)
        .eq('level_id', levelId)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notes:', error);
        return;
      }

      if (data) {
        setNotes(data.notes || '');
        setHasNotes(true);
      } else {
        setNotes('');
        setHasNotes(false);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNotes = async () => {
    if (!user) {
      toast.error('Please log in to save notes');
      return;
    }

    setLoading(true);

    try {
      const noteData = {
        user_id: user.id,
        level_id: levelId,
        topic_id: topicId,
        notes,
        updated_at: new Date().toISOString(),
      };

      if (hasNotes) {
        // Update existing notes
        const { error } = await supabase
          .from('user_notes')
          .update(noteData)
          .eq('user_id', user.id)
          .eq('level_id', levelId)
          .eq('topic_id', topicId);

        if (error) throw error;
      } else {
        // Insert new notes
        const { error } = await supabase
          .from('user_notes')
          .insert(noteData);

        if (error) throw error;
        setHasNotes(true);
      }

      toast.success('Notes saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-education-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-education-text">
            <FileText className="h-5 w-5" />
            Personal Notes
          </CardTitle>
          <CardDescription>
            Please log in to take and save personal notes for this topic.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-education-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-education-text">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Personal Notes
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-education-primary text-education-primary hover:bg-education-primary/10"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardTitle>
        <CardDescription>
          Take personal notes about this topic to enhance your learning experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here... Include key concepts, questions, or important points to remember."
              className="min-h-[200px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={saveNotes}
                disabled={loading}
                className="bg-education-primary hover:bg-education-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Notes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  fetchNotes(); // Reload original notes
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="min-h-[100px] p-4 bg-muted/30 rounded-md">
            {notes ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No notes yet. Click "Edit" to start taking notes for this topic.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};