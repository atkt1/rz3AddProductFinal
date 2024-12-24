import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ReviewsPage } from './ReviewsPage';
import { SurveysPage } from './SurveysPage';
import { ProductsPage } from './ProductsPage';
import { AddProductPage } from './AddProductPage';
import { PackageInsertsPage } from './PackageInsertsPage';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/surveys" element={<SurveysPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/package-inserts" element={<PackageInsertsPage />} />
      </Routes>
    </DashboardLayout>
  );
}