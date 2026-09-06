import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Sliders, 
  FileDown, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Building2, 
  ChevronRight,
  FolderTree,
  RotateCcw
} from 'lucide-react';
import { Equipment, Category, StockStatus } from '../types';
import { EquipmentIcon } from './EquipmentIcon';
import { getStockStatus, getStatusBadgeInfo, formatCurrency, exportEquipmentToCSV } from '../utils/stockUtils';

interface EquipmentListProps {
  equipment: Equipment[];
  categories: Category[];
  onOpenNewEquipment: () => void;
  onEditEquipment: (item: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
  onOpenNewCategoryModal: () => void;
  onOpenThresholdModal: () => void;
  onOpenNewDelivery: (equipmentId?: string) => void;
  onOpenNewDispatch: (equipmentId?: string) => void;
  onQuickUpdateStock: (id: string, newStock: number) => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  equipment,
  categories,
  onOpenNewEquipment,
  onEditEquipment,
  onDeleteEquipment,
  onOpenNewCategoryModal,
  onOpenThresholdModal,
  onOpenNewDelivery,
  onOpenNewDispatch,
  onQuickUpdateStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'deficit'>('name');

  // Filter & Search
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

      const status = getStockStatus(item.currentStock, item.minThreshold);
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'optimal' && (status === 'SUFFICIENT' || status === 'SUFFISANT')) ||
        (selectedStatus === 'low' && (status === 'LOW' || status === 'FAIBLE')) ||
        (selectedStatus === 'critical' && (status === 'CRITICAL' || status === 'CRITIQUE')) ||
        (selectedStatus === 'stockout' && (status === 'OUT_OF_STOCK' || status === 'RUPTURE'));

      return matchesSearch && matchesCat && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return a.currentStock - b.currentStock;
      if (sortBy === 'deficit') {
        const defA = Math.max(0, a.minThreshold - a.currentStock);
        const defB = Math.max(0, b.minThreshold - b.currentStock);
        return defB - defA;
      }
      return 0;
    });
  }, [equipment, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const totalValuation = useMemo(() => {
    return equipment.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
  }, [equipment]);

  return (
    <div className="space-y-5">
      {/* Top Banner with Site Manager Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
              Inventory & Equipment Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Total Inventory Value: {formatCurrency(totalValuation)}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Jobsite Equipment Directory & Stock Monitoring
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-0.5">
            Real-time tracking of residual stock, minimum safety reserves, and quick material receipts/dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenNewCategoryModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Manage categories entered by site manager"
          >
            <FolderTree className="w-3.5 h-3.5 text-blue-600" />
            <span>Categories</span>
          </button>

          <button
            onClick={onOpenThresholdModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Configure minimum safety thresholds"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Safety Thresholds</span>
          </button>

          <button
            onClick={() => exportEquipmentToCSV(equipment)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Export inventory to CSV file"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewEquipment}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Equipment</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code, designation, category, supplier..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="optimal">Optimal Stock</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical Stock</option>
            <option value="stockout">Out of Stock</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Lowest Stock</option>
            <option value="deficit">Sort by Highest Deficit</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-4">Designation & Code</th>
                <th className="py-3.5 px-4">Category (Site Mgr)</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Safety Threshold</th>
                <th className="py-3.5 px-4">Deficit</th>
                <th className="py-3.5 px-4">Stock Health</th>
                <th className="py-3.5 px-4">Location / Supplier</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No equipment found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try altering your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => {
                  const status = getStockStatus(item.currentStock, item.minThreshold);
                  const badge = getStatusBadgeInfo(status);
                  const deficit = Math.max(0, item.minThreshold - item.currentStock);
                  const isUnderThreshold = item.currentStock <= item.minThreshold;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        item.currentStock === 0 ? 'bg-slate-50/40' : isUnderThreshold ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Code & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border flex-shrink-0 ${
                            isUnderThreshold ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            <EquipmentIcon iconType={item.iconType} className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                              {item.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          <FolderTree className="w-3 h-3 text-blue-600" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">
                            {item.currentStock}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {item.unit}
                          </span>
                        </div>
                      </td>

                      {/* Minimum Threshold */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-700">
                            {item.minThreshold} {item.unit}
                          </span>
                          <button
                            onClick={onOpenThresholdModal}
                            className="text-slate-300 hover:text-amber-600 cursor-pointer"
                            title="Adjust threshold"
                          >
                            <Sliders className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Deficit */}
                      <td className="py-3.5 px-4">
                        {deficit > 0 ? (
                          <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            -{deficit} {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Location / Supplier */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-600 truncate max-w-[160px]">{item.location}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{item.supplier}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Inflow Receipt */}
                          <button
                            onClick={() => onOpenNewDelivery(item.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Register Inbound Receipt (Goods Receipt Note)"
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Outflow Dispatch */}
                          <button
                            onClick={() => onOpenNewDispatch(item.id)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                            title="Register Jobsite Dispatch / Checkout"
                          >
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Item */}
                          <button
                            onClick={() => onEditEquipment(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit equipment details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => onDeleteEquipment(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete equipment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong className="text-slate-900">{filteredEquipment.length}</strong> of{' '}
            <strong className="text-slate-900">{equipment.length}</strong> referenced items
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Low
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Stockout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
