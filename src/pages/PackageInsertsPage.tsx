import { QrCode } from 'lucide-react';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { useNavigate } from 'react-router-dom';

export function PackageInsertsPage() {
  const navigate = useNavigate();

  const handleCreateInsert = () => {
    navigate('/dashboard/package-inserts/new');
  };

  return (
    <EmptyState
      icon={QrCode}
      title="No Package Inserts"
      description="Create your first package insert to boost review collection."
      actionLabel="Create Insert"
      onAction={handleCreateInsert}
    />
  );
}