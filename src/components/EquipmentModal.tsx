import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Tag, Sliders, AlertTriangle, Building2, Plus, HardHat } from 'lucide-react';
import { Equipment, Category } from '../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit?: Equipment | null;
  categories: Category[];
  onOpenNewCategoryModal: () => void;
  onSaveEquipment: (equipmentData: Omit<Equipment, 'id' | 'lastUpdated'>, id?: string) => void;
}

const UNITS = ['bags', 'units', 'pieces', 'pairs', 'meters', 'kg', 'rolls', 'drums', 'kits'];

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  equipmentToEdit,
  categories,
  onOpenNewCategoryModal,
  onSaveEquipment,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minThreshold, setMinThreshold] = useState<number>(0);
  const [unit, setUnit] = useState<string>('units');
  const [location, setLocation] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [iconType, setIconType] = useState<Equipment['iconType']>('default');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (equipmentToEdit) {
        setCode(equipmentToEdit.code);
        setName(equipmentToEdit.name);
        setCategory(equipmentToEdit.category);
        setCurrentStock(equipmentToEdit.currentStock);
        setMinThreshold(equipmentToEdit.minThreshold);
        setUnit(equipmentToEdit.unit);
        setLocation(equipmentToEdit.location);
        setSupplier(equipmentToEdit.supplier);
        setUnitCost(equipmentToEdit.unitCost);
        setIconType(equipmentToEdit.iconType || 'default');
        setNotes(equipmentToEdit.notes || '');
      } else {
        const rand = Math.floor(100 + Math.random() * 900);
        setCode(`EQP-${rand}`);
        setName('');
        setCategory(categories[0]?.name || 'General');
        setCurrentStock(0);
        setMinThreshold(0);
        setUnit('units');
        setLocation('');
        setSupplier('');
        setUnitCost(0);
        setIconType('default');
        setNotes('');
      }
    }
  }, [isOpen, equipmentToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveEquipment(
      {
        code: code.trim(),
        name: name.trim(),
        category: category || (categories[0]?.name ?? 'General'),
        currentStock: Number(currentStock) || 0,
        minThreshold: Number(minThreshold) || 0,
        unit,
        location: location.trim() || 'Central Warehouse',
        supplier: supplier.trim() || 'Standard Supplier',
        unitCost: Number(unitCost) || 0,
        iconType,
        notes: notes.trim(),
      },
      equipmentToEdit?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {equipmentToEdit ? 'Edit Equipment Specifications' : 'Add New Equipment / Material'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Set minimum safety threshold to trigger automatic replenishment alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reference Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Item / Equipment Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Portland Cement Type I, Safety Helmet..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          {/* Jobsite Category defined by Site Manager */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Jobsite Category (Managed by Supervisor) *
              </label>
              <button
                type="button"
                onClick={() => {
                  onOpenNewCategoryModal();
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Create Jobsite Category</span>
              </button>
            </div>
            {categories.length > 0 ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} — Jobsite: {c.siteName}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter category name (e.g. Concrete, PPE, Power Tools...)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
                <button
                  type="button"
                  onClick={onOpenNewCategoryModal}
                  className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg hover:bg-blue-100 whitespace-nowrap cursor-pointer"
                >
                  + Create Category
                </button>
              </div>
            )}
          </div>

          {/* Stock & Minimum Threshold defined by User/Supervisor */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">
                Safety Stock & Replenishment Threshold
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-center focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
                  Minimum Safety Threshold *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Unit of Measure
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-amber-800 leading-snug">
              🔔 If stock on hand reaches or drops below this safety threshold (<strong>{minThreshold} {unit}</strong>), a high-visibility alert is triggered on the dashboard and audio alerts will chime.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Icon Representation
              </label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value as Equipment['iconType'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                <option value="default">Standard / Packaging</option>
                <option value="ciment">Cement / Bagged Binder</option>
                <option value="casque">Hard Hat / Helmet</option>
                <option value="gilet">High-Vis Vest</option>
                <option value="barre">Rebar / Steel Bar</option>
                <option value="betonniere">Concrete Mixer / Heavy Plant</option>
                <option value="gants">Safety Gloves</option>
                <option value="outil">Power Tools</option>
                <option value="eclairage">Site Lighting</option>
                <option value="harnais">Safety Harness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Storage Depot / Bay
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Warehouse Bay 3..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Supplier
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. LafargeHolcim, Delta Plus..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Specifications & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Serial numbers, certifications, safety compliance remarks..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {equipmentToEdit ? 'Save Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
