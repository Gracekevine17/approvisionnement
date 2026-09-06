import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  LayoutDashboard, 
  Plus, 
  Volume2, 
  VolumeX, 
  HardHat, 
  FileSpreadsheet,
  Sliders
} from 'lucide-react';
import { ActiveTab, Equipment } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  criticalCount: number;
  totalAlertsCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenNewEquipment: () => void;
  onOpenDelivery: () => void;
  onOpenDispatch: () => void;
  onExportCSV: () => void;
  onOpenThresholdManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  totalAlertsCount,
  soundEnabled,
  setSoundEnabled,
  onOpenNewEquipment,
  onOpenDelivery,
  onOpenDispatch,
  onExportCSV,
  onOpenThresholdManager,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner with branding and quick triggers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm ring-2 ring-amber-400/30">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">SiteStock<span className="text-amber-400">Pro</span></h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Heavy Civil & Building
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Supply inventory, jobsite deliveries, dispatches & client-defined safety thresholds
            </p>
          </div>
        </div>

        {/* Action buttons on desktop */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Configure Thresholds Button (Client defined) */}
          <button
            id="btn-configure-thresholds"
            onClick={onOpenThresholdManager}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-800 text-amber-300 border border-amber-500/40 hover:bg-slate-700 transition-colors shadow-xs"
            title="Configure your minimum safety stock thresholds"
          >
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span>Client Thresholds</span>
          </button>

          {/* Audio reminder toggle */}
          <button
            id="toggle-audio-alerts"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Threshold audio alert active (Click to mute)' : 'Audio alert muted (Click to enable)'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio Alert On' : 'Muted'}</span>
          </button>

          {/* Export CSV */}
          <button
            id="export-csv-btn"
            onClick={onExportCSV}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Export full inventory report to CSV"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* New Delivery button */}
          <button
            id="btn-new-delivery"
            onClick={onOpenDelivery}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>+ Receive Stock</span>
          </button>

          {/* New Dispatch button */}
          <button
            id="btn-new-dispatch"
            onClick={onOpenDispatch}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>- Jobsite Dispatch</span>
          </button>

          {/* New Equipment button */}
          <button
            id="btn-new-equipment"
            onClick={onOpenNewEquipment}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Equipment</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          <button
            id="nav-tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'inventory'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Package className="h-4 w-4" />
            Equipment Inventory
          </button>

          <button
            id="nav-tab-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors relative ${
              activeTab === 'alerts'
                ? 'bg-slate-800 text-rose-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className={`h-4 w-4 ${totalAlertsCount > 0 ? 'text-rose-400 animate-pulse' : ''}`} />
            <span>Safety Thresholds</span>
            {totalAlertsCount > 0 && (
              <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full ${
                criticalCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-slate-950'
              }`}>
                {totalAlertsCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-deliveries"
            onClick={() => setActiveTab('deliveries')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'deliveries'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
            Inbound Deliveries (GRN)
          </button>

          <button
            id="nav-tab-dispatches"
            onClick={() => setActiveTab('dispatches')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dispatches'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
            Jobsite Dispatches (Outflow)
          </button>
        </nav>
      </div>
    </header>
  );
};

