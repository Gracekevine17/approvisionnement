import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Search, 
  Plus, 
  Calendar, 
  HardHat, 
  User, 
  FileText, 
  CheckCircle2, 
  RotateCcw,
  Building,
  AlertCircle
} from 'lucide-react';
import { Dispatch } from '../types';

interface DispatchesViewProps {
  dispatches: Dispatch[];
  onOpenNewDispatch: () => void;
  onReturnEquipment: (dispatchId: string, quantityToReturn: number) => void;
}

export const DispatchesView: React.FC<DispatchesViewProps> = ({
  dispatches,
  onOpenNewDispatch,
  onReturnEquipment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  
  // Modal for quick return of equipment
  const [returningDispatch, setReturningDispatch] = useState<Dispatch | null>(null);
  const [returnQty, setReturnQty] = useState<number>(1);

  // Extract unique site names
  const sites = Array.from(new Set(dispatches.map((d) => d.siteName)));

  const filteredDispatches = dispatches.filter((disp) => {
    const matchesSearch =
      disp.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disp.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disp.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disp.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disp.siteManager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSite = selectedSite === 'all' || disp.siteName === selectedSite;

    return matchesSearch && matchesSite;
  });

  const totalDispatchedUnits = dispatches.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleConfirmReturn = () => {
    if (returningDispatch && returnQty > 0) {
      onReturnEquipment(returningDispatch.id, returnQty);
      setReturningDispatch(null);
    }
  };

  return (
    <div id="dispatches-view" className="space-y-5">
      {/* Top Banner KPI summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
              <HardHat className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Jobsite Dispatches</div>
              <div className="text-2xl font-black text-slate-900">{dispatches.length} checkouts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Deployed Quantity</div>
              <div className="text-2xl font-black text-amber-600">{totalDispatchedUnits} units</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Returnable Tools On-Site</div>
              <div className="text-2xl font-black text-slate-900">
                {dispatches.filter((d) => d.isReturnable && d.returnStatus !== 'FULLY_RETURNED' && d.returnStatus !== 'RETOUR_COMPLET').length} active
              </div>
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
            placeholder="Search by dispatch voucher, equipment, destination jobsite, supervisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        {/* Site Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Jobsites</option>
            {sites.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={onOpenNewDispatch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Jobsite Dispatch</span>
          </button>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">Dispatch Voucher #</th>
                <th scope="col" className="px-4 py-3">Destination Jobsite</th>
                <th scope="col" className="px-4 py-3">Dispatched Item</th>
                <th scope="col" className="px-4 py-3 text-center">Quantity</th>
                <th scope="col" className="px-4 py-3">Site Manager & Date</th>
                <th scope="col" className="px-4 py-3">Type & Return Status</th>
                <th scope="col" className="px-4 py-3 text-right">Return Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDispatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-xs">
                    <ArrowUpRight className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No jobsite dispatches recorded (0 checkout)</p>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                      When equipment or raw materials are assigned or shipped to an active construction site, create a Dispatch Voucher.
                    </p>
                    <button
                      onClick={onOpenNewDispatch}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>+ Register Jobsite Dispatch</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDispatches.map((disp) => {
                  const isReturned = disp.returnStatus === 'FULLY_RETURNED' || disp.returnStatus === 'RETOUR_COMPLET';
                  const remainingToReturn = disp.quantity - (disp.returnedQuantity || 0);

                  return (
                    <tr key={disp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border">
                            {disp.dispatchNumber}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Building className="h-3.5 w-3.5 text-amber-600" />
                          <span>{disp.siteName}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{disp.equipmentName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{disp.equipmentCode}</div>
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                          -{disp.quantity} {disp.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-slate-800">
                          <User className="h-3 w-3 text-slate-400" />
                          <span>{disp.siteManager}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>{disp.dispatchedDate}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        {disp.isReturnable ? (
                          isReturned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Returned to Central Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                              <RotateCcw className="h-3 w-3" />
                              On Loan to Site ({remainingToReturn} remaining)
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            Consumed On-Site
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {disp.isReturnable && !isReturned ? (
                          <button
                            onClick={() => {
                              setReturningDispatch(disp);
                              setReturnQty(remainingToReturn);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                            title="Return this equipment to warehouse"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Return to Stock</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for returning equipment from construction site */}
      {returningDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Jobsite Equipment Return</h3>
                <p className="text-xs text-slate-500">Reintegration into central depot inventory</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-medium text-slate-500">Equipment</span>
                <div className="font-bold text-slate-900 text-sm">{returningDispatch.equipmentName}</div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500">Originating Jobsite</span>
                <div className="font-semibold text-slate-700">{returningDispatch.siteName}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity returned in working order (Max: {returningDispatch.quantity - (returningDispatch.returnedQuantity || 0)})
                </label>
                <input
                  type="number"
                  min="1"
                  max={returningDispatch.quantity - (returningDispatch.returnedQuantity || 0)}
                  value={returnQty}
                  onChange={(e) => setReturnQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReturningDispatch(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow cursor-pointer"
              >
                Confirm Return (+{returnQty} to stock)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
