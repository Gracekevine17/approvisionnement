import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Sliders, 
  Volume2, 
  CheckCircle2, 
  ArrowDownLeft, 
  FileText,
  HelpCircle,
  Package
} from 'lucide-react';
import { Equipment } from '../types';
import { formatCurrency } from '../utils/stockUtils';

interface AlertsPanelProps {
  equipment: Equipment[];
  onUpdateThreshold: (id: string, newThreshold: number) => void;
  onOpenDeliveryForEquipment: (equipmentId: string, suggestedQuantity?: number) => void;
  onOpenSupplyOrder: () => void;
  onPlayTestSound: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  equipment,
  onUpdateThreshold,
  onOpenDeliveryForEquipment,
  onOpenSupplyOrder,
  onPlayTestSound,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'at_threshold'>('all');

  // Filter items that are at or below minimum threshold defined by user/administrator
  const underThresholdItems = equipment.filter((item) => item.currentStock <= item.minThreshold);
  
  const criticalItems = underThresholdItems.filter((item) => item.currentStock < item.minThreshold);
  const atThresholdItems = underThresholdItems.filter((item) => item.currentStock === item.minThreshold && item.minThreshold > 0);

  const displayedItems = underThresholdItems.filter((item) => {
    if (filterSeverity === 'critical') return item.currentStock < item.minThreshold;
    if (filterSeverity === 'at_threshold') return item.currentStock === item.minThreshold;
    return true;
  });

  // Calculate total budget needed to replenish all deficit items to their threshold (automated calculation)
  const totalReplenishmentCost = underThresholdItems.reduce((acc, item) => {
    const deficit = Math.max(0, item.minThreshold - item.currentStock);
    const targetOrder = deficit + Math.max(1, Math.round(item.minThreshold * 0.5));
    return acc + (targetOrder * item.unitCost);
  }, 0);

  return (
    <div id="alerts-panel-view" className="space-y-6">
      {/* Top Banner Alert Summary */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex-shrink-0">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                  User Defined Safety Thresholds
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {underThresholdItems.length} item{underThresholdItems.length > 1 ? 's' : ''} under alert threshold
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black mt-1.5 text-white tracking-tight">
                Jobsite Safety Reserve Monitoring
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                As soon as equipment inventory reaches or drops below the minimum threshold you configured, BATISTOCK automatically triggers visual and audible alerts, and computes exact replenishment deficits.
              </p>
            </div>
          </div>

          {/* Quick global actions */}
          <div className="flex flex-col sm:flex-row gap-2 self-start md:self-center">
            <button
              onClick={onOpenSupplyOrder}
              disabled={underThresholdItems.length === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all ${
                underThresholdItems.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-md cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Generate Replenishment Order ({underThresholdItems.length})</span>
            </button>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) onPlayTestSound();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Test or toggle threshold audio alarm"
            >
              <Volume2 className="h-4 w-4 text-amber-400" />
              <span>{soundEnabled ? 'Audio Alert Active' : 'Sound Muted'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row inside banner - Dynamically Calculated */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Below Safety Threshold (Deficit)</span>
            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">{criticalItems.length} item(s)</div>
          </div>
          <div>
            <span className="text-slate-400">At Exact Minimum (Safety Buffer)</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{atThresholdItems.length} item(s)</div>
          </div>
          <div>
            <span className="text-slate-400">Estimated Reorder Budget</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">{formatCurrency(totalReplenishmentCost)}</div>
          </div>
          <div>
            <span className="text-slate-400">Inventory Status</span>
            <div className="text-xl font-black font-mono mt-0.5 text-emerald-400">
              {underThresholdItems.length === 0 ? '100% Compliant' : 'Active Deficit'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Guide */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold shadow-xs">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Threshold Alerts ({underThresholdItems.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterSeverity === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 hover:text-rose-800'
            }`}
          >
            Critical Deficit ({criticalItems.length})
          </button>
          <button
            onClick={() => setFilterSeverity('at_threshold')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterSeverity === 'at_threshold'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            At Threshold Limit ({atThresholdItems.length})
          </button>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 text-amber-950 px-3 py-1.5 rounded-lg">
          <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
          <span>Adjust minimum thresholds directly with <strong>[-]</strong> and <strong>[+]</strong> or trigger immediate stock receipt.</span>
        </div>
      </div>

      {/* List of items under threshold */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active stock alerts</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            All equipment on your construction jobsites is currently above the minimum safety reserves you established.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const deficit = Math.max(0, item.minThreshold - item.currentStock);
            const suggestedOrder = deficit + Math.max(2, Math.round(item.minThreshold * 0.4));
            const isZero = item.currentStock === 0;

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                  isZero
                    ? 'border-rose-400 bg-rose-50/20'
                    : item.currentStock < item.minThreshold
                    ? 'border-rose-300'
                    : 'border-amber-300'
                }`}
              >
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                      isZero 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                          {item.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Location: <strong className="text-slate-700">{item.location}</strong> • Supplier: <strong className="text-slate-700">{item.supplier}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stock comparison vs Threshold - Calculated */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center font-mono">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Stock</div>
                    <div className={`text-xl font-black mt-0.5 ${item.currentStock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.currentStock} <span className="text-xs font-normal text-slate-500 font-sans">{item.unit}</span>
                    </div>
                  </div>

                  <div className="border-x border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Safety Min</div>
                    <div className="text-xl font-black text-amber-700 mt-0.5">
                      {item.minThreshold} <span className="text-xs font-normal text-slate-500 font-sans">{item.unit}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Calculated Deficit</div>
                    <div className="text-xl font-black text-rose-600 mt-0.5">
                      -{deficit} <span className="text-xs font-normal text-slate-500 font-sans">{item.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Direct threshold adjuster controls */}
                <div className="mt-3.5 flex items-center justify-between text-xs pt-3 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">Safety Minimum Threshold:</span>
                    <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        onClick={() => onUpdateThreshold(item.id, Math.max(0, item.minThreshold - 1))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                        title="Decrease minimum threshold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-mono font-bold text-slate-900 text-center min-w-[28px]">
                        {item.minThreshold}
                      </span>
                      <button
                        onClick={() => onUpdateThreshold(item.id, item.minThreshold + 1)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                        title="Increase minimum threshold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Supply button */}
                  <button
                    onClick={() => onOpenDeliveryForEquipment(item.id, suggestedOrder)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                    <span>Receive (+{suggestedOrder} {item.unit})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
