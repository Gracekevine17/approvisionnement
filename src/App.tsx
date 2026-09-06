/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { EquipmentList } from './components/EquipmentList';
import { CategoriesView } from './components/CategoriesView';
import { DeliveriesView } from './components/DeliveriesView';
import { DispatchesView } from './components/DispatchesView';
import { SuppliersView } from './components/SuppliersView';
import { AlertsPanel } from './components/AlertsPanel';
import { RemindersView } from './components/RemindersView';
import { LoginScreen } from './components/LoginScreen';

import { EquipmentModal } from './components/EquipmentModal';
import { CategoryModal } from './components/CategoryModal';
import { DeliveryModal } from './components/DeliveryModal';
import { DispatchModal } from './components/DispatchModal';
import { ThresholdManagerModal } from './components/ThresholdManagerModal';
import { SupplyOrderModal } from './components/SupplyOrderModal';

import { ActiveTab, Equipment, Category, Delivery, Dispatch, Reminder, Supplier, AppUser } from './types';
import { 
  INITIAL_EQUIPMENT, 
  INITIAL_CATEGORIES, 
  INITIAL_DELIVERIES, 
  INITIAL_DISPATCHES, 
  INITIAL_REMINDERS, 
  INITIAL_SUPPLIERS 
} from './data/mockData';
import { playThresholdAlertSound } from './utils/audioAlert';
import { exportEquipmentToCSV, formatCurrency } from './utils/stockUtils';
import { CheckCircle2, AlertTriangle, RotateCcw, Info, Sliders, History, BarChart3, FileSpreadsheet } from 'lucide-react';

export default function App() {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('batistock_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });

  // Clean slate for Admin data entry: everything starts strictly at 0
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_equipment_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_categories_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_deliveries_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dispatches, setDispatches] = useState<Dispatch[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_dispatches_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_reminders_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('batistock_suppliers_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('batistock_sound_alerts');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Modal states
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSupplyOrderOpen, setIsSupplyOrderOpen] = useState(false);
  const [isThresholdManagerOpen, setIsThresholdManagerOpen] = useState(false);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>();
  const [suggestedQuantity, setSuggestedQuantity] = useState<number | undefined>();
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Guarantee clean slate 0 data on initial setup
  useEffect(() => {
    if (!localStorage.getItem('batistock_zero_slate_v3')) {
      localStorage.removeItem('batistock_equipment_v2');
      localStorage.removeItem('batistock_categories_v2');
      localStorage.removeItem('batistock_deliveries_v2');
      localStorage.removeItem('batistock_dispatches_v2');
      localStorage.removeItem('batistock_reminders_v2');
      localStorage.removeItem('batistock_equipment_v1');
      localStorage.removeItem('batistock_equipment');

      localStorage.setItem('batistock_equipment_v3', JSON.stringify([]));
      localStorage.setItem('batistock_categories_v3', JSON.stringify([]));
      localStorage.setItem('batistock_deliveries_v3', JSON.stringify([]));
      localStorage.setItem('batistock_dispatches_v3', JSON.stringify([]));
      localStorage.setItem('batistock_reminders_v3', JSON.stringify([]));
      localStorage.setItem('batistock_suppliers_v3', JSON.stringify([]));
      localStorage.setItem('batistock_zero_slate_v3', 'true');

      setEquipment([]);
      setCategories([]);
      setDeliveries([]);
      setDispatches([]);
      setReminders([]);
      setSuppliers([]);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('batistock_equipment_v3', JSON.stringify(equipment));
    } catch (e) {
      console.error(e);
    }
  }, [equipment]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_categories_v3', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_deliveries_v3', JSON.stringify(deliveries));
    } catch (e) {
      console.error(e);
    }
  }, [deliveries]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_dispatches_v3', JSON.stringify(dispatches));
    } catch (e) {
      console.error(e);
    }
  }, [dispatches]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_reminders_v3', JSON.stringify(reminders));
    } catch (e) {
      console.error(e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_suppliers_v3', JSON.stringify(suppliers));
    } catch (e) {
      console.error(e);
    }
  }, [suppliers]);

  useEffect(() => {
    try {
      localStorage.setItem('batistock_sound_alerts', JSON.stringify(soundEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  // Auth Handlers
  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    localStorage.setItem('batistock_current_user', JSON.stringify(user));
    localStorage.setItem('batistock_user_name', user.name);
    localStorage.setItem('batistock_user_role', user.role);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('batistock_current_user');
    localStorage.removeItem('batistock_user_name');
    localStorage.removeItem('batistock_user_role');
    showToast('You have signed out successfully.', 'info');
  };

  // Alert calculations
  const itemsUnderThreshold = equipment.filter((e) => e.currentStock <= e.minThreshold);
  const criticalItems = itemsUnderThreshold.filter((e) => e.currentStock === 0 || e.currentStock < e.minThreshold * 0.5);
  const alertsCount = itemsUnderThreshold.length;
  const activeRemindersCount = reminders.filter((r) => !r.completed).length;

  // --- Handlers: Category Management (Site Manager input) ---
  const handleSaveCategory = (categoryData: Omit<Category, 'id'>, id?: string) => {
    if (id) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, ...categoryData } : cat))
      );
      showToast(`Category "${categoryData.name}" updated successfully.`);
    } else {
      const newCategory: Category = {
        ...categoryData,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [newCategory, ...prev]);
      showToast(`New category "${categoryData.name}" created for jobsite "${categoryData.siteName}".`);
    }
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    // Check if equipment is using this category
    const countInUse = equipment.filter((e) => e.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (countInUse > 0) {
      if (!window.confirm(`This category contains ${countInUse} equipment item(s). Are you sure you want to delete it?`)) {
        return;
      }
    }

    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast(`Category "${cat.name}" deleted.`);
  };

  // --- Handlers: Equipment & Thresholds ---
  const handleSaveEquipment = (equipmentData: Omit<Equipment, 'id' | 'lastUpdated'>, id?: string) => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (id) {
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...equipmentData, lastUpdated: nowStr }
            : item
        )
      );
      showToast(`Equipment "${equipmentData.name}" updated.`);
    } else {
      const newEquipment: Equipment = {
        ...equipmentData,
        id: `eqp-${Date.now()}`,
        lastUpdated: nowStr,
      };
      setEquipment((prev) => [newEquipment, ...prev]);

      // Check if newly created item is at/below minimum threshold defined by user
      if (newEquipment.currentStock <= newEquipment.minThreshold) {
        if (soundEnabled) {
          playThresholdAlertSound();
        }
        showToast(
          `Notice: "${newEquipment.name}" is at or below minimum threshold (${newEquipment.currentStock} / ${newEquipment.minThreshold} ${newEquipment.unit}).`,
          'warning'
        );
      } else {
        showToast(`"${newEquipment.name}" added to inventory.`);
      }
    }

    setIsEquipmentOpen(false);
    setEquipmentToEdit(null);
  };

  const handleDeleteEquipment = (id: string) => {
    const item = equipment.find((e) => e.id === id);
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    showToast(`Equipment "${item?.name || id}" removed from inventory.`);
  };

  const handleUpdateThreshold = (id: string, newThreshold: number) => {
    const target = equipment.find((e) => e.id === id);
    if (!target) return;

    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, minThreshold: newThreshold } : item))
    );

    const isNowAtOrUnder = target.currentStock <= newThreshold;
    if (isNowAtOrUnder && soundEnabled) {
      playThresholdAlertSound();
    }

    showToast(
      `Safety threshold for "${target.name}" set to ${newThreshold} ${target.unit}.` +
        (isNowAtOrUnder ? ` Low stock replenishment alert triggered!` : ``),
      isNowAtOrUnder ? 'warning' : 'info'
    );
  };

  const handleBatchUpdateThresholds = (updatedThresholds: Record<string, number>) => {
    setEquipment((prev) =>
      prev.map((item) => {
        if (updatedThresholds[item.id] !== undefined) {
          return { ...item, minThreshold: updatedThresholds[item.id] };
        }
        return item;
      })
    );
    showToast('All custom safety thresholds saved and applied.');
    setIsThresholdManagerOpen(false);
  };

  // --- Handlers: Inbound Deliveries (GRN / Goods Receipt Note) ---
  const handleSaveDelivery = (deliveryData: Omit<Delivery, 'id'>) => {
    const newDelivery: Delivery = {
      ...deliveryData,
      id: `del-${Date.now()}`,
    };

    setDeliveries((prev) => [newDelivery, ...prev]);

    // Increase stock for target equipment
    setEquipment((prev) =>
      prev.map((item) => {
        if (item.id === deliveryData.equipmentId) {
          const newStock = item.currentStock + deliveryData.quantity;
          return {
            ...item,
            currentStock: newStock,
            lastUpdated: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return item;
      })
    );

    showToast(
      `Receipt recorded: +${deliveryData.quantity} ${deliveryData.unit} added for ${deliveryData.equipmentName}. Stock replenished.`
    );
    setIsDeliveryOpen(false);
  };

  // --- Handlers: Outbound Dispatches (Jobsite) ---
  const handleSaveDispatch = (dispatchData: Omit<Dispatch, 'id'>) => {
    const targetItem = equipment.find((e) => e.id === dispatchData.equipmentId);
    if (!targetItem) return;

    if (dispatchData.quantity > targetItem.currentStock) {
      alert(`Insufficient stock! Available in depot: ${targetItem.currentStock} ${targetItem.unit}.`);
      return;
    }

    const newDispatch: Dispatch = {
      ...dispatchData,
      id: `disp-${Date.now()}`,
    };

    setDispatches((prev) => [newDispatch, ...prev]);

    // Decrease stock
    const newStock = targetItem.currentStock - dispatchData.quantity;
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === dispatchData.equipmentId
          ? {
              ...item,
              currentStock: newStock,
              lastUpdated: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : item
      )
    );

    // Check if new stock crossed or fell below minimum safety threshold
    if (newStock <= targetItem.minThreshold) {
      if (soundEnabled) {
        playThresholdAlertSound();
      }
      showToast(
        `🚨 SAFETY THRESHOLD ALERT: "${targetItem.name}" only has ${newStock} ${targetItem.unit} remaining (Threshold: ${targetItem.minThreshold})!`,
        'warning'
      );
    } else {
      showToast(
        `Dispatch confirmed: -${dispatchData.quantity} ${dispatchData.unit} deployed to "${dispatchData.siteName}".`
      );
    }

    setIsDispatchOpen(false);
  };

  const handleReturnEquipment = (dispatchId: string, returnQuantity: number) => {
    const disp = dispatches.find((d) => d.id === dispatchId);
    if (!disp) return;

    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          const newReturned = (d.returnedQuantity || 0) + returnQuantity;
          return {
            ...d,
            returnedQuantity: newReturned,
            returnStatus: newReturned >= d.quantity ? 'RETURNED' : 'PARTIAL_RETURN',
          };
        }
        return d;
      })
    );

    // Increase stock in warehouse
    setEquipment((prev) =>
      prev.map((item) => {
        if (item.id === disp.equipmentId) {
          return {
            ...item,
            currentStock: item.currentStock + returnQuantity,
          };
        }
        return item;
      })
    );

    showToast(`Depot return confirmed: +${returnQuantity} ${disp.unit} returned to central inventory.`);
  };

  // --- Handlers: Reminders ---
  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddReminder = (newRem: Omit<Reminder, 'id'>) => {
    const item: Reminder = {
      ...newRem,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [item, ...prev]);
    showToast('Reminder scheduled successfully.');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    showToast(`Supplier "${newSupplier.name}" added successfully.`);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('Supplier deleted from directory.', 'info');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Do you want to reset and load standard demonstration data for BATISTOCK?')) {
      setEquipment(INITIAL_EQUIPMENT);
      setCategories(INITIAL_CATEGORIES);
      setDeliveries(INITIAL_DELIVERIES);
      setDispatches(INITIAL_DISPATCHES);
      setReminders(INITIAL_REMINDERS);
      showToast('Demo data restored successfully.');
    }
  };

  const handleClearForAdminStart = () => {
    if (window.confirm('Do you want to clear all data to 0 (inventory, receipts, dispatches, alerts) to start entering your actual jobsite records?')) {
      setEquipment([]);
      setCategories([]);
      setDeliveries([]);
      setDispatches([]);
      setReminders([]);
      setSuppliers([]);
      localStorage.setItem('batistock_equipment_v3', JSON.stringify([]));
      localStorage.setItem('batistock_categories_v3', JSON.stringify([]));
      localStorage.setItem('batistock_deliveries_v3', JSON.stringify([]));
      localStorage.setItem('batistock_dispatches_v3', JSON.stringify([]));
      localStorage.setItem('batistock_reminders_v3', JSON.stringify([]));
      localStorage.setItem('batistock_suppliers_v3', JSON.stringify([]));
      showToast('All inventory and operational records reset to 0.');
    }
  };

  const handleLoadSampleData = () => {
    setEquipment(INITIAL_EQUIPMENT);
    setCategories(INITIAL_CATEGORIES);
    setDeliveries(INITIAL_DELIVERIES);
    setDispatches(INITIAL_DISPATCHES);
    showToast('Sample dataset loaded for automated calculation testing.');
  };

  // Open modal helpers
  const openNewDeliveryForEquipment = (equipmentId?: string, suggestedQty?: number) => {
    setSelectedEquipmentId(equipmentId);
    setSuggestedQuantity(suggestedQty);
    setIsDeliveryOpen(true);
  };

  const openNewDispatchForEquipment = (equipmentId?: string) => {
    setSelectedEquipmentId(equipmentId);
    setIsDispatchOpen(true);
  };

  // If user signed out, display Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/90 font-sans text-slate-800 antialiased flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold border ${
              toastMessage.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400/40'
                : toastMessage.type === 'info'
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-white animate-bounce" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          alertsCount={alertsCount}
          remindersCount={activeRemindersCount}
          categoriesCount={categories.length}
          onLogout={handleLogout}
        />

        {/* Right Content Area */}
        <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
          {/* Top Bar with Profile and Hamburger */}
          <TopBar
            activeTab={activeTab}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            alertsCount={alertsCount}
            reminders={reminders}
            equipmentWithAlerts={itemsUnderThreshold}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenThresholdModal={() => setIsThresholdManagerOpen(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <Dashboard
                equipment={equipment}
                deliveries={deliveries}
                dispatches={dispatches}
                categories={categories}
                reminders={reminders}
                onOpenNewEquipment={() => {
                  setEquipmentToEdit(null);
                  setIsEquipmentOpen(true);
                }}
                onOpenNewCategory={() => {
                  setCategoryToEdit(null);
                  setIsCategoryModalOpen(true);
                }}
                onOpenNewDelivery={(equipmentId) => openNewDeliveryForEquipment(equipmentId)}
                onOpenNewDispatch={(equipmentId) => openNewDispatchForEquipment(equipmentId)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onOpenThresholdModal={() => setIsThresholdManagerOpen(true)}
                onExportStockReport={() => exportEquipmentToCSV(equipment)}
                onClearDataForAdminStart={handleClearForAdminStart}
                onLoadSampleData={handleLoadSampleData}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesView
                categories={categories}
                equipment={equipment}
                onOpenNewCategory={() => {
                  setCategoryToEdit(null);
                  setIsCategoryModalOpen(true);
                }}
                onEditCategory={(cat) => {
                  setCategoryToEdit(cat);
                  setIsCategoryModalOpen(true);
                }}
                onDeleteCategory={handleDeleteCategory}
                onFilterCategoryInInventory={(categoryName) => {
                  setActiveTab('equipements');
                }}
              />
            )}

            {(activeTab === 'equipements' || activeTab === 'stock') && (
              <EquipmentList
                equipment={equipment}
                categories={categories}
                onEditEquipment={(item) => {
                  setEquipmentToEdit(item);
                  setIsEquipmentOpen(true);
                }}
                onDeleteEquipment={handleDeleteEquipment}
                onUpdateThreshold={handleUpdateThreshold}
                onOpenDeliveryForEquipment={(id) => openNewDeliveryForEquipment(id)}
                onOpenDispatchForEquipment={(id) => openNewDispatchForEquipment(id)}
                onOpenNewEquipment={() => {
                  setEquipmentToEdit(null);
                  setIsEquipmentOpen(true);
                }}
                onOpenNewCategory={() => {
                  setCategoryToEdit(null);
                  setIsCategoryModalOpen(true);
                }}
                onExportCSV={() => exportEquipmentToCSV(equipment)}
              />
            )}

            {activeTab === 'entrees' && (
              <DeliveriesView
                deliveries={deliveries}
                onOpenNewDelivery={() => openNewDeliveryForEquipment()}
              />
            )}

            {activeTab === 'sorties' && (
              <DispatchesView
                dispatches={dispatches}
                onOpenNewDispatch={() => openNewDispatchForEquipment()}
                onReturnEquipment={handleReturnEquipment}
              />
            )}

            {activeTab === 'livraisons' && (
              <DeliveriesView
                deliveries={deliveries}
                onOpenNewDelivery={() => openNewDeliveryForEquipment()}
              />
            )}

            {activeTab === 'fournisseurs' && (
              <SuppliersView
                suppliers={suppliers}
                onAddSupplier={handleAddSupplier}
                onDeleteSupplier={handleDeleteSupplier}
                onOpenNewDelivery={() => openNewDeliveryForEquipment()}
              />
            )}

            {activeTab === 'alertes' && (
              <AlertsPanel
                equipment={equipment}
                onUpdateThreshold={handleUpdateThreshold}
                onOpenDeliveryForEquipment={(id, qty) => openNewDeliveryForEquipment(id, qty)}
                onOpenSupplyOrder={() => setIsSupplyOrderOpen(true)}
                onPlayTestSound={() => playThresholdAlertSound()}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            )}

            {activeTab === 'rappels' && (
              <RemindersView
                reminders={reminders}
                onToggleReminder={handleToggleReminder}
                onAddReminder={handleAddReminder}
                onDeleteReminder={handleDeleteReminder}
              />
            )}

            {activeTab === 'rapports' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Reports & Inventory Audit
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">Supply Valuation & Stock Statements</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Generate consolidated inventory statements for jobsite coordination meetings and project accounting.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Inventory Value</p>
                    <p className="text-2xl font-black text-slate-900">
                      {formatCurrency(equipment.reduce((acc, curr) => acc + curr.currentStock * curr.unitCost, 0))}
                    </p>
                    <p className="text-[11px] text-slate-400">Calculated across {equipment.length} catalog items</p>
                  </div>

                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                    <p className="text-xs font-bold text-amber-900 uppercase">Replenishment Budget Needed</p>
                    <p className="text-2xl font-black text-amber-700">
                      {formatCurrency(
                        itemsUnderThreshold.reduce((acc, curr) => {
                          const def = Math.max(0, curr.minThreshold - curr.currentStock);
                          return acc + def * curr.unitCost;
                        }, 0)
                      )}
                    </p>
                    <p className="text-[11px] text-amber-800">To satisfy deficits below user-defined safety threshold</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                    <p className="text-xs font-bold text-blue-900 uppercase">Total Operations Logged</p>
                    <p className="text-2xl font-black text-blue-700">{deliveries.length + dispatches.length}</p>
                    <p className="text-[11px] text-blue-600">
                      {deliveries.length} inbound receipts + {dispatches.length} jobsite dispatches
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => exportEquipmentToCSV(equipment)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Download Full Inventory (CSV)
                  </button>

                  <button
                    onClick={() => setIsSupplyOrderOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Purchase Order for Low Stock Items &rarr;
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'historique' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">Operational Audit Trail & Activity Log</h2>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {dispatches.slice(0, 5).map((d) => (
                    <div key={d.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">Jobsite Dispatch</span>: {d.quantity} {d.unit} of {d.equipmentName} deployed to {d.siteName}
                        <p className="text-[11px] text-slate-400">Supervisor: {d.siteManager} • Ref: {d.dispatchNumber}</p>
                      </div>
                      <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md">
                        -{d.quantity} {d.unit}
                      </span>
                    </div>
                  ))}
                  {deliveries.slice(0, 5).map((del) => (
                    <div key={del.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">Inbound Delivery</span>: {del.quantity} {del.unit} of {del.equipmentName} ({del.supplier})
                        <p className="text-[11px] text-slate-400">Received by: {del.receivedBy} • Voucher: {del.deliveryNumber}</p>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                        +{del.quantity} {del.unit}
                      </span>
                    </div>
                  ))}
                  {dispatches.length === 0 && deliveries.length === 0 && (
                    <p className="py-6 text-center text-slate-400">No operational movements recorded yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'parametres' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">System Configuration & Alert Parameters</h2>
                  <p className="text-xs text-slate-500">Configure BATISTOCK operational workspace and threshold notifications.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Audible Safety Threshold Alerts</h4>
                      <p className="text-slate-500">Play an audible alert chime whenever an item reaches or breaches the minimum threshold set by the supervisor.</p>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        soundEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {soundEnabled ? 'Active (Sound ON)' : 'Muted (Sound OFF)'}
                    </button>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Batch Safety Threshold Configuration</h4>
                      <p className="text-slate-500">Adjust minimum replenishment reserve limits across all jobsite equipment.</p>
                    </div>
                    <button
                      onClick={() => setIsThresholdManagerOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Open Threshold Configuration Matrix
                    </button>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-rose-700">Database Reset</h4>
                      <p className="text-slate-500">Restore initial demonstration catalog.</p>
                    </div>
                    <button
                      onClick={handleResetToDefaults}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Reset to Demo Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODALS */}
      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        onSaveCategory={handleSaveCategory}
      />

      {/* Equipment Modal */}
      <EquipmentModal
        isOpen={isEquipmentOpen}
        onClose={() => {
          setIsEquipmentOpen(false);
          setEquipmentToEdit(null);
        }}
        equipmentToEdit={equipmentToEdit}
        categories={categories}
        onOpenNewCategoryModal={() => {
          setCategoryToEdit(null);
          setIsCategoryModalOpen(true);
        }}
        onSaveEquipment={handleSaveEquipment}
      />

      {/* Delivery Modal (GRN / Stock In) */}
      <DeliveryModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        equipmentList={equipment}
        selectedEquipmentId={selectedEquipmentId}
        suggestedQuantity={suggestedQuantity}
        onSaveDelivery={handleSaveDelivery}
      />

      {/* Dispatch Modal (Stock Out / Jobsite Checkout) */}
      <DispatchModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        equipmentList={equipment}
        selectedEquipmentId={selectedEquipmentId}
        onSaveDispatch={handleSaveDispatch}
      />

      {/* Threshold Manager Modal (Client / Site Manager Defined) */}
      <ThresholdManagerModal
        isOpen={isThresholdManagerOpen}
        onClose={() => setIsThresholdManagerOpen(false)}
        equipmentList={equipment}
        onUpdateThresholds={handleBatchUpdateThresholds}
      />

      {/* Reorder Supply Sheet Modal */}
      <SupplyOrderModal
        isOpen={isSupplyOrderOpen}
        onClose={() => setIsSupplyOrderOpen(false)}
        underThresholdItems={itemsUnderThreshold}
      />
    </div>
  );
}
