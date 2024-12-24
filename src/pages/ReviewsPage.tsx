import { Star } from 'lucide-react';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { useNavigate } from 'react-router-dom';

export function ReviewsPage() {
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    navigate('/dashboard/surveys/new');
  };

  return (
    <EmptyState
      icon={Star}
      title="No Reviews Collected"
      description="Waiting for someone to respond to a survey."
      actionLabel="Create Survey"
      onAction={handleCreateSurvey}
    />
  );
}