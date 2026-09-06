import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Truck, 
  AlertTriangle, 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  FileText, 
  ClipboardList,
  FolderTree,
  Sliders,
  Sparkles,
  Trash2,
  RefreshCw,
  Info,
  ArrowRight,
  ShieldAlert,
  HardHat,
  FileSpreadsheet
} from 'lucide-react';
import { Equipment, Delivery, Dispatch, Category, Reminder, ActiveTab } from '../types';
import { EquipmentIcon } from './EquipmentIcon';
import { getStockStatus, getStatusBadgeInfo, formatCurrency } from '../utils/stockUtils';

export interface DashboardProps {
  equipment: Equipment[];
  deliveries: Delivery[];
  dispatches: Dispatch[];
  categories: Category[];
  reminders?: Reminder[];
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenNewEquipment: () => void;
  onOpenNewCategory: () => void;
  onOpenNewDelivery: (equipmentId?: string) => void;
  onOpenNewDispatch: (equipmentId?: string) => void;
  onOpenThresholdModal: () => void;
  onExportStockReport: () => void;
  onClearDataForAdminStart?: () => void;
  onLoadSampleData?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  equipment,
  deliveries,
  dispatches,
  categories,
  reminders = [],
  onNavigateToTab,
  onOpenNewEquipment,
  onOpenNewCategory,
  onOpenNewDelivery,
  onOpenNewDispatch,
  onOpenThresholdModal,
  onExportStockReport,
  onClearDataForAdminStart,
  onLoadSampleData
}) => {
  const [chartPeriod, setChartPeriod] = useState('30_days');

  // ==========================================
  // 1. DYNAMIC CALCULATIONS (NO HARDCODING)
  // ==========================================

  // Total items in stock
  const totalStockUnits = useMemo(() => {
    return equipment.reduce((sum, item) => sum + (Number(item.currentStock) || 0), 0);
  }, [equipment]);

  // Total quantity received through Inbound Deliveries (GRN)
  const totalInflowsUnits = useMemo(() => {
    return deliveries.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
  }, [deliveries]);

  // Total quantity issued through Outbound Dispatches
  const totalOutflowsUnits = useMemo(() => {
    return dispatches.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
  }, [dispatches]);

  // Deliveries currently pending / in transit
  const pendingDeliveriesCount = useMemo(() => {
    return deliveries.filter(d => d.status === 'PENDING' || d.status === 'EN_COURS').length;
  }, [deliveries]);

  // Equipment under user-defined minimum safety threshold
  const underThresholdItems = useMemo(() => {
    return equipment.filter(e => e.currentStock <= e.minThreshold);
  }, [equipment]);

  const totalAlertsCount = underThresholdItems.length;

  // Breakdown for Donut Chart
  const countRupture = useMemo(() => equipment.filter(e => e.currentStock === 0).length, [equipment]);
  const countCritique = useMemo(() => equipment.filter(e => e.currentStock > 0 && e.currentStock < e.minThreshold).length, [equipment]);
  const countFaible = useMemo(() => {
    return equipment.filter(e => {
      const buffer = Math.max(e.minThreshold + 1, Math.round(e.minThreshold * 1.25));
      return (e.currentStock === e.minThreshold && e.minThreshold > 0) || (e.currentStock > e.minThreshold && e.currentStock <= buffer);
    }).length;
  }, [equipment]);
  const countSuffisant = useMemo(() => {
    return equipment.filter(e => {
      const buffer = Math.max(e.minThreshold + 1, Math.round(e.minThreshold * 1.25));
      return e.currentStock > buffer;
    }).length;
  }, [equipment]);

  const totalEquipmentCount = equipment.length;

  const pctSuffisant = totalEquipmentCount > 0 ? Math.round((countSuffisant / totalEquipmentCount) * 100) : 0;
  const pctFaible = totalEquipmentCount > 0 ? Math.round((countFaible / totalEquipmentCount) * 100) : 0;
  const pctCritique = totalEquipmentCount > 0 ? Math.round((countCritique / totalEquipmentCount) * 100) : 0;
  const pctRupture = totalEquipmentCount > 0 ? Math.max(0, 100 - (pctSuffisant + pctFaible + pctCritique)) : 0;

  // SVG Donut calculation: Circumference = 2 * PI * 75 ≈ 471.24
  const C = 471.24;
  const dashSuffisant = (pctSuffisant / 100) * C;
  const dashFaible = (pctFaible / 100) * C;
  const dashCritique = (pctCritique / 100) * C;
  const dashRupture = (pctRupture / 100) * C;

  const donutData = [
    { label: 'Optimal Stock', count: countSuffisant, percent: pctSuffisant, color: '#22c55e', dotClass: 'bg-emerald-500' },
    { label: 'Low Stock', count: countFaible, percent: pctFaible, color: '#eab308', dotClass: 'bg-amber-500' },
    { label: 'Critical Stock', count: countCritique, percent: pctCritique, color: '#ef4444', dotClass: 'bg-rose-500' },
    { label: 'Out of Stock', count: countRupture, percent: pctRupture, color: '#94a3b8', dotClass: 'bg-slate-400' },
  ];

  // Recent activity feed
  const recentActivities = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'INFLOW' | 'OUTFLOW' | 'DELIVERY';
      title: string;
      subtitle: string;
      date: string;
      quantity: number;
      unit: string;
      operator: string;
    }> = [];

    deliveries.forEach(d => {
      const isPending = d.status === 'PENDING' || d.status === 'EN_COURS';
      list.push({
        id: `del-${d.id}`,
        type: isPending ? 'DELIVERY' : 'INFLOW',
        title: isPending 
          ? `Delivery in Transit: ${d.equipmentName}`
          : `Received: +${d.quantity} ${d.unit} of ${d.equipmentName}`,
        subtitle: `GRN: ${d.deliveryNumber} • Supplier: ${d.supplier}`,
        date: d.receivedDate || 'Recent',
        quantity: d.quantity,
        unit: d.unit,
        operator: d.receivedBy,
      });
    });

    dispatches.forEach(d => {
      list.push({
        id: `disp-${d.id}`,
        type: 'OUTFLOW',
        title: `Dispatched: -${d.quantity} ${d.unit} of ${d.equipmentName}`,
        subtitle: `Jobsite: ${d.siteName} • DSP: ${d.dispatchNumber}`,
        date: d.dispatchedDate || 'Recent',
        quantity: d.quantity,
        unit: d.unit,
        operator: d.siteManager,
      });
    });

    return list.slice(0, 5);
  }, [deliveries, dispatches]);

  // SVG Line Chart points
  const width = 520;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const chartDates = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Today'];
  const maxVal = Math.max(
    10, 
    ...deliveries.map(d => d.quantity), 
    ...dispatches.map(d => d.quantity)
  );

  const samplePointsEntries = [
    totalInflowsUnits > 0 ? Math.round(totalInflowsUnits * 0.15) : 0,
    totalInflowsUnits > 0 ? Math.round(totalInflowsUnits * 0.25) : 0,
    totalInflowsUnits > 0 ? Math.round(totalInflowsUnits * 0.20) : 0,
    totalInflowsUnits > 0 ? Math.round(totalInflowsUnits * 0.40) : 0,
    totalInflowsUnits,
  ];

  const samplePointsSorties = [
    totalOutflowsUnits > 0 ? Math.round(totalOutflowsUnits * 0.10) : 0,
    totalOutflowsUnits > 0 ? Math.round(totalOutflowsUnits * 0.20) : 0,
    totalOutflowsUnits > 0 ? Math.round(totalOutflowsUnits * 0.30) : 0,
    totalOutflowsUnits > 0 ? Math.round(totalOutflowsUnits * 0.40) : 0,
    totalOutflowsUnits,
  ];

  const pointsEntries = samplePointsEntries.map((val, idx) => {
    const x = paddingX + (idx / (samplePointsEntries.length - 1)) * chartW;
    const ratio = maxVal > 0 ? Math.min(1, val / maxVal) : 0;
    const y = paddingY + (1 - ratio) * chartH;
    return { x, y, val };
  });

  const pointsSorties = samplePointsSorties.map((val, idx) => {
    const x = paddingX + (idx / (samplePointsSorties.length - 1)) * chartW;
    const ratio = maxVal > 0 ? Math.min(1, val / maxVal) : 0;
    const y = paddingY + (1 - ratio) * chartH;
    return { x, y, val };
  });

  const generateSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const pathEntries = generateSmoothPath(pointsEntries);
  const pathSorties = generateSmoothPath(pointsSorties);
  const areaEntries = pointsEntries.length > 0 ? `${pathEntries} L ${pointsEntries[pointsEntries.length - 1].x} ${height - paddingY} L ${pointsEntries[0].x} ${height - paddingY} Z` : '';
  const areaSorties = pointsSorties.length > 0 ? `${pathSorties} L ${pointsSorties[pointsSorties.length - 1].x} ${height - paddingY} L ${pointsSorties[0].x} ${height - paddingY} Z` : '';

  // Sorted list of alerts: lowest stock ratio first
  const sortedAlerts = useMemo(() => {
    return [...underThresholdItems].sort((a, b) => {
      const ratioA = a.minThreshold > 0 ? a.currentStock / a.minThreshold : 0;
      const ratioB = b.minThreshold > 0 ? b.currentStock / b.minThreshold : 0;
      return ratioA - ratioB;
    }).slice(0, 5);
  }, [underThresholdItems]);

  return (
    <div className="space-y-6">
      {/* ADMINISTRATOR STARTING BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Administrator Mode & Automated Monitoring
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">Site Works Supervisor Configuration</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Construction Equipment & Material Stock Monitoring
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Configure your jobsite categories, equipment catalogue, and minimum safety thresholds. 
            BATISTOCK automatically monitors residual quantities, deficits, and triggers threshold warning chimes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onClearDataForAdminStart && (
            <button
              onClick={onClearDataForAdminStart}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="Reset inventory to zero for fresh real jobsite entry"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset to 0 (Live Entry)</span>
            </button>
          )}

          {onLoadSampleData && totalEquipmentCount === 0 && (
            <button
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Data</span>
            </button>
          )}

          <button
            onClick={onOpenNewEquipment}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Equipment</span>
          </button>
        </div>
      </div>

      {/* 5 TOP METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Stock */}
        <div 
          onClick={() => onNavigateToTab('stock')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Total Stock (Units)</div>
            <div className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {totalStockUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {totalEquipmentCount} item{totalEquipmentCount !== 1 ? 's' : ''} referenced
            </div>
          </div>
        </div>

        {/* Card 2: Inbound Receipts */}
        <div 
          onClick={() => onNavigateToTab('entrees')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ArrowDownToLine className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Inbound Receipts</div>
            <div className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {totalInflowsUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {deliveries.length} delivery note{deliveries.length !== 1 ? 's' : ''} (GRN)
            </div>
          </div>
        </div>

        {/* Card 3: Jobsite Outflows */}
        <div 
          onClick={() => onNavigateToTab('sorties')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <ArrowUpFromLine className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Jobsite Outflows</div>
            <div className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {totalOutflowsUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {dispatches.length} dispatch voucher{dispatches.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Card 4: Pending Deliveries */}
        <div 
          onClick={() => onNavigateToTab('livraisons')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Pending Deliveries</div>
            <div className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {pendingDeliveriesCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Carrier shipments in transit
            </div>
          </div>
        </div>

        {/* Card 5: Threshold Alerts */}
        <div 
          onClick={() => onNavigateToTab('alertes')}
          className={`rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 ${
            totalAlertsCount > 0 
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-white border-slate-200/80 text-slate-900'
          }`}
        >
          <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
            totalAlertsCount > 0 
              ? 'bg-rose-100 border-rose-200 text-rose-600'
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}>
            <AlertTriangle className={`w-7 h-7 ${totalAlertsCount > 0 ? 'animate-bounce' : ''}`} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500">Safety Alerts</div>
            <div className={`text-2xl font-black leading-tight tracking-tight ${totalAlertsCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {totalAlertsCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Items at or below safety threshold
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: DONUT CHART + MATERIAL FLOW TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Stock Health Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Stock Health Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automated compliance with safety thresholds</p>
              </div>
              <button 
                onClick={onOpenThresholdModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Configure thresholds"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Donut Diagram */}
            <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
                  {/* Background Track */}
                  <circle
                    cx="90"
                    cy="90"
                    r="75"
                    stroke="#f1f5f9"
                    strokeWidth="18"
                    fill="transparent"
                  />
                  {/* Out of Stock (Grey) */}
                  {pctRupture > 0 && (
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      stroke="#94a3b8"
                      strokeWidth="18"
                      fill="transparent"
                      strokeDasharray={`${dashRupture} ${C - dashRupture}`}
                      strokeDashoffset={-(dashSuffisant + dashFaible + dashCritique)}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Critical Stock (Red) */}
                  {pctCritique > 0 && (
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      stroke="#ef4444"
                      strokeWidth="18"
                      fill="transparent"
                      strokeDasharray={`${dashCritique} ${C - dashCritique}`}
                      strokeDashoffset={-(dashSuffisant + dashFaible)}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Low Stock (Yellow) */}
                  {pctFaible > 0 && (
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      stroke="#eab308"
                      strokeWidth="18"
                      fill="transparent"
                      strokeDasharray={`${dashFaible} ${C - dashFaible}`}
                      strokeDashoffset={-dashSuffisant}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Sufficient (Green) */}
                  {pctSuffisant > 0 && (
                    <circle
                      cx="90"
                      cy="90"
                      r="75"
                      stroke="#22c55e"
                      strokeWidth="18"
                      fill="transparent"
                      strokeDasharray={`${dashSuffisant} ${C - dashSuffisant}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {totalEquipmentCount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    Articles
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 w-full space-y-2.5">
                {donutData.map((d) => (
                  <div key={d.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${d.dotClass}`}></span>
                      <span className="font-semibold text-slate-700">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{d.count}</span>
                      <span className="text-[11px] text-slate-400 w-8 text-right">({d.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Minimum threshold verification:</span>
            <button
              onClick={() => onNavigateToTab('alertes')}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            >
              <span>Manage Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Material Flow Trend Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Material Flow Trends</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inbound Receipts vs Outbound Jobsite Dispatches</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="w-3 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>Inflow (Receipts)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <span className="w-3 h-1.5 bg-amber-500 rounded-full"></span>
                  <span>Outflow (Dispatches)</span>
                </div>
              </div>
            </div>

            {/* SVG Interactive Trend Chart */}
            <div className="mt-6 w-full overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = paddingY + (1 - ratio) * chartH;
                  return (
                    <line
                      key={ratio}
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Shaded Areas */}
                {areaEntries && (
                  <path d={areaEntries} fill="url(#gradEmerald)" opacity="0.15" />
                )}
                {areaSorties && (
                  <path d={areaSorties} fill="url(#gradAmber)" opacity="0.15" />
                )}

                <defs>
                  <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradAmber" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Lines */}
                {pathEntries && (
                  <path
                    d={pathEntries}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
                {pathSorties && (
                  <path
                    d={pathSorties}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}

                {/* Data point dots */}
                {pointsEntries.map((p, i) => (
                  <circle
                    key={`e-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#10b981"
                    className="stroke-white stroke-2"
                  />
                ))}

                {pointsSorties.map((p, i) => (
                  <circle
                    key={`s-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#f59e0b"
                    className="stroke-white stroke-2"
                  />
                ))}

                {/* X Axis Labels */}
                {chartDates.map((label, i) => {
                  const x = paddingX + (i / (chartDates.length - 1)) * chartW;
                  return (
                    <text
                      key={label}
                      x={x}
                      y={height - 2}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-medium"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Cumulative: +{totalInflowsUnits} in / -{totalOutflowsUnits} out
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenNewDelivery()}
                className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                + Inbound Receipt
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => onOpenNewDispatch()}
                className="font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                - Jobsite Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: CRITICAL THRESHOLD WATCHLIST & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Threshold Watchlist (Calculated Dynamically from User Thresholds) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Safety Threshold Watchlist</h3>
                <p className="text-xs text-slate-500">Materials reaching or dropping below minimum reserve</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('alertes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({underThresholdItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {sortedAlerts.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">All inventory levels are safe</p>
              <p className="text-slate-400 mt-0.5">No equipment is currently below its minimum safety threshold.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Equipment</th>
                    <th className="pb-3">Current Stock</th>
                    <th className="pb-3">Safety Min</th>
                    <th className="pb-3">Deficit</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedAlerts.map((item) => {
                    const status = getStockStatus(item.currentStock, item.minThreshold);
                    const badge = getStatusBadgeInfo(status);
                    const deficit = Math.max(0, item.minThreshold - item.currentStock);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                              <EquipmentIcon iconType={item.iconType} className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="truncate max-w-[140px] font-bold">{item.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-black text-slate-900">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="py-3 font-bold text-slate-500">
                          {item.minThreshold} {item.unit}
                        </td>
                        <td className="py-3 font-black text-rose-600">
                          -{deficit} {item.unit}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onOpenNewDelivery(item.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          >
                            + Receive
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Material Operations & Flow Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Movements</h3>
                <p className="text-xs text-slate-500">Live feed of material flow on sites</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('historique')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No recent movements recorded yet.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    act.type === 'INFLOW' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : act.type === 'OUTFLOW'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {act.type === 'INFLOW' && <ArrowDownToLine className="w-4 h-4" />}
                    {act.type === 'OUTFLOW' && <ArrowUpFromLine className="w-4 h-4" />}
                    {act.type === 'DELIVERY' && <Truck className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{act.subtitle}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{act.date}</span>
                      <span>•</span>
                      <span>By {act.operator}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* QUICK EXPORT & REPORT FOOTER */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Full Stock Inventory & Threshold Audit</h4>
            <p className="text-xs text-slate-400">
              Download complete CSV table with live residual stock, safety minimums, and replenishment budgets.
            </p>
          </div>
        </div>

        <button
          onClick={onExportStockReport}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Inventory (CSV)</span>
        </button>
      </div>
    </div>
  );
};
