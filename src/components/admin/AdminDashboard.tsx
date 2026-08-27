import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  RotateCcw, 
  Smartphone, 
  DollarSign, 
  Package, 
  Search, 
  X,
  Save,
  Download,
  ShieldCheck,
  Tag,
  Eye,
  ArrowRight,
  Sparkles,
  Receipt,
  FileSpreadsheet,
  Upload
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { PhoneItem, ConditionGrade, StockStatus, ProductCategory } from '../../types';
import { formatINR } from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { CustomerDetailsModal } from '../common/CustomerDetailsModal';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { 
    phones, 
    addPhone, 
    updatePhone, 
    deleteInventoryUnit,
    resetToDefaultStock,
    setActiveView,
    setFilters,
    reservePhone,
    releasePhoneReservation,
    sellPhone,
    retirePhone,
    restorePhone,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Booked' | 'Sold Out'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneItem | null>(null);
  const [customerAction, setCustomerAction] = useState<{ item: PhoneItem; action: 'reserve' | 'sell' } | null>(null);

  // Form State with optional MRP and Bill Amount
  const [formData, setFormData] = useState({
    category: 'Phones' as ProductCategory,
    brand: 'Apple' as string,
    model: '',
    storage: '128GB' as string,
    colour: 'Midnight Black',
    colorHex: '#1e293b',
    condition: 'Like New (Flawless)' as ConditionGrade,
    conditionDescription: 'Original display with TrueTone active. 100% verified authentic.',
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

  const submitCustomerAction = async (name: string, phone: string) => {
    if (!customerAction?.item.inventoryUnitId) throw new Error('This product has no physical inventory unit.');
    if (customerAction.action === 'reserve') {
      await reservePhone(customerAction.item.inventoryUnitId, name, phone, 120);
      showToast(`Reserved ${customerAction.item.model} successfully`);
    } else {
      await sellPhone(customerAction.item.inventoryUnitId, name, phone, customerAction.item.price);
      showToast(`Sold ${customerAction.item.model} successfully`);
    }
    setShowAddModal(false);
    setCustomerAction(null);
  };

  // Financial & Operational Metrics for Admin
  const availableItems = phones.filter(p => p.status === 'Available');
  const bookedItems = phones.filter(p => p.status === 'Booked');
  const soldItems = phones.filter(p => p.status === 'Sold Out');
  const totalStockValue = availableItems.reduce((acc, curr) => acc + curr.price, 0);
  const avgUnitPrice = availableItems.length > 0 ? Math.round(totalStockValue / availableItems.length) : 0;

  const categories = ['Phones', 'Watches', 'Tablets', 'Laptops', 'Accessories', 'Other Gadgets'];

  const filteredPhones = phones.filter(p => {
    if (selectedCategory !== 'All') {
      const cat = p.category || 'Phones';
      if (cat !== selectedCategory) return false;
    }
    if (statusFilter !== 'All') {
      if (p.status !== statusFilter) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.storage.toLowerCase().includes(q) ||
      p.colour.toLowerCase().includes(q) ||
      p.stockTag?.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
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
      conditionDescription: 'Original display with TrueTone verified. Clean housing and pristine chassis.',
      batteryHealth: 90,
      price: 34999,
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
      stockTag: `CK-ADM-${Date.now().toString().slice(-4)}`,
      screenSize: '',
      ram: '',
      processor: '',
    });
    setEditingPhone(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (phone: PhoneItem) => {
    setEditingPhone(phone);
    setFormData({
      category: phone.category || 'Phones',
      brand: phone.brand,
      model: phone.model,
      storage: phone.storage,
      colour: phone.colour,
      colorHex: phone.colorHex || '#3b82f6',
      condition: phone.condition,
      conditionDescription: phone.conditionDescription,
      batteryHealth: phone.batteryHealth || 90,
      price: phone.price,
      originalMsp: phone.originalMsp || '',
      billAvailable: phone.billAvailable ?? true,
      billAmount: phone.billAmount || '',
      priceDrop: !!phone.priceDrop,
      featured: !!phone.featured,
      status: phone.status,
      bookingCustomerName: phone.bookingCustomer?.name || '',
      bookingCustomerPhone: phone.bookingCustomer?.phone || '',
      bookingCustomerNote: phone.bookingCustomer?.note || '',
      imageUrl: phone.images[0] || '',
      additionalImageUrl: phone.images[1] || '',
      originalBox: phone.inBox.originalBox,
      chargerIncluded: phone.inBox.chargerIncluded,
      taxInvoiceProvided: phone.inBox.taxInvoiceProvided,
      cableIncluded: phone.inBox.cableIncluded,
      stockTag: phone.stockTag || '',
      screenSize: phone.screenSize || '',
      ram: phone.ram || '',
      processor: phone.processor || '',
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
    if (editingPhone) {
      const updated: PhoneItem = {
        ...editingPhone,
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
        images: imagesArray.length > 0 ? imagesArray : editingPhone.images,
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
          "100% Genuine factory certified stock",
          "Comprehensive in-store diagnostics completed",
          "Tax invoice + warranty provided"
        ],
        inspectionPassed: [
          "Original Factory Display & Digitizer",
          "Biometrics (Face ID / Fingerprint) Verified",
          "Battery Health & Power Cell Certified",
          "Hardware Diagnostics Passed"
        ]
      });
      showToast(`Added ${formData.brand} ${formData.model} to master stock!`);
    }

    setShowAddModal(false);
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Operation failed'}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['StockTag', 'Category', 'Brand', 'Model', 'Storage', 'Colour', 'BatteryHealth', 'Condition', 'SalePrice', 'LaunchMRP', 'BillAvailable', 'BillAmount', 'Status'];
    const rows = phones.map(p => [
      p.stockTag || p.id,
      p.category || 'Phones',
      p.brand,
      `"${p.model}"`,
      p.storage,
      p.colour,
      p.batteryHealth || 'N/A',
      `"${p.condition}"`,
      p.price,
      p.originalMsp || '',
      p.billAvailable ? 'Yes' : 'No',
      p.billAmount || '',
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cortek_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV successfully!');
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

        {/* Top Header Navigation Bar with Direct Buttons */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold uppercase tracking-wider font-mono">
                  Admin Master Portal
                </span>
                <span className="text-xs text-slate-500 font-mono">CORTEK ENTERPRISES</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Stock & Valuation Dashboard
              </h1>
            </div>
          </div>

          {/* Quick Header Buttons for Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              id="admin-add-item-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download full CSV spreadsheet"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
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
              <span>Storefront</span>
            </button>
          </div>

        </div>

        {/* Simple 4-Card Financial Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Live Stock Valuation (₹)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{formatINR(totalStockValue)}</div>
            <p className="text-[11px] text-emerald-600 font-medium">{availableItems.length} available items</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Available Units</span>
              <Smartphone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700">{availableItems.length}</div>
            <p className="text-[11px] text-slate-500">Ready on Karol Bagh floor</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Booked Units</span>
              <Tag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700">{bookedItems.length}</div>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting customer pickup</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Sold Out Units</span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-700">{soldItems.length}</div>
            <p className="text-[11px] text-slate-500">Delivered to customers</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Avg. Unit Price</span>
              <Tag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700">{formatINR(avgUnitPrice)}</div>
            <p className="text-[11px] text-slate-500">Per available unit</p>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Simple & Clean Stock Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tag, model, brand, storage..."
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
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Sold Out">Sold Out</option>
              </select>
              <span className="text-xs text-slate-500 font-mono">{filteredPhones.length} items</span>
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
                  <th className="py-3 px-3 font-bold uppercase">Sale Price & MRP</th>
                  <th className="py-3 px-3 font-bold uppercase">Bill Status</th>
                  <th className="py-3 px-3 font-bold uppercase">Accessories</th>
                  <th className="py-3 px-3 font-bold uppercase">Status</th>
                  <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPhones.map(item => {
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
                          <span className="text-slate-400">Factory OEM</span>
                        )}
                        <div className="text-[10px] text-slate-500">{item.condition.split(' ')[0]}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">{formatINR(item.price)}</div>
                        {item.originalMsp ? (
                          <div className="text-[10px] text-slate-400 line-through">MRP: {formatINR(item.originalMsp)}</div>
                        ) : (
                          <div className="text-[10px] text-slate-400">MRP: N/A</div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {item.billAvailable ? (
                            <div className="text-emerald-700 font-bold flex items-center gap-1">
                              <Receipt className="w-3 h-3" />
                              <span>Bill: Yes</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Bill: No</span>
                          )}
                        </div>
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
                        <div className="flex flex-col items-start gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              item.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : item.status === 'Booked'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.status === 'Booked' && item.bookingCustomer && (
                            <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 max-w-[180px]">
                              {item.bookingCustomer.name} • {item.bookingCustomer.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {item.status === 'Available' && item.inventoryUnitId && (
                            <button
                              onClick={() => setCustomerAction({ item, action: 'reserve' })}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white border border-amber-300 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Reserve
                            </button>
                          )}
                          {(item.status === 'Sold Out' || item.status === 'Retired') && item.inventoryUnitId && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Restore ${item.brand} ${item.model} to available stock?`)) {
                                  restorePhone(item.inventoryUnitId!)
                                    .then(() => showToast(`Restored ${item.model} successfully`))
                                    .catch(error => showToast(`Restore failed: ${error instanceof Error ? error.message : 'Operation failed'}`));
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Restore Stock
                            </button>
                          )}
                          {item.status === 'Booked' && item.inventoryUnitId && (
                            <button
                              onClick={() => {
                                releasePhoneReservation(item.inventoryUnitId!)
                                  .then(() => showToast(`Released ${item.model} successfully`))
                                  .catch(error => showToast(`Release failed: ${error instanceof Error ? error.message : 'Operation failed'}`));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-700 text-white border border-slate-500 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Release Hold
                            </button>
                          )}
                          {(item.status === 'Available' || item.status === 'Booked') && item.inventoryUnitId && (
                            <button
                              onClick={() => setCustomerAction({ item, action: 'sell' })}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Complete Sale
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Permanently delete ${item.brand} ${item.model} (${item.stockTag || 'this unit'})?`)) {
                                await deleteInventoryUnit(item.inventoryUnitId!);
                                showToast(`Deleted ${item.model}`);
                              }
                            }}
                            disabled={!item.inventoryUnitId || item.status === 'Sold Out'}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={item.status === 'Sold Out' ? 'Sold stock cannot be deleted' : 'Permanently delete this stock unit'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    {editingPhone ? 'Edit Stock Item' : 'Add Item to Karol Bagh Stock'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add device specifications, optional launch MRP, and original bill amount.
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
                      <option value="Other Gadgets">Other Gadgets (AirPods, Gimbals)</option>
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
                      placeholder="e.g. iPhone 15 Pro / Galaxy S24 Ultra / MacBook Air M2"
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Stock Tag / Identifier</label>
                    <input
                      type="text"
                      placeholder="e.g. CK-IP15-01"
                      value={formData.stockTag}
                      onChange={e => setFormData({ ...formData, stockTag: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                {/* Storage & Colour & Battery */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Storage</label>
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
                      placeholder="e.g. Natural Titanium / Space Black"
                      value={formData.colour}
                      onChange={e => setFormData({ ...formData, colour: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
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

                  {/* MRP is Optional */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Launch MRP (₹)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Optional retail MRP"
                      value={formData.originalMsp}
                      onChange={e => setFormData({ ...formData, originalMsp: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Stock Status</label>
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm space-y-2">
                      <p className="font-semibold">{formData.status}</p>
                      {editingPhone?.inventoryUnitId && (
                        <div className="flex flex-wrap gap-1.5">
                          {formData.status === 'Available' && (
                            <button type="button" onClick={() => {
                              setCustomerAction({ item: editingPhone, action: 'reserve' });
                            }} className="px-2 py-1 rounded-md bg-amber-500 text-white font-bold text-[11px]">
                              Reserve
                            </button>
                          )}
                          {formData.status === 'Booked' && (
                            <button type="button" onClick={() => releasePhoneReservation(editingPhone.inventoryUnitId!)
                              .then(() => { setShowAddModal(false); showToast(`Released ${editingPhone.model} successfully`); })
                              .catch(error => showToast(`Release failed: ${error instanceof Error ? error.message : 'Operation failed'}`))} className="px-2 py-1 rounded-md bg-slate-600 text-white font-bold text-[11px]">
                              Release Hold
                            </button>
                          )}
                          {(formData.status === 'Available' || formData.status === 'Booked') && (
                            <button type="button" onClick={() => {
                              setCustomerAction({ item: editingPhone, action: 'sell' });
                            }} className="px-2 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px]">
                              Complete Sale
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.status === 'Booked' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Booked By</label>
                      <input
                        type="text"
                        value={formData.bookingCustomerName}
                        onChange={e => setFormData({ ...formData, bookingCustomerName: e.target.value })}
                        placeholder="Customer name"
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.bookingCustomerPhone}
                        onChange={e => setFormData({ ...formData, bookingCustomerPhone: e.target.value })}
                        placeholder="Customer phone"
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Notes</label>
                      <input
                        type="text"
                        value={formData.bookingCustomerNote}
                        onChange={e => setFormData({ ...formData, bookingCustomerNote: e.target.value })}
                        placeholder="Pickup, deposit, etc."
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* Original Bill Section (Optional Bill Amount if Bill Available) */}
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
                    <span className="text-[10px] text-blue-700 font-semibold">Increases buyer trust</span>
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
                  <label className="font-bold text-slate-700">Condition Description</label>
                  <textarea
                    rows={2}
                    value={formData.conditionDescription}
                    onChange={e => setFormData({ ...formData, conditionDescription: e.target.value })}
                    placeholder="Describe display, chassis, parts authenticity..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                {/* In Box items */}
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
                    <span>{editingPhone ? 'Save Changes' : 'Add to Stock'}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {customerAction && (
          <CustomerDetailsModal
            action={customerAction.action}
            productName={`${customerAction.item.brand} ${customerAction.item.model}`}
            onClose={() => setCustomerAction(null)}
            onSubmit={submitCustomerAction}
          />
        )}

      </div>
    </div>
  );
};
