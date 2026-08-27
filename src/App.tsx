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

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedPhone,
    activeDetailId,
    getPhoneById,
    setActiveView
  } = useInventory();
  const { user, loading: authLoading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pathname, setPathname] = useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (pathname === '/login') {
    if (authLoading) return null;
    if (!user) return <LoginPage />;
    return user.role === 'admin' ? <AdminDashboard /> : <SalesPortal />;
  }

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
