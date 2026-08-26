import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { QuickCommandPalette } from './components/common/QuickCommandPalette';
import { HomeHighlights } from './components/home/HomeHighlights';
import { StockCatalog } from './components/stock/StockCatalog';
import { ProductDetailModal } from './components/stock/ProductDetailModal';
import { AccessoriesCatalog } from './components/accessories/AccessoriesCatalog';
import { EducationView } from './components/education/EducationView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SalesPortal } from './components/sales/SalesPortal';
import { ShowroomExperience } from './components/home/ShowroomExperience';
import { LocationSection } from './components/home/LocationSection';
import { SafetyChecks } from './components/home/SafetyChecks';
import { LoginPage } from './components/auth/LoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const {
    activeView,
    userRole,
    selectedPhone,
    activeDetailId,
    getPhoneById,
    setActiveView
  } = useInventory();
  const { isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentDetailPhone = selectedPhone || (activeDetailId ? getPhoneById(activeDetailId) : null);

  const renderMainView = () => {
    if (activeView === 'detail' && currentDetailPhone) {
      return (
        <ProductDetailModal
          phone={currentDetailPhone}
          onClose={() => setActiveView('stock')}
        />
      );
    }

    // Protected routes require authentication
    if (activeView === 'sales') {
      return (
        <ProtectedRoute>
          <SalesPortal />
        </ProtectedRoute>
      );
    }

    if (activeView === 'admin') {
      return (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      );
    }

    // Handle hash-based admin/sales redirects
    if (window.location.hash === '#/admin' && !isAuthenticated) {
      return <ProtectedRoute><div /></ProtectedRoute>;
    }
    if (window.location.hash === '#/sales' && !isAuthenticated) {
      return <ProtectedRoute><div /></ProtectedRoute>;
    }

    switch (activeView) {
      case 'stock':
        return <StockCatalog />;
      case 'accessories':
        return <AccessoriesCatalog />;
      case 'education':
      case 'videos':
        return <EducationView />;
      case 'safety':
        return <SafetyChecks />;
      case 'contact':
        return (
          <div className="space-y-4 bg-slate-50">
            <ShowroomExperience />
            <LocationSection />
          </div>
        );
      case 'home':
      default:
        return (
          <main className="bg-slate-50">
            <HomeHighlights onOpenSearch={() => setIsSearchOpen(true)} />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen cortek-surface text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {renderMainView()}
      </div>

      <Footer />

      <QuickCommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <WhatsAppButton variant="floating" />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
