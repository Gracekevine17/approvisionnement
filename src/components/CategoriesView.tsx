import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Building2, 
  User, 
  Layers, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  Plus
} from 'lucide-react';
import { Category, Equipment } from '../types';
import { getStockStatus } from '../utils/stockUtils';

interface CategoriesViewProps {
  categories: Category[];
  equipment: Equipment[];
  onOpenNewCategory?: () => void;
  onAddCategoryClick?: () => void;
  onEditCategory?: (category: Category) => void;
  onEditCategoryClick?: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onFilterCategoryInInventory?: (categoryName: string) => void;
  onSelectCategoryFilter?: (categoryName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  equipment,
  onOpenNewCategory,
  onAddCategoryClick,
  onEditCategory,
  onEditCategoryClick,
  onDeleteCategory,
  onFilterCategoryInInventory,
  onSelectCategoryFilter,
}) => {
  const handleAddCategory = onOpenNewCategory || onAddCategoryClick || (() => {});
  const handleEditCategory = onEditCategory || onEditCategoryClick || (() => {});
  const handleFilterCategory = onFilterCategoryInInventory || onSelectCategoryFilter || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('ALL');

  // Stats calculation
  const totalCategories = categories.length;
  const sitesCount = new Set(categories.map((c) => c.siteName)).size;
  const categorizedEquipmentCount = equipment.length;

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.managerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSite = selectedSite === 'ALL' || cat.siteName === selectedSite;

    return matchesSearch && matchesSite;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Site Manager Setup Module
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Custom configuration per jobsite</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Equipment & Material Categories</h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Site managers and works supervisors can create, configure, and allocate categories to match the equipment types and safety stock thresholds needed on each active construction project.
          </p>
        </div>

        <button
          onClick={handleAddCategory}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalCategories}</div>
            <div className="text-xs text-slate-500 font-medium">Categories defined by site managers</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{sitesCount}</div>
            <div className="text-xs text-slate-500 font-medium">Jobsites with allocated categories</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{categorizedEquipmentCount}</div>
            <div className="text-xs text-slate-500 font-medium">Equipment & materials mapped</div>
          </div>
        </div>
      </div>

      {/* Search and Site Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by category name, code, manager, or jobsite..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">Filter by Jobsite:</span>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
          >
            <option value="ALL">All Jobsites ({categories.length})</option>
            {Array.from(new Set(categories.map((c) => c.siteName).filter(Boolean))).map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const relatedItems = equipment.filter((eq) => eq.category.toLowerCase() === cat.name.toLowerCase());
          const alertItems = relatedItems.filter((eq) => {
            const st = getStockStatus(eq.currentStock, eq.minThreshold);
            return st === 'CRITICAL' || st === 'CRITIQUE' || st === 'OUT_OF_STOCK' || st === 'RUPTURE' || st === 'LOW' || st === 'FAIBLE';
          });
          const totalStockInCat = relatedItems.reduce((acc, curr) => acc + curr.currentStock, 0);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Card Top */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FolderPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {cat.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      title="Edit this category"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteCategory(cat.id);
                      }}
                      title="Delete this category"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Site badge & Responsible person */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-700">Jobsite:</span>
                    <span className="truncate">{cat.siteName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-700">Manager:</span>
                    <span className="truncate text-slate-900 font-medium">{cat.managerName}</span>
                  </div>
                </div>

                {/* Description */}
                {cat.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {cat.description}
                  </p>
                )}

                {/* Quick Stock Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[11px] text-slate-500 block">Mapped Items</span>
                    <span className="font-bold text-slate-900">{relatedItems.length} items</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[11px] text-slate-500 block">Total Stock</span>
                    <span className="font-bold text-slate-900">{totalStockInCat} units</span>
                  </div>
                </div>

                {/* Alerts indicator */}
                {alertItems.length > 0 ? (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span>{alertItems.length} item(s) below safety threshold</span>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>All stock levels comply with safety thresholds</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Created on {new Date(cat.createdDate).toLocaleDateString('en-US')}</span>
                <button
                  onClick={() => handleFilterCategory(cat.name)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View in inventory &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No categories found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No category matches your search filter. Click "+ Add New Category" to set up your jobsite equipment headings.
          </p>
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            + Add New Category
          </button>
        </div>
      )}
    </div>
  );
};
