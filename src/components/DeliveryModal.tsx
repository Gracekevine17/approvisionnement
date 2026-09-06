import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { Equipment, Delivery } from '../types';
import { formatCurrency } from '../utils/stockUtils';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  selectedEquipmentId?: string;
  suggestedQuantity?: number;
  onSaveDelivery: (deliveryData: Omit<Delivery, 'id'>) => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  selectedEquipmentId,
  suggestedQuantity,
  onSaveDelivery,
}) => {
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [deliveryNumber, setDeliveryNumber] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [receivedBy, setReceivedBy] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const randomGRN = `GRN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      setDeliveryNumber(randomGRN);

      const targetId = selectedEquipmentId || (equipmentList[0]?.id ?? '');
      setEquipmentId(targetId);

      const selected = equipmentList.find((e) => e.id === targetId);
      if (selected) {
        setSupplier(selected.supplier);
        setUnitCost(selected.unitCost);
        const deficit = Math.max(0, selected.minThreshold - selected.currentStock);
        setQuantity(suggestedQuantity || (deficit > 0 ? deficit + 2 : 5));
      }
    }
  }, [isOpen, selectedEquipmentId, equipmentList, suggestedQuantity]);

  const handleEquipmentChange = (newId: string) => {
    setEquipmentId(newId);
    const selected = equipmentList.find((e) => e.id === newId);
    if (selected) {
      setSupplier(selected.supplier);
      setUnitCost(selected.unitCost);
      const deficit = Math.max(0, selected.minThreshold - selected.currentStock);
      setQuantity(deficit > 0 ? deficit + 2 : 5);
    }
  };

  if (!isOpen) return null;

  const currentEquipment = equipmentList.find((e) => e.id === equipmentId);
  const totalCost = quantity * unitCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEquipment || quantity <= 0) return;

    onSaveDelivery({
      deliveryNumber,
      equipmentId: currentEquipment.id,
      equipmentName: currentEquipment.name,
      equipmentCode: currentEquipment.code,
      quantity,
      unit: currentEquipment.unit,
      supplier,
      unitCost,
      totalCost,
      receivedBy: receivedBy.trim() || 'Storekeeper',
      receivedDate: new Date().toISOString().split('T')[0],
      invoiceNumber: invoiceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Log Goods Receipt Note (GRN)
              </h3>
              <p className="text-xs text-slate-500">Inbound delivery added directly to central stock</p>
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
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-amber-900">No equipment items found</p>
              <p className="text-[11px] text-amber-700 mt-1">
                Please create at least one equipment catalog item before logging inbound deliveries.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Equipment / Material to Receive *
              </label>
              <select
                value={equipmentId}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {equipmentList.map((eqp) => (
                  <option key={eqp.id} value={eqp.id}>
                    [{eqp.code}] {eqp.name} (Current: {eqp.currentStock} {eqp.unit} | Min: {eqp.minThreshold})
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentEquipment && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-600">Current Stock: </span>
                <strong className="text-slate-900">{currentEquipment.currentStock} {currentEquipment.unit}</strong>
                <span className="text-slate-400 mx-2">|</span>
                <span className="text-slate-600">Safety Min: </span>
                <strong className="text-amber-700">{currentEquipment.minThreshold} {currentEquipment.unit}</strong>
              </div>
              <div className="font-bold text-emerald-800">
                New stock level: {currentEquipment.currentStock + quantity} {currentEquipment.unit}
              </div>
            </div>
          )}

          {/* Delivery Number & Invoice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GRN Voucher # *
              </label>
              <input
                type="text"
                required
                value={deliveryNumber}
                onChange={(e) => setDeliveryNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor Invoice # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. INV-2026-89"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier / Vendor *
            </label>
            <input
              type="text"
              required
              placeholder="Enter supplier or merchant name..."
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Quantity & Unit Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivered Quantity ({currentEquipment?.unit || 'units'}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Purchase Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Total Cost preview */}
          <div className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg text-xs">
            <span className="text-slate-500 font-medium">Total Inbound Receipt Value:</span>
            <span className="font-bold text-slate-900 text-sm">{formatCurrency(totalCost)}</span>
          </div>

          {/* Received By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Received By (Storekeeper / Materials Coordinator) *
            </label>
            <input
              type="text"
              required
              placeholder="Enter receiving agent name..."
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Inspection Notes
            </label>
            <textarea
              rows={2}
              placeholder="Packaging condition, quality certificates, damage inspection remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
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
              disabled={equipmentList.length === 0}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5 ${
                equipmentList.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              <PackageCheck className="h-4 w-4" />
              <span>Confirm Receipt (+{quantity} to stock)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
