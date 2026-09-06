import React from 'react';
import { X, Printer, FileText, ShieldAlert } from 'lucide-react';
import { Equipment } from '../types';
import { formatCurrency } from '../utils/stockUtils';

interface SupplyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  underThresholdItems: Equipment[];
  onOrderProcessed?: () => void;
}

export const SupplyOrderModal: React.FC<SupplyOrderModalProps> = ({
  isOpen,
  onClose,
  underThresholdItems,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const orderItems = underThresholdItems.map((item) => {
    const deficit = Math.max(0, item.minThreshold - item.currentStock);
    // Suggest ordering deficit + buffer based on user's defined threshold
    const orderQuantity = deficit + Math.max(2, Math.round(item.minThreshold * 0.5));
    const estimatedCost = orderQuantity * item.unitCost;
    return {
      ...item,
      deficit,
      orderQuantity,
      estimatedCost,
    };
  });

  const totalEstimatedBudget = orderItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        {/* Header (hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Consolidated Reorder Sheet (Safety Threshold Deficits)
              </h3>
              <p className="text-xs text-slate-500">Auto-calculated using your defined safety stock limits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Order</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl print:bg-white print:border-none print:p-0">
          <div className="flex justify-between items-start border-b border-slate-300 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">JOBSITE REPLENISHMENT PURCHASE ORDER</h2>
              <p className="text-xs text-slate-600 mt-0.5">Procurement Division & Jobsite Supply Warehouse</p>
              <div className="text-xs text-slate-500 mt-1">Issue Date: {todayStr}</div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-md text-xs font-bold">
                CLIENT THRESHOLD DEFICIT
              </span>
              <div className="text-xs text-slate-500 font-mono mt-1">Ref: PO-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</div>
            </div>
          </div>

          <div className="mt-3.5 text-xs text-slate-600 leading-relaxed">
            This requisition consolidates items whose warehouse inventory has reached or fallen below the minimum safety threshold specified by the client site manager.
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-xs divide-y divide-slate-200 border border-slate-200 bg-white">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2 text-left">Asset Code</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Stock</th>
                  <th className="px-3 py-2 text-center">Your Min</th>
                  <th className="px-3 py-2 text-center text-indigo-700">Order Quantity</th>
                  <th className="px-3 py-2 text-left">Primary Vendor</th>
                  <th className="px-3 py-2 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono font-bold text-slate-800">{item.code}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-3 py-2 text-center text-rose-600 font-mono font-bold">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-3 py-2 text-center text-amber-700 font-mono font-bold">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-black text-indigo-700 bg-indigo-50/50">
                      +{item.orderQuantity} {item.unit}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{item.supplier}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.estimatedCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <td colSpan={6} className="px-3 py-2 text-right">TOTAL ESTIMATED BUDGET (EXCL. TAX):</td>
                  <td className="px-3 py-2 text-right text-indigo-700 font-black font-mono text-sm">
                    {formatCurrency(totalEstimatedBudget)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="font-semibold text-slate-700">Yard Warehouse Manager Sign-Off:</span>
              <div className="mt-8 border-b border-slate-300 w-48"></div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-700">Procurement Officer Approval:</span>
              <div className="mt-8 border-b border-slate-300 w-48 ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Reorder Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};

