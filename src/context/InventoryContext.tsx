import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PhoneItem, FilterOptions, ProductCategory, ApiProduct } from '../types';
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
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  setCategoryFilter: (category: string) => void;
  addPhone: (phone: Omit<PhoneItem, 'id' | 'dateAdded'>) => Promise<void>;
  updatePhone: (phone: PhoneItem) => Promise<void>;
  deletePhone: (id: string) => Promise<void>;
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
  filters: DEFAULT_FILTERS,
  setFilters: () => undefined,
  resetFilters: () => undefined,
  setCategoryFilter: () => undefined,
  addPhone: async () => undefined,
  updatePhone: async () => undefined,
  deletePhone: async () => undefined,
  resetToDefaultStock: () => undefined,
  getPhoneById: () => undefined,
  refreshPhones: async () => undefined,
  loading: false,
  apiError: null,
};

function mapApiProductToPhoneItem(apiProduct: ApiProduct): PhoneItem {
  const images = apiProduct.images?.map(img => img.url).filter(Boolean) || [];
  const unit = apiProduct.units?.find(candidate => candidate.status === 'available') || apiProduct.units?.[0];
  const statusMap: Record<string, PhoneItem['status']> = {
    available: 'Available',
    reserved: 'Booked',
    sold: 'Sold Out',
    retired: 'Retired',
  };
  const inBox = apiProduct.inBox || {};
  return {
    id: apiProduct.id,
    inventoryUnitId: unit?.id,
    category: (apiProduct.category || 'Phones') as ProductCategory,
    brand: apiProduct.brand,
    model: apiProduct.model,
    storage: apiProduct.storage,
    colour: apiProduct.colour,
    colorHex: apiProduct.colorHex || undefined,
    condition: apiProduct.conditionGrade as PhoneItem['condition'],
    conditionDescription: apiProduct.conditionDescription,
    batteryHealth: apiProduct.batteryHealth ?? undefined,
    price: apiProduct.priceInr,
    originalMsp: apiProduct.originalMsp ?? undefined,
    billAvailable: apiProduct.billAvailable,
    billAmount: apiProduct.billAmount ?? undefined,
    priceDrop: apiProduct.priceDrop,
    featured: apiProduct.featured,
    status: statusMap[unit?.status || 'available'] || 'Available',
    dateAdded: apiProduct.dateAdded || new Date().toISOString().split('T')[0],
    images: images.length > 0 ? images : ['/placeholder-phone.png'],
    inBox: {
      chargerIncluded: inBox.charger_included ?? inBox.chargerIncluded ?? true,
      originalBox: inBox.original_box ?? inBox.originalBox ?? true,
      taxInvoiceProvided: inBox.tax_invoice_provided ?? inBox.taxInvoiceProvided ?? true,
      cableIncluded: inBox.cable_included ?? inBox.cableIncluded ?? true,
      originalBillIncluded: inBox.original_bill_included ?? inBox.originalBillIncluded,
    },
    keyFeatures: apiProduct.keyFeatures || [],
    inspectionPassed: [],
    stockTag: apiProduct.stockTag,
    screenSize: apiProduct.screenSize || undefined,
    ram: apiProduct.ram,
    processor: apiProduct.processor,
  };
}

function mapPhoneItemToApiPayload(phone: Omit<PhoneItem, 'id' | 'dateAdded'>) {
  const payload: Record<string, unknown> = {
    category: phone.category || 'Phones',
    brand: phone.brand,
    model: phone.model,
    storage: phone.storage,
    colour: phone.colour,
    colorHex: phone.colorHex || undefined,
    priceInr: phone.price,
    originalMsp: phone.originalMsp || undefined,
    billAvailable: phone.billAvailable ?? true,
    billAmount: phone.billAmount || undefined,
    conditionGrade: phone.condition,
    conditionDescription: phone.conditionDescription,
    batteryHealth: phone.batteryHealth || undefined,
    screenSize: phone.screenSize || undefined,
    stockTag: phone.stockTag || `CK-${Date.now().toString().slice(-6)}`,
    priceDrop: phone.priceDrop ?? false,
    featured: phone.featured ?? false,
    inBox: phone.inBox,
    keyFeatures: phone.keyFeatures || [],
    images: phone.images.map((url, index) => ({ url, altText: `${phone.brand} ${phone.model}`, sortOrder: index, isPrimary: index === 0 })),
  };

  // Only include optional string fields if they have truthy values (avoid sending null for optional strings)
  if (phone.ram) payload.ram = phone.ram;
  if (phone.processor) payload.processor = phone.processor;
  if (phone.ram === '') payload.ram = undefined;
  if (phone.processor === '') payload.processor = undefined;

  return payload;
}

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<PhoneItem[]>([]);
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
      const data = await api.get<{ products: ApiProduct[] }>('/api/products', !!token);
      const mapped = data.products.map(mapApiProductToPhoneItem);
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

  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash && pathname) {
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
        setActiveViewState('home');
        setActiveDetailId(null);
      } else if (hash.startsWith('stock/')) {
        const id = hash.replace('stock/', '');
        setActiveViewState('detail');
        setActiveDetailId(id);
        const match = phones.find(p => p.id === id);
        if (match) setSelectedPhone(match);
      } else if (hash === 'stock') {
        setActiveViewState('stock');
        setActiveDetailId(null);
      } else if (hash === 'accessories') {
        setActiveViewState('accessories');
        setActiveDetailId(null);
      } else if (hash === 'watches') {
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Watches' }));
        setActiveDetailId(null);
      } else if (hash === 'tablets') {
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Tablets' }));
        setActiveDetailId(null);
      } else if (hash === 'laptops') {
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Laptops' }));
        setActiveDetailId(null);
      } else if (hash === 'gadgets') {
        setActiveViewState('stock');
        setFilters(prev => ({ ...prev, category: 'Other Gadgets' }));
        setActiveDetailId(null);
      } else if (hash === 'videos' || hash === 'education') {
        setActiveViewState('education');
        setActiveDetailId(null);
      } else if (hash === 'safety') {
        setActiveViewState('safety');
        setActiveDetailId(null);
      } else if (hash === 'contact') {
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
    await api.post('/api/products', payload);
    await refreshPhones();
  }, [refreshPhones]);

  const updatePhone = useCallback(async (updatedPhone: PhoneItem) => {
    const payload = mapPhoneItemToApiPayload(updatedPhone);
    await api.patch(`/api/products/${updatedPhone.id}`, payload);
    await refreshPhones();
  }, [refreshPhones]);

  const deletePhone = useCallback(async (id: string) => {
    await api.del(`/api/products/${id}`);
    await refreshPhones();
  }, [refreshPhones]);

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
        filters,
        setFilters,
        resetFilters,
        setCategoryFilter,
        addPhone,
        updatePhone,
        deletePhone,
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
