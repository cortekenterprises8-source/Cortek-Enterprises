import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PhoneItem, FilterOptions, UserRole, ProductCategory } from '../types';
import { api } from '../api/client';

interface InventoryContextType {
  phones: PhoneItem[];
  availablePhones: PhoneItem[];
  soldPhones: PhoneItem[];
  featuredPhones: PhoneItem[];
  selectedPhone: PhoneItem | null;
  setSelectedPhone: (phone: PhoneItem | null) => void;
  activeView: string;
  setActiveView: (view: string, phoneId?: string) => void;
  activeDetailId: string | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  setCategoryFilter: (category: string) => void;
  addPhone: (phone: Omit<PhoneItem, 'id' | 'dateAdded'>) => Promise<void>;
  updatePhone: (phone: PhoneItem) => Promise<void>;
  deletePhone: (id: string) => Promise<void>;
  togglePhoneStatus: (id: string) => Promise<void>;
  resetToDefaultStock: () => void;
  getPhoneById: (id: string) => PhoneItem | undefined;
  refreshPhones: () => Promise<void>;
  loading: boolean;
  apiError: string | null;
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'All',
  brand: 'All',
  minPrice: 0,
  maxPrice: 250000,
  storage: [],
  condition: [],
  minBatteryHealth: 0,
  onlyAvailable: false,
  onlyPriceDrop: false,
  sortBy: 'featured',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const emptyInventoryContext: InventoryContextType = {
  phones: [],
  availablePhones: [],
  soldPhones: [],
  featuredPhones: [],
  selectedPhone: null,
  setSelectedPhone: () => undefined,
  activeView: 'home',
  setActiveView: () => undefined,
  activeDetailId: null,
  userRole: 'customer',
  setUserRole: () => undefined,
  filters: DEFAULT_FILTERS,
  setFilters: () => undefined,
  resetFilters: () => undefined,
  setCategoryFilter: () => undefined,
  addPhone: async () => undefined,
  updatePhone: async () => undefined,
  deletePhone: async () => undefined,
  togglePhoneStatus: async () => undefined,
  resetToDefaultStock: () => undefined,
  getPhoneById: () => undefined,
  refreshPhones: async () => undefined,
  loading: false,
  apiError: null,
};

function mapApiProductToPhoneItem(apiProduct: any): PhoneItem {
  const images = apiProduct.images?.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean) || [];
  const unit = apiProduct.units?.[0];
  const statusMap: Record<string, PhoneItem['status']> = {
    available: 'Available',
    reserved: 'Booked',
    sold: 'Sold Out',
    retired: 'Sold Out',
  };
  const inBox = apiProduct.inBox || apiProduct.in_box || {};
  return {
    id: apiProduct.id,
    category: apiProduct.category || 'Phones',
    brand: apiProduct.brand,
    model: apiProduct.model,
    storage: apiProduct.storage,
    colour: apiProduct.colour,
    colorHex: apiProduct.colorHex || apiProduct.color_hex,
    condition: apiProduct.condition || apiProduct.condition_grade,
    conditionDescription: apiProduct.conditionDescription || apiProduct.condition_description,
    batteryHealth: apiProduct.batteryHealth ?? apiProduct.battery_health,
    price: apiProduct.price ?? apiProduct.price_inr,
    originalMsp: apiProduct.originalMsp ?? apiProduct.original_msp,
    billAvailable: apiProduct.billAvailable ?? apiProduct.bill_available,
    billAmount: apiProduct.billAmount ?? apiProduct.bill_amount,
    priceDrop: apiProduct.priceDrop ?? apiProduct.price_drop,
    featured: apiProduct.featured,
    status: apiProduct.status || statusMap[unit?.status] || 'Available',
    dateAdded: apiProduct.dateAdded || apiProduct.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    images: images.length > 0 ? images : ['/placeholder-phone.png'],
    inBox: {
      chargerIncluded: inBox.charger_included ?? inBox.chargerIncluded ?? true,
      originalBox: inBox.original_box ?? inBox.originalBox ?? true,
      taxInvoiceProvided: inBox.tax_invoice_provided ?? inBox.taxInvoiceProvided ?? true,
      cableIncluded: inBox.cable_included ?? inBox.cableIncluded ?? true,
      originalBillIncluded: inBox.original_bill_included ?? inBox.originalBillIncluded,
    },
    keyFeatures: apiProduct.key_features || [],
    inspectionPassed: apiProduct.inspectionPassed || apiProduct.inspection_passed || [],
    stockTag: apiProduct.stockTag || apiProduct.stock_tag,
    screenSize: apiProduct.screenSize || apiProduct.screen_size,
    ram: apiProduct.ram,
    processor: apiProduct.processor,
  };
}

function mapPhoneItemToApiPayload(phone: Omit<PhoneItem, 'id' | 'dateAdded'>) {
  return {
    category: phone.category || 'Phones',
    brand: phone.brand,
    model: phone.model,
    storage: phone.storage,
    colour: phone.colour,
    color_hex: phone.colorHex || null,
    price_inr: phone.price,
    original_msp: phone.originalMsp || null,
    bill_available: phone.billAvailable ?? true,
    bill_amount: phone.billAmount || null,
    condition_grade: phone.condition,
    condition_description: phone.conditionDescription,
    battery_health: phone.batteryHealth || null,
    screen_size: phone.screenSize || null,
    ram: phone.ram || null,
    processor: phone.processor || null,
    stock_tag: phone.stockTag || `CK-${Date.now().toString().slice(-6)}`,
    price_drop: phone.priceDrop ?? false,
    featured: phone.featured ?? false,
    in_box: phone.inBox,
    key_features: phone.keyFeatures || [],
  };
}

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<PhoneItem[]>([]);
  const [userRole, setUserRoleState] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<PhoneItem | null>(null);
  const [activeView, setActiveViewState] = useState<string>('home');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const refreshPhones = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const token = api.getToken();
      const data = await api.get<any>('/api/products', !!token);
      const records = data.products || data;
      const mapped = Array.isArray(records) ? records.map(mapApiProductToPhoneItem) : [];
      setPhones(mapped);
      setApiError(null);
    } catch (err: any) {
      setPhones([]);
      setApiError(err?.message || 'Unable to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPhones();
  }, [refreshPhones]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash && pathname) {
        setUserRole('customer');
        if (pathname.startsWith('stock/')) {
          const id = pathname.replace('stock/', '');
          setActiveViewState('detail');
          setActiveDetailId(id);
          const match = phones.find(p => p.id === id);
          if (match) setSelectedPhone(match);
        } else if (['stock', 'accessories', 'education', 'safety', 'contact'].includes(pathname)) {
          setActiveViewState(pathname === 'education' ? 'education' : pathname);
          setActiveDetailId(null);
        }
        return;
      }
      if (!hash || hash === '' || hash === 'home') {
        setUserRole('customer');
        setActiveViewState('home');
        setActiveDetailId(null);
      } else if (hash.startsWith('stock/')) {
        setUserRole('customer');
        const id = hash.replace('stock/', '');
        setActiveViewState('detail');
        setActiveDetailId(id);
        const match = phones.find(p => p.id === id);
        if (match) setSelectedPhone(match);
      } else if (hash === 'stock') {
        setUserRole('customer');
        setActiveViewState('stock');
        setActiveDetailId(null);
      } else if (hash === 'accessories') {
        setUserRole('customer');
        setActiveViewState('accessories');
        setActiveDetailId(null);
      } else if (hash === 'watches') {
        setUserRole('customer');
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Watches' }));
        setActiveDetailId(null);
      } else if (hash === 'tablets') {
        setUserRole('customer');
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Tablets' }));
        setActiveDetailId(null);
      } else if (hash === 'laptops') {
        setUserRole('customer');
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Laptops' }));
        setActiveDetailId(null);
      } else if (hash === 'gadgets') {
        setUserRole('customer');
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Other Gadgets' }));
        setActiveDetailId(null);
      } else if (hash === 'videos' || hash === 'education') {
        setUserRole('customer');
        setActiveViewState('education');
        setActiveDetailId(null);
      } else if (hash === 'safety') {
        setUserRole('customer');
        setActiveViewState('safety');
        setActiveDetailId(null);
      } else if (hash === 'sales') {
        setUserRole('customer');
        setActiveViewState('home');
        setActiveDetailId(null);
      } else if (hash === 'admin') {
        setUserRole('customer');
        setActiveViewState('home');
        setActiveDetailId(null);
      } else if (hash === 'contact') {
        setUserRole('customer');
        setActiveViewState('contact');
        setActiveDetailId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [phones]);

  const setActiveView = (view: string, phoneId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'detail' && phoneId) {
      setActiveViewState('detail');
      setActiveDetailId(phoneId);
      const match = phones.find(p => p.id === phoneId);
      if (match) setSelectedPhone(match);
      window.location.hash = `#/stock/${phoneId}`;
    } else {
      setActiveViewState(view);
      setActiveDetailId(null);
      if (view === 'home') {
        window.location.hash = '#/';
      } else {
        window.location.hash = `#/${view}`;
      }
    }
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const addPhone = useCallback(async (newPhoneData: Omit<PhoneItem, 'id' | 'dateAdded'>) => {
    const payload = mapPhoneItemToApiPayload(newPhoneData);
    const created = await api.post<any>('/api/products', payload);
    const mapped = mapApiProductToPhoneItem(created);
    setPhones(prev => [mapped, ...prev]);
  }, []);

  const updatePhone = useCallback(async (updatedPhone: PhoneItem) => {
    const payload = mapPhoneItemToApiPayload(updatedPhone);
    await api.patch(`/api/products/${updatedPhone.id}`, payload);
    setPhones(prev => prev.map(p => (p.id === updatedPhone.id ? updatedPhone : p)));
    if (selectedPhone?.id === updatedPhone.id) {
      setSelectedPhone(updatedPhone);
    }
  }, [selectedPhone]);

  const deletePhone = useCallback(async (id: string) => {
    await api.del(`/api/products/${id}`);
    setPhones(prev => prev.filter(p => p.id !== id));
    if (selectedPhone?.id === id) {
      setSelectedPhone(null);
    }
  }, [selectedPhone]);

  const togglePhoneStatus = useCallback(async (id: string) => {
    const phone = phones.find(p => p.id === id);
    if (!phone) return;
    if (phone.status === 'Available') {
      await api.post(`/api/inventory/${id}/status`, { status: 'reserved' });
      setPhones(prev => prev.map(p => p.id === id ? { ...p, status: 'Booked' } : p));
    } else if (phone.status === 'Booked') {
      await api.post(`/api/inventory/${id}/status`, { status: 'sold' });
      setPhones(prev => prev.map(p => p.id === id ? { ...p, status: 'Sold Out' } : p));
    } else {
      await api.post(`/api/inventory/${id}/status`, { status: 'available' });
      setPhones(prev => prev.map(p => p.id === id ? { ...p, status: 'Available' } : p));
    }
  }, [phones]);

  const resetToDefaultStock = () => {
    refreshPhones();
  };

  const getPhoneById = (id: string) => {
    return phones.find(p => p.id === id);
  };

  const availablePhones = phones.filter(p => p.status === 'Available');
  const soldPhones = phones.filter(p => p.status === 'Sold Out');
  const featuredPhones = phones.filter(p => p.featured && p.status === 'Available');

  return (
    <InventoryContext.Provider
      value={{
        phones,
        availablePhones,
        soldPhones,
        featuredPhones,
        selectedPhone,
        setSelectedPhone,
        activeView,
        setActiveView,
        activeDetailId,
        userRole,
        setUserRole,
        filters,
        setFilters,
        resetFilters,
        setCategoryFilter,
        addPhone,
        updatePhone,
        deletePhone,
        togglePhoneStatus,
        resetToDefaultStock,
        getPhoneById,
        refreshPhones,
        loading,
        apiError,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  return context ?? emptyInventoryContext;
};
