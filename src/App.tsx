import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardInit } from '@/components/dashboard/Dashboard';
import { Navbar } from './components/layout/navbar';
import { Hero } from './components/sections/hero';
import { Features } from './components/sections/features';
import { Pricing } from './components/sections/pricing';
import { CTA } from './components/sections/cta';
import { Footer } from './components/layout/footer';
import { AuthPage } from './components/auth/auth-page';
import { DashboardPage } from './pages/DashboardPage';

function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardInit />
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}