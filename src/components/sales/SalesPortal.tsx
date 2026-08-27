import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Search, 
  X, 
  Save, 
  Smartphone, 
  Tag, 
  Camera, 
  UserCheck, 
  ArrowRight,
  ShoppingBag,
  Send,
  Eye,
  FileText,
  Receipt,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { PhoneItem, ConditionGrade, StockStatus, ProductCategory, ApiReservation } from '../../types';
import { formatINR, SITE_CONFIG } from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export const SalesPortal: React.FC = () => {
  const { logout } = useAuth();
  const { 
    phones, 
    addPhone, 
    updatePhone, 
    setActiveView,
    refreshPhones,
    reservePhone,
    releasePhoneReservation,
    sellPhone,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Booked' | 'Sold Out'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PhoneItem | null>(null);
  
  // Quick Quotation Modal
  const [quotationItem, setQuotationItem] = useState<PhoneItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [freeGiftNote, setFreeGiftNote] = useState('Free 9H Tempered Glass + In-Store Setup');
  const [workflowBusy, setWorkflowBusy] = useState(false);

  // Form State with optional MRP and Bill Amount
  const [formData, setFormData] = useState({
    category: 'Phones' as ProductCategory,
    brand: 'Apple',
    model: '',
    storage: '128GB',
    colour: 'Midnight Black',
    colorHex: '#1e293b',
    condition: 'Like New (Flawless)' as ConditionGrade,
    conditionDescription: 'Original display, pristine body, tested & verified in store.',
    batteryHealth: 90,
    price: 35000,
    originalMsp: '' as string | number, // Optional
    billAvailable: true,
    billAmount: '' as string | number, // Optional original invoice amount
    priceDrop: false,
    featured: false,
    status: 'Available' as StockStatus,
    bookingCustomerName: '',
    bookingCustomerPhone: '',
    bookingCustomerNote: '',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    additionalImageUrl: '',
    originalBox: true,
    chargerIncluded: true,
    taxInvoiceProvided: true,
    cableIncluded: true,
    stockTag: '',
    screenSize: '',
    ram: '',
    processor: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Operational metrics ONLY (No stock value as required)
  const totalUnits = phones.length;
  const availableUnits = phones.filter(p => p.status === 'Available').length;
  const bookedUnits = phones.filter(p => p.status === 'Booked').length;
  const soldUnits = phones.filter(p => p.status === 'Sold Out').length;

  const categories = ['All', 'Phones', 'Watches', 'Tablets', 'Laptops', 'Accessories', 'Other Gadgets'];

  const filteredItems = phones.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.storage.toLowerCase().includes(q) ||
        p.colour.toLowerCase().includes(q) ||
        p.stockTag?.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
      if (!matchText) return false;
    }

    if (categoryFilter !== 'All') {
      const itemCat = p.category || 'Phones';
      if (itemCat !== categoryFilter) return false;
    }

    if (statusFilter !== 'All') {
      if (p.status !== statusFilter) return false;
    }

    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      category: 'Phones',
      brand: 'Apple',
      model: '',
      storage: '128GB',
      colour: 'Midnight Black',
      colorHex: '#1e293b',
      condition: 'Like New (Flawless)',
      conditionDescription: 'Original display with TrueTone active. 100% genuine factory unit.',
      batteryHealth: 92,
      price: 39999,
      originalMsp: '',
      billAvailable: true,
      billAmount: 79900,
      priceDrop: false,
      featured: false,
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      additionalImageUrl: '',
      originalBox: true,
      chargerIncluded: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
      stockTag: `CK-SLS-${Date.now().toString().slice(-4)}`,
      screenSize: '',
      ram: '',
      processor: '',
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: PhoneItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category || 'Phones',
      brand: item.brand,
      model: item.model,
      storage: item.storage,
      colour: item.colour,
      colorHex: item.colorHex || '#3b82f6',
      condition: item.condition,
      conditionDescription: item.conditionDescription,
      batteryHealth: item.batteryHealth || 90,
      price: item.price,
      originalMsp: item.originalMsp || '',
      billAvailable: item.billAvailable ?? true,
      billAmount: item.billAmount || '',
      priceDrop: !!item.priceDrop,
      featured: !!item.featured,
      status: item.status,
      bookingCustomerName: item.bookingCustomer?.name || '',
      bookingCustomerPhone: item.bookingCustomer?.phone || '',
      bookingCustomerNote: item.bookingCustomer?.note || '',
      imageUrl: item.images[0] || '',
      additionalImageUrl: item.images[1] || '',
      originalBox: item.inBox.originalBox,
      chargerIncluded: item.inBox.chargerIncluded,
      taxInvoiceProvided: item.inBox.taxInvoiceProvided,
      cableIncluded: item.inBox.cableIncluded,
      stockTag: item.stockTag || '',
      screenSize: item.screenSize || '',
      ram: item.ram || '',
      processor: item.processor || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model.trim()) {
      alert('Please enter a product model name');
      return;
    }

    const imagesArray = [formData.imageUrl];
    if (formData.additionalImageUrl.trim()) {
      imagesArray.push(formData.additionalImageUrl.trim());
    }

    const parsedMsp = formData.originalMsp ? Number(formData.originalMsp) : undefined;
    const parsedBillAmount = (formData.billAvailable && formData.billAmount) ? Number(formData.billAmount) : undefined;
    const bookingCustomer = formData.status === 'Booked' && (formData.bookingCustomerName || formData.bookingCustomerPhone)
      ? {
          name: formData.bookingCustomerName || 'Booked Customer',
          phone: formData.bookingCustomerPhone || 'N/A',
          note: formData.bookingCustomerNote || '',
          bookedAt: new Date().toISOString(),
        }
      : null;

    try {
    if (editingItem) {
      const updated: PhoneItem = {
        ...editingItem,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        storage: formData.storage,
        colour: formData.colour,
        colorHex: formData.colorHex,
        condition: formData.condition,
        conditionDescription: formData.conditionDescription,
        batteryHealth: Number(formData.batteryHealth),
        price: Number(formData.price),
        originalMsp: parsedMsp,
        billAvailable: formData.billAvailable,
        billAmount: parsedBillAmount,
        priceDrop: formData.priceDrop,
        featured: formData.featured,
        status: formData.status,
        bookingCustomer,
        images: imagesArray.length > 0 ? imagesArray : editingItem.images,
        stockTag: formData.stockTag,
        screenSize: formData.screenSize,
        ram: formData.ram,
        processor: formData.processor,
        inBox: {
          originalBox: formData.originalBox,
          chargerIncluded: formData.chargerIncluded,
          taxInvoiceProvided: formData.taxInvoiceProvided,
          cableIncluded: formData.cableIncluded,
          originalBillIncluded: formData.billAvailable
        }
      };
      await updatePhone(updated);
      showToast(`Updated ${formData.model} successfully`);
    } else {
      await addPhone({
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        storage: formData.storage,
        colour: formData.colour,
        colorHex: formData.colorHex,
        condition: formData.condition,
        conditionDescription: formData.conditionDescription,
        batteryHealth: Number(formData.batteryHealth),
        price: Number(formData.price),
        originalMsp: parsedMsp,
        billAvailable: formData.billAvailable,
        billAmount: parsedBillAmount,
        priceDrop: formData.priceDrop,
        featured: formData.featured,
        status: formData.status,
        bookingCustomer,
        images: imagesArray.length > 0 ? imagesArray : [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
        ],
        stockTag: formData.stockTag || `CK-${Date.now().toString().slice(-4)}`,
        screenSize: formData.screenSize,
        ram: formData.ram,
        processor: formData.processor,
        inBox: {
          originalBox: formData.originalBox,
          chargerIncluded: formData.chargerIncluded,
          taxInvoiceProvided: formData.taxInvoiceProvided,
          cableIncluded: formData.cableIncluded,
          originalBillIncluded: formData.billAvailable
        },
        keyFeatures: [
          "100% Genuine pre-owned unit verified by CORTEK ENTERPRISES",
          "In-store testing warranty & original parts verified",
          "Tested and ready for counter handover"
        ],
        inspectionPassed: [
          "Original Factory Screen & Housing Passed",
          "Biometrics & Hardware Sensors Verified",
          "Battery Health Authenticated",
          "Network & Connectivity Tested"
        ]
      });
      showToast(`Added ${formData.brand} ${formData.model} to stock!`);
    }

    setShowAddModal(false);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Operation failed'}`);
    }
  };

  const handleSendWhatsAppQuotation = (item: PhoneItem) => {
    const finalPrice = Math.max(0, item.price - discountAmount);
    const message = `*CORTEK ENTERPRISES - SPECIAL COUNTER QUOTATION*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello ${customerName || 'Valued Customer'},\n\n` +
      `Here is the currently listed unit at our Karol Bagh store:\n\n` +
      `📱 *Device:* ${item.brand} ${item.model}\n` +
      `🏷️ *Category:* ${item.category || 'Phones'}\n` +
      `💾 *Storage:* ${item.storage} | *Colour:* ${item.colour}\n` +
      `✨ *Condition:* ${item.condition}\n` +
      (item.batteryHealth ? `🔋 *Battery Health:* ${item.batteryHealth}%\n` : '') +
      (item.billAvailable && item.billAmount ? `🧾 *Original Bill Amount:* ₹${item.billAmount.toLocaleString('en-IN')}\n` : '') +
      `🏷️ *Stock Tag / ID:* ${item.stockTag || item.id}\n\n` +
      `💰 *Special Deal Price:* ₹${finalPrice.toLocaleString('en-IN')}` +
      (discountAmount > 0 ? ` _(Special ₹${discountAmount.toLocaleString('en-IN')} off applied)_` : '') +
      `\n🎁 *Included In-Store:* ${freeGiftNote}\n` +
      `🧾 *Invoice:* Store Purchase Bill + In-Store Testing Warranty\n\n` +
      `📍 *Store Location:* CORTEK ENTERPRISES, Arya Samaj Road, Karol Bagh, New Delhi (Near Metro Gate 4)\n` +
      `📞 *Counter Contact:* ${SITE_CONFIG.displayPhone}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Reply to lock this unit or visit us today!`;

    const targetNumber = customerPhone.replace(/[^0-9]/g, '') || SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${targetNumber.length === 10 ? '91' + targetNumber : targetNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setQuotationItem(null);
    showToast('WhatsApp Quotation generated!');
  };

  const handleReserve = async (item: PhoneItem) => {
    if (!item.inventoryUnitId || !customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      showToast('Customer name, phone, and a physical inventory unit are required.');
      return;
    }
    setWorkflowBusy(true);
    try {
      await reservePhone(item.inventoryUnitId, customerName.trim(), customerPhone.replace(/\D/g, ''), 120);
      await refreshPhones();
      setQuotationItem(null);
      showToast(`Reserved ${item.model} successfully`);
    } catch (error) {
      showToast(`Reservation failed: ${error instanceof Error ? error.message : 'Operation failed'}`);
    } finally {
      setWorkflowBusy(false);
    }
  };

  const handleSell = async (item: PhoneItem) => {
    if (!item.inventoryUnitId || !customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      showToast('Customer name, phone, and a physical inventory unit are required.');
      return;
    }
    setWorkflowBusy(true);
    try {
      let reservationId: string | undefined;
      if (item.status === 'Booked') {
        const reservations = await api.get<ApiReservation[]>('/api/reservations');
        reservationId = reservations.find(reservation =>
          reservation.inventoryUnitId === item.inventoryUnitId &&
          ['pending', 'active'].includes(reservation.status)
        )?.id;
      }
      await sellPhone(item.inventoryUnitId, customerName.trim(), customerPhone.replace(/\D/g, ''), Math.max(0, item.price - discountAmount), discountAmount, reservationId);
      await refreshPhones();
      setQuotationItem(null);
      showToast(`Sold ${item.model} successfully`);
    } catch (error) {
      showToast(`Sale failed: ${error instanceof Error ? error.message : 'Operation failed'}`);
    } finally {
      setWorkflowBusy(false);
    }
  };

  const handleCancelReservation = async (item: PhoneItem) => {
    if (!item.inventoryUnitId) {
      showToast('This product has no physical inventory unit.');
      return;
    }
    setWorkflowBusy(true);
    try {
      await releasePhoneReservation(item.inventoryUnitId);
      await refreshPhones();
      setQuotationItem(null);
      showToast(`Released ${item.model} successfully`);
    } catch (error) {
      showToast(`Release failed: ${error instanceof Error ? error.message : 'Operation failed'}`);
    } finally {
      setWorkflowBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>
        )}

        {/* Sales Header Navigation Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200 shrink-0">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold uppercase tracking-wider font-mono">
                  Sales Representative Window
                </span>
                <span className="text-xs text-slate-500 font-mono">CORTEK ENTERPRISES</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Store Sales & Stock Counter
              </h1>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              id="sales-add-stock-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>

            <button onClick={logout} className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold cursor-pointer">
              Sign Out
            </button>

            <button
              onClick={() => {
                setActiveView('stock');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>Customer Storefront</span>
            </button>

          </div>
        </div>

        {/* Operational Metrics (No valuation) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Catalog</span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalUnits}</div>
            <p className="text-[11px] text-slate-500">Tracked showroom units</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Available for Handover</span>
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">{availableUnits}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Ready in Karol Bagh</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Booked Units</span>
              <Tag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700">{bookedUnits}</div>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting pickup</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Sold Deals</span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-700">{soldUnits}</div>
            <p className="text-[11px] text-slate-500">Delivered</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stock Inventory Table & Quick Operations */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search stock tag, model, brand, storage..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Units Only</option>
                <option value="Booked">Booked Units</option>
                <option value="Sold Out">Sold Out Units</option>
              </select>

              <span className="text-xs text-slate-500 font-mono">
                {filteredItems.length} items
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-3 font-bold uppercase">Item & Photo</th>
                  <th className="py-3 px-3 font-bold uppercase">Category & Tag</th>
                  <th className="py-3 px-3 font-bold uppercase">Specs / Battery</th>
                  <th className="py-3 px-3 font-bold uppercase">Sale Price</th>
                  <th className="py-3 px-3 font-bold uppercase">Bill</th>
                  <th className="py-3 px-3 font-bold uppercase">Accessories</th>
                  <th className="py-3 px-3 font-bold uppercase">Mark Status</th>
                  <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                  const isAvailable = item.status === 'Available';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.brand} {item.model}</div>
                            <div className="text-[11px] text-slate-500">
                              {item.storage !== 'N/A' && `${item.storage} • `}{item.colour}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                          {item.category || 'Phones'}
                        </span>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">{item.stockTag || item.id}</div>
                      </td>

                      <td className="py-3 px-3">
                        {item.batteryHealth ? (
                          <span className={`font-bold ${item.batteryHealth >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {item.batteryHealth}% Battery
                          </span>
                        ) : (
                          <span className="text-slate-400">OEM</span>
                        )}
                        <div className="text-[10px] text-slate-500">{item.condition.split(' ')[0]}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">{formatINR(item.price)}</div>
                        {item.priceDrop && <span className="text-[10px] text-amber-700 font-bold">Price Drop</span>}
                      </td>

                      <td className="py-3 px-3">
                        {item.billAvailable ? (
                          <div className="text-emerald-700 font-bold flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            <span>Bill: Yes</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Bill: No</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1 text-[10px] font-bold">
                          <div className={item.inBox.chargerIncluded ? 'text-emerald-700' : 'text-slate-400'}>
                            Charger: {item.inBox.chargerIncluded ? 'Yes' : 'No'}
                          </div>
                          <div className={item.inBox.cableIncluded ? 'text-emerald-700' : 'text-slate-400'}>
                            Cable: {item.inBox.cableIncluded ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isAvailable ? 'Available' : 'Sold Out'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {item.status === 'Available' && (
                            <button
                              onClick={() => {
                                const name = window.prompt('Customer name for reservation');
                                if (!name) return;
                                const phone = window.prompt('Customer WhatsApp/mobile number');
                                if (!phone || phone.replace(/\D/g, '').length < 10) {
                                  showToast('A valid customer phone number is required for reservation.');
                                  return;
                                }
                                if (!item.inventoryUnitId) {
                                  showToast('This product has no physical inventory unit.');
                                  return;
                                }
                                setWorkflowBusy(true);
                                reservePhone(item.inventoryUnitId, name.trim(), phone.replace(/\D/g, ''), 120)
                                  .then(() => { showToast(`Reserved ${item.model} successfully`); return refreshPhones(); })
                                  .catch(error => showToast(`Reservation failed: ${error instanceof Error ? error.message : 'Operation failed'}`))
                                  .finally(() => setWorkflowBusy(false));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white border border-amber-300 font-bold text-[11px] cursor-pointer transition-colors"
                              title="Reserve"
                            >
                              Reserve
                            </button>
                          )}
                          {item.status === 'Booked' && (
                            <button
                              onClick={() => {
                                if (!item.inventoryUnitId) return;
                                setWorkflowBusy(true);
                                releasePhoneReservation(item.inventoryUnitId)
                                  .then(() => { showToast(`Released ${item.model} successfully`); return refreshPhones(); })
                                  .catch(error => showToast(`Release failed: ${error instanceof Error ? error.message : 'Operation failed'}`))
                                  .finally(() => setWorkflowBusy(false));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-700 text-white border border-slate-500 font-bold text-[11px] cursor-pointer transition-colors"
                              title="Release Hold"
                            >
                              Release Hold
                            </button>
                          )}
                          {(item.status === 'Available' || item.status === 'Booked') && (
                            <button
                              onClick={() => {
                                const name = window.prompt('Customer name for sale');
                                if (!name) return;
                                const phone = window.prompt('Customer WhatsApp/mobile number');
                                if (!phone || phone.replace(/\D/g, '').length < 10) {
                                  showToast('A valid customer phone number is required for sale.');
                                  return;
                                }
                                if (!item.inventoryUnitId) {
                                  showToast('This product has no physical inventory unit.');
                                  return;
                                }
                                let reservationId: string | undefined;
                                if (item.status === 'Booked') {
                                  void api.get<ApiReservation[]>('/api/reservations').then(reservations => {
                                    reservationId = reservations.find(candidate =>
                                      candidate.inventoryUnitId === item.inventoryUnitId && ['pending', 'active'].includes(candidate.status)
                                    )?.id;
                                    return sellPhone(item.inventoryUnitId!, name.trim(), phone.replace(/\D/g, ''), item.price, 0, reservationId);
                                  }).then(() => {
                                    showToast(`Sold ${item.model} successfully`);
                                    return refreshPhones();
                                  }).catch(error => showToast(`Sale failed: ${error instanceof Error ? error.message : 'Operation failed'}`))
                                    .finally(() => setWorkflowBusy(false));
                                  return;
                                }
                                setWorkflowBusy(true);
                                sellPhone(item.inventoryUnitId, name.trim(), phone.replace(/\D/g, ''), item.price, 0)
                                  .then(() => { showToast(`Sold ${item.model} successfully`); return refreshPhones(); })
                                  .catch(error => showToast(`Sale failed: ${error instanceof Error ? error.message : 'Operation failed'}`))
                                  .finally(() => setWorkflowBusy(false));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 font-bold text-[11px] cursor-pointer transition-colors"
                              title="Complete Sale"
                            >
                              Complete Sale
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setQuotationItem(item);
                              setCustomerName('');
                              setCustomerPhone('');
                              setDiscountAmount(0);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Generate WhatsApp Quote"
                          >
                            <Send className="w-3 h-3" />
                            <span>Quote</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Add / Edit Gadget Modal with Optional MRP and Bill Amount */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    {editingItem ? 'Edit Item' : 'Add Item to Showroom'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add new phone, watch, laptop or gadget.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-blue-500"
                    >
                      <option value="Phones">Smartphones (Phones)</option>
                      <option value="Watches">Smartwatches (Watches)</option>
                      <option value="Tablets">iPads & Tablets</option>
                      <option value="Laptops">MacBooks & Laptops</option>
                      <option value="Accessories">Accessories & Chargers</option>
                      <option value="Other Gadgets">Other Gadgets</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Google">Google</option>
                      <option value="Nothing">Nothing</option>
                      <option value="Dell">Dell</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="DJI">DJI</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Other">Other Brand</option>
                    </select>
                  </div>
                </div>

                {/* Model & Stock Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Product Model Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 14 Pro Max / Galaxy Watch 6"
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Stock Tag / IMEI Identifier</label>
                    <input
                      type="text"
                      placeholder="e.g. CK-SLS-08"
                      value={formData.stockTag}
                      onChange={e => setFormData({ ...formData, stockTag: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                {/* Storage & Colour & Battery */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Storage / Capacity</label>
                    <select
                      value={formData.storage}
                      onChange={e => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    >
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                      <option value="2TB">2TB</option>
                      <option value="N/A">N/A (Accessories)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Colour</label>
                    <input
                      type="text"
                      placeholder="e.g. Space Black / Titanium"
                      value={formData.colour}
                      onChange={e => setFormData({ ...formData, colour: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Battery Health (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={formData.batteryHealth}
                      onChange={e => setFormData({ ...formData, batteryHealth: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                {/* Price, Optional MRP & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Counter Sale Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                    />
                  </div>

                  {/* MRP Optional */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Original MRP (₹)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Optional retail price"
                      value={formData.originalMsp}
                      onChange={e => setFormData({ ...formData, originalMsp: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Stock Status</label>
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm space-y-2">
                      <p className="font-semibold">{formData.status}</p>
                      {editingItem?.inventoryUnitId && (
                        <div className="flex flex-wrap gap-1.5">
                          {formData.status === 'Available' && (
                            <button type="button" onClick={() => handleReserve(editingItem).then(() => setShowAddModal(false))} className="px-2 py-1 rounded-md bg-amber-500 text-white font-bold text-[11px]">
                              Reserve
                            </button>
                          )}
                          {formData.status === 'Booked' && (
                            <button type="button" onClick={() => releasePhoneReservation(editingItem.inventoryUnitId!).then(() => { setShowAddModal(false); showToast(`Released ${editingItem.model} successfully`); }).catch(error => showToast(`Release failed: ${error instanceof Error ? error.message : 'Operation failed'}`))} className="px-2 py-1 rounded-md bg-slate-600 text-white font-bold text-[11px]">
                              Release Hold
                            </button>
                          )}
                          {(formData.status === 'Available' || formData.status === 'Booked') && (
                            <button type="button" onClick={() => handleSell(editingItem).then(() => setShowAddModal(false))} className="px-2 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px]">
                              Complete Sale
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Original Bill Section */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                      <input
                        type="checkbox"
                        checked={formData.billAvailable}
                        onChange={e => setFormData({ ...formData, billAvailable: e.target.checked })}
                        className="accent-blue-600 w-4 h-4 rounded"
                      />
                      <Receipt className="w-4 h-4 text-blue-700" />
                      <span>Original Purchase / Store Bill Available</span>
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold">Verified invoice</span>
                  </div>

                  {formData.billAvailable && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 flex items-center justify-between">
                          <span>Original Bill Purchase Amount (₹)</span>
                          <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 79900"
                          value={formData.billAmount}
                          onChange={e => setFormData({ ...formData, billAmount: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Condition Grade</label>
                        <select
                          value={formData.condition}
                          onChange={e => setFormData({ ...formData, condition: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl bg-white border border-blue-200 text-slate-900"
                        >
                          <option value="Like New (Flawless)">Like New (Flawless)</option>
                          <option value="Excellent (9.5/10)">Excellent (9.5/10)</option>
                          <option value="Very Good (8.5/10)">Very Good (8.5/10)</option>
                          <option value="Good (Minor Marks)">Good (Minor Marks)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Photo Upload */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Product Photo</label>
                  <label className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>{formData.imageUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const uploaded = await api.uploadImage(file);
                          setFormData(prev => ({ ...prev, imageUrl: uploaded.url }));
                        } catch (error) {
                          showToast(`Upload failed: ${error instanceof Error ? error.message : 'Operation failed'}`);
                        }
                      }}
                    />
                  </label>
                  {formData.imageUrl && <span className="text-[10px] text-slate-500">A photo is selected for this item.</span>}
                </div>

                {/* Condition Notes */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Condition Notes</label>
                  <textarea
                    rows={2}
                    value={formData.conditionDescription}
                    onChange={e => setFormData({ ...formData, conditionDescription: e.target.value })}
                    placeholder="Describe display, frame, scratch status..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                {/* In Box Inclusions */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.originalBox}
                      onChange={e => setFormData({ ...formData, originalBox: e.target.checked })}
                      className="accent-blue-600"
                    />
                    <span>Original Box</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.taxInvoiceProvided}
                      onChange={e => setFormData({ ...formData, taxInvoiceProvided: e.target.checked })}
                      className="accent-blue-600"
                    />
                    <span>Store Bill</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.chargerIncluded}
                      onChange={e => setFormData({ ...formData, chargerIncluded: e.target.checked })}
                      className="accent-blue-600"
                    />
                    <span>Charger</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cableIncluded}
                      onChange={e => setFormData({ ...formData, cableIncluded: e.target.checked })}
                      className="accent-blue-600"
                    />
                    <span>Cable</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.priceDrop}
                      onChange={e => setFormData({ ...formData, priceDrop: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-amber-700 font-bold">Price Drop</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'Save Updates' : 'Add to Stock'}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* WhatsApp Quotation Modal */}
        {quotationItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl text-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Send className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Quick WhatsApp Quotation</h3>
                    <p className="text-[11px] text-slate-500">{quotationItem.brand} {quotationItem.model} ({quotationItem.storage})</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuotationItem(null)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Counter Price</label>
                    <div className="p-2.5 rounded-xl bg-slate-100 font-bold text-slate-900">{formatINR(quotationItem.price)}</div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Special In-Store Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      placeholder="0"
                      value={discountAmount || ''}
                      onChange={e => setDiscountAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Free Inclusions / Perks</label>
                  <input
                    type="text"
                    value={freeGiftNote}
                    onChange={e => setFreeGiftNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={workflowBusy || quotationItem.status !== 'Booked'}
                  onClick={() => handleCancelReservation(quotationItem)}
                  className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 text-white font-bold cursor-pointer"
                >
                  {workflowBusy ? 'Saving...' : 'Release Hold'}
                </button>
                <button
                  type="button"
                  disabled={workflowBusy || quotationItem.status !== 'Available'}
                  onClick={() => handleReserve(quotationItem)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold cursor-pointer"
                >
                  {workflowBusy ? 'Saving...' : 'Reserve Unit'}
                </button>
                <button
                  type="button"
                  disabled={workflowBusy || quotationItem.status === 'Sold Out' || quotationItem.status === 'Retired'}
                  onClick={() => handleSell(quotationItem)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold cursor-pointer"
                >
                  {workflowBusy ? 'Saving...' : 'Complete Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setQuotationItem(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={workflowBusy}
                  onClick={() => handleSendWhatsAppQuotation(quotationItem)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Quote on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
