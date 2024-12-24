import { Package } from 'lucide-react';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { useNavigate } from 'react-router-dom';

export function ProductsPage() {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/dashboard/products/new');
  };

  return (
    <EmptyState
      icon={Package}
      title="No Products Added"
      description="Add your first product to start managing reviews."
      actionLabel="Add Product"
      onAction={handleAddProduct}
    />
  );
}