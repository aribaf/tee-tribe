import { Star, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Backend API base URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Review {
  _id: string;              // MongoDB-style ID
  user_name: string;        // reviewer’s name
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
  onDelete?: () => void;
}

export const ReviewCard = ({ review, onDelete }: ReviewCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // For now, allow delete only if same user name matches
  const canDelete = user && user.name === review.user_name;

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${review._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      });

      onDelete?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-2 border-foreground p-6 bg-background">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-lg">{review.user_name || "Anonymous"}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(review.created_at), "PPP")}
          </p>
        </div>

        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-foreground leading-relaxed">{review.comment}</p>
    </div>
  );
};
