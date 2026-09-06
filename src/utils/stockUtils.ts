import { Equipment, StockStatus } from '../types';

export function getStockStatus(currentStock: number, minThreshold: number): StockStatus {
  if (currentStock === 0) return 'OUT_OF_STOCK';
  if (currentStock < minThreshold) return 'CRITICAL';
  if (currentStock === minThreshold || currentStock <= minThreshold * 1.25) return 'LOW';
  return 'SUFFICIENT';
}

export function getStatusBadgeInfo(status: StockStatus) {
  switch (status) {
    case 'OUT_OF_STOCK':
    case 'RUPTURE':
      return {
        label: 'Out of Stock',
        bg: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-600',
        color: '#94a3b8',
        iconColor: 'text-red-600'
      };
    case 'CRITICAL':
    case 'CRITIQUE':
      return {
        label: 'Critical Stock',
        bg: 'bg-rose-100 text-rose-700 border-rose-200',
        dot: 'bg-rose-600',
        color: '#ef4444',
        iconColor: 'text-rose-600'
      };
    case 'LOW':
    case 'FAIBLE':
      return {
        label: 'Low Stock',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        color: '#eab308',
        iconColor: 'text-amber-600'
      };
    case 'SUFFICIENT':
    case 'SUFFISANT':
    default:
      return {
        label: 'Optimal Stock',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        color: '#22c55e',
        iconColor: 'text-emerald-600'
      };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function exportEquipmentToCSV(equipmentList: Equipment[]) {
  const headers = [
    'Equipment Code',
    'Designation',
    'Category',
    'Current Stock',
    'Min Threshold (Safety)',
    'Unit',
    'Stock Status',
    'Replenishment Deficit',
    'Storage Location',
    'Supplier',
    'Unit Cost ($)',
    'Total Stock Valuation ($)'
  ];

  const rows = equipmentList.map(item => {
    const status = getStockStatus(item.currentStock, item.minThreshold);
    const deficit = Math.max(0, item.minThreshold - item.currentStock);
    const totalVal = item.currentStock * item.unitCost;
    return [
      `"${item.code}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.currentStock,
      item.minThreshold,
      `"${item.unit}"`,
      `"${status}"`,
      deficit,
      `"${item.location}"`,
      `"${item.supplier}"`,
      item.unitCost,
      totalVal
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `batistock_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


