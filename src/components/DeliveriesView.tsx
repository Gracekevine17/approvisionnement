import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  Search, 
  Plus, 
  Calendar, 
  Building, 
  User, 
  FileText, 
  Truck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Delivery } from '../types';
import { formatCurrency } from '../utils/stockUtils';

interface DeliveriesViewProps {
  deliveries: Delivery[];
  onOpenNewDelivery: () => void;
}

export const DeliveriesView: React.FC<DeliveriesViewProps> = ({
  deliveries,
  onOpenNewDelivery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeliveries = deliveries.filter(
    (del) =>
      del.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.receivedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDeliveredUnits = deliveries.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalDeliveriesCost = deliveries.reduce((acc, curr) => acc + curr.totalCost, 0);

  return (
    <div id="deliveries-view" className="space-y-5">
      {/* Top Banner & KPI summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Inbound Receipts</div>
              <div className="text-2xl font-black text-slate-900">{deliveries.length} GRN notes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Received Stock Volume</div>
              <div className="text-2xl font-black text-emerald-600">+{totalDeliveredUnits} units</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Receipt Value</div>
              <div className="text-2xl font-black text-slate-900">{formatCurrency(totalDeliveriesCost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by GRN voucher, equipment, supplier, receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <button
          onClick={onOpenNewDelivery}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Inbound Receipt (GRN)</span>
        </button>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">GRN Voucher #</th>
                <th scope="col" className="px-4 py-3">Received Equipment</th>
                <th scope="col" className="px-4 py-3">Supplier</th>
                <th scope="col" className="px-4 py-3 text-center">Delivered Qty</th>
                <th scope="col" className="px-4 py-3 text-right">Total Cost</th>
                <th scope="col" className="px-4 py-3">Receiver & Date</th>
                <th scope="col" className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-xs">
                    <Truck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No stock receipts recorded (0 receipts)</p>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                      When materials arrive on site, log your first Goods Receipt Note (GRN) to increment your stock automatically.
                    </p>
                    <button
                      onClick={onOpenNewDelivery}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>+ Log First Receipt</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border">
                          {del.deliveryNumber}
                        </span>
                      </div>
                      {del.invoiceNumber && (
                        <div className="text-[10px] text-slate-400 mt-0.5 ml-6">
                          Invoice: {del.invoiceNumber}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{del.equipmentName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{del.equipmentCode}</div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span>{del.supplier}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        +{del.quantity} {del.unit}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="font-bold text-slate-900">{formatCurrency(del.totalCost)}</div>
                      <div className="text-[10px] text-slate-400">
                        ({formatCurrency(del.unitCost)} / {del.unit})
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>{del.receivedBy}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{del.receivedDate}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-500 max-w-xs truncate">
                      {del.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
