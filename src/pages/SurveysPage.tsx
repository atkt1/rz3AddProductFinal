import { FileSpreadsheet } from 'lucide-react';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { useNavigate } from 'react-router-dom';

export function SurveysPage() {
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    navigate('/dashboard/surveys/new');
  };

  return (
    <EmptyState
      icon={FileSpreadsheet}
      title="No Surveys Created"
      description="Create your first survey to start collecting reviews."
      actionLabel="Create Survey"
      onAction={handleCreateSurvey}
    />
  );
}