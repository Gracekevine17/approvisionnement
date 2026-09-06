import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, AlertTriangle, ShieldAlert, Check, HardHat } from 'lucide-react';
import { Equipment, Dispatch } from '../types';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  selectedEquipmentId?: string;
  onSaveDispatch: (dispatchData: Omit<Dispatch, 'id'>) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  selectedEquipmentId,
  onSaveDispatch,
}) => {
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [dispatchNumber, setDispatchNumber] = useState<string>('');
  const [siteName, setSiteName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [siteManager, setSiteManager] = useState<string>('');
  const [isReturnable, setIsReturnable] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const randomBS = `DSP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      setDispatchNumber(randomBS);

      // Find first available equipment with stock > 0
      const availableItems = equipmentList.filter((e) => e.currentStock > 0);
      const targetId = selectedEquipmentId || (availableItems[0]?.id ?? equipmentList[0]?.id ?? '');
      setEquipmentId(targetId);
      setQuantity(1);
      setSiteName('');
      setSiteManager('');
    }
  }, [isOpen, selectedEquipmentId, equipmentList]);

  if (!isOpen) return null;

  const currentEquipment = equipmentList.find((e) => e.id === equipmentId);
  const currentStock = currentEquipment ? currentEquipment.currentStock : 0;
  const remainingAfter = currentStock - quantity;
  const isOutOfStock = currentStock <= 0;
  const willBreachThreshold = currentEquipment && remainingAfter <= currentEquipment.minThreshold;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEquipment || quantity <= 0 || quantity > currentStock) return;
    if (!siteName.trim()) return;

    onSaveDispatch({
      dispatchNumber,
      equipmentId: currentEquipment.id,
      equipmentName: currentEquipment.name,
      equipmentCode: currentEquipment.code,
      quantity,
      unit: currentEquipment.unit,
      siteName: siteName.trim(),
      siteManager: siteManager.trim() || 'Site Supervisor',
      dispatchedDate: new Date().toISOString().split('T')[0],
      isReturnable,
      returnStatus: isReturnable ? 'ON_SITE' : undefined,
      returnedQuantity: 0,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Register Jobsite Dispatch Voucher
              </h3>
              <p className="text-xs text-slate-500">Equipment checkout or consumable deployment to site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {equipmentList.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-amber-900">No equipment items in inventory</p>
              <p className="text-[11px] text-amber-700 mt-1">
                Depot inventory is empty. Add equipment and record inbound receipts before dispatching.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Equipment / Material to Dispatch *
              </label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                {equipmentList.map((eqp) => (
                  <option key={eqp.id} value={eqp.id} disabled={eqp.currentStock <= 0}>
                    [{eqp.code}] {eqp.name} {eqp.currentStock <= 0 ? '(OUT OF STOCK - 0 available)' : `(Available: ${eqp.currentStock} ${eqp.unit})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Real-time Threshold Warning Banner */}
          {currentEquipment && (
            <div className={`p-3 rounded-xl text-xs border ${
              isOutOfStock
                ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                : willBreachThreshold
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span>Stock on hand before dispatch: </span>
                  <strong className="text-slate-900">{currentStock} {currentEquipment.unit}</strong>
                </div>
                <div>
                  <span>Safety threshold: </span>
                  <strong className="text-amber-800">{currentEquipment.minThreshold} {currentEquipment.unit}</strong>
                </div>
              </div>

              {willBreachThreshold && !isOutOfStock && (
                <div className="mt-2 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Warning: After this dispatch, remaining stock will be {remainingAfter} {currentEquipment.unit}, triggering an automated replenishment alert!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Dispatch Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dispatch Voucher # *
            </label>
            <input
              type="text"
              required
              value={dispatchNumber}
              onChange={(e) => setDispatchNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Construction Site Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Jobsite *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Horizon West Tower, South Terminal Expansion..."
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Quantity to Dispatch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to Dispatch (Max available: {currentStock} {currentEquipment?.unit}) *
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(1, currentStock)}
              required
              disabled={isOutOfStock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg text-amber-700 focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Site Manager / Receiver */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jobsite Supervisor / Works Foreman (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter name of foreman or supervisor receiving on site..."
              value={siteManager}
              onChange={(e) => setSiteManager(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Returnable check */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              id="returnable-checkbox"
              checked={isReturnable}
              onChange={(e) => setIsReturnable(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="returnable-checkbox" className="text-xs text-slate-700 cursor-pointer">
              <strong>Returnable Tool / Plant Loan</strong> (e.g., scaffolding, power tools, safety harnesses to return to depot when job finishes).
              Uncheck for consumables permanently installed on site.
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Package / Allocation Purpose
            </label>
            <textarea
              rows={2}
              placeholder="Foundation phase, electrical team, specific floor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={equipmentList.length === 0 || isOutOfStock || quantity > currentStock}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5 ${
                equipmentList.length === 0 || isOutOfStock || quantity > currentStock
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 cursor-pointer'
              }`}
            >
              <HardHat className="h-4 w-4" />
              <span>Confirm Dispatch (-{quantity} from stock)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
