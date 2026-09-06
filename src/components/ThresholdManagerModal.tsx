import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Save,
  Layers,
  Info
} from 'lucide-react';
import { Equipment } from '../types';

interface ThresholdManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onUpdateThresholds: (updatedThresholds: Record<string, number>) => void;
}

export const ThresholdManagerModal: React.FC<ThresholdManagerModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  onUpdateThresholds,
}) => {
  // Local state for editing thresholds before applying
  const [thresholds, setThresholds] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    equipmentList.forEach((e) => {
      map[e.id] = e.minThreshold;
    });
    return map;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasSaved, setHasSaved] = useState(false);

  // Sync state if modal opens
  React.useEffect(() => {
    if (isOpen) {
      const map: Record<string, number> = {};
      equipmentList.forEach((e) => {
        map[e.id] = e.minThreshold;
      });
      setThresholds(map);
      setHasSaved(false);
    }
  }, [isOpen, equipmentList]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(equipmentList.map((e) => e.category)));

  const handleThresholdChange = (id: string, value: number) => {
    setThresholds((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleApplyPresetToCategory = (cat: string, delta: number) => {
    setThresholds((prev) => {
      const next = { ...prev };
      equipmentList
        .filter((e) => e.category === cat)
        .forEach((e) => {
          next[e.id] = Math.max(0, (next[e.id] ?? e.minThreshold) + delta);
        });
      return next;
    });
  };

  const handleSave = () => {
    onUpdateThresholds(thresholds);
    setHasSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const filteredItems = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Client Safety Threshold Configuration
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  User Defined
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the minimum reserve quantities for each jobsite equipment asset. Alerts trigger only when your specified limits are reached.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational callout emphasizing client authority */}
        <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 flex-shrink-0">
          <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-900">Full Client Control:</span> You have complete ownership over the minimum threshold values. The system does not dictate or auto-adjust these numbers; safety alerts and replenishment reminders rely entirely on the exact values you enter below.
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 flex-shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter equipment by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none w-full sm:w-auto"
            >
              <option value="all">All Categories ({equipmentList.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table list of items and their thresholds */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5">Asset Code</th>
                <th className="px-4 py-2.5">Equipment Name & Category</th>
                <th className="px-4 py-2.5 text-center">Current Stock</th>
                <th className="px-4 py-2.5 text-center">Your Defined Threshold</th>
                <th className="px-4 py-2.5 text-right">Projected Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((item) => {
                const userThreshold = thresholds[item.id] ?? item.minThreshold;
                const willAlert = item.currentStock <= userThreshold;
                const isCritical = item.currentStock < userThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.category}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleThresholdChange(item.id, userThreshold - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 text-xs"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={userThreshold}
                          onChange={(e) => handleThresholdChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-14 text-center font-mono font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500 pr-1">{item.unit}</span>
                        <button
                          type="button"
                          onClick={() => handleThresholdChange(item.id, userThreshold + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertTriangle className="h-3 w-3 text-rose-600" />
                          Shortage Alert ({item.currentStock} &lt; {userThreshold})
                        </span>
                      ) : willAlert ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          At Limit ({item.currentStock} = {userThreshold})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Safe Reserve (+{item.currentStock - userThreshold} buffer)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 mt-3">
          <div className="text-xs text-slate-500">
            {Object.keys(thresholds).length} equipment thresholds active
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${
                hasSaved
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {hasSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Thresholds Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Client Thresholds</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
