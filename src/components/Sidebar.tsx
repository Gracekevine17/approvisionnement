import React from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  FolderTree, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Truck, 
  Users, 
  Bell, 
  CalendarCheck, 
  BarChart3, 
  Clock, 
  Settings, 
  LogOut,
  X,
  ShieldAlert
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  alertsCount: number;
  remindersCount: number;
  categoriesCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  alertsCount,
  remindersCount,
  categoriesCount,
  onLogout,
}) => {
  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const navItemClass = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
    }`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d1527] text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Construction Yellow Helmet Logo */}
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-md ring-2 ring-amber-400/20 flex-shrink-0">
                <HardHat className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-wider text-white uppercase leading-tight font-sans">
                  BATISTOCK
                </h1>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                  <span className="text-amber-400 font-bold">+</span> Stock Monitoring <br />
                  Jobsite Equipment
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Main Top Tab: Dashboard */}
          <div>
            <button
              onClick={() => handleTabClick('dashboard')}
              className={navItemClass('dashboard')}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                <span>Dashboard</span>
              </div>
            </button>
          </div>

          {/* Section: MANAGEMENT */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              MANAGEMENT
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('equipements')}
                className={navItemClass('equipements')}
              >
                <div className="flex items-center gap-3">
                  <HardHat className="w-4 h-4 flex-shrink-0" />
                  <span>Equipment</span>
                </div>
              </button>

              {/* Categories */}
              <button
                onClick={() => handleTabClick('categories')}
                className={navItemClass('categories')}
              >
                <div className="flex items-center gap-3">
                  <FolderTree className="w-4 h-4 flex-shrink-0" />
                  <span>Categories</span>
                </div>
                {categoriesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-blue-400">
                    {categoriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('stock')}
                className={navItemClass('stock')}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span>Stock Inventory</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('entrees')}
                className={navItemClass('entrees')}
              >
                <div className="flex items-center gap-3">
                  <ArrowDownToLine className="w-4 h-4 flex-shrink-0" />
                  <span>Inbound Receipts</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('sorties')}
                className={navItemClass('sorties')}
              >
                <div className="flex items-center gap-3">
                  <ArrowUpFromLine className="w-4 h-4 flex-shrink-0" />
                  <span>Jobsite Dispatches</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('livraisons')}
                className={navItemClass('livraisons')}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>Deliveries (GRN)</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('fournisseurs')}
                className={navItemClass('fournisseurs')}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Suppliers</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: ALERTS & MONITORING */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              ALERTS & MONITORING
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('alertes')}
                className={navItemClass('alertes')}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>Stock Alerts</span>
                </div>
                {alertsCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center justify-center">
                    {alertsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('rappels')}
                className={navItemClass('rappels')}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Reminders</span>
                </div>
                {remindersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                    {remindersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section: REPORTS & AUDIT */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              REPORTS & AUDIT
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('rapports')}
                className={navItemClass('rapports')}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span>Reports & Stats</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('historique')}
                className={navItemClass('historique')}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Audit History</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section: SETTINGS */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              SETTINGS
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('parametres')}
                className={navItemClass('parametres')}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Sign Out */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
