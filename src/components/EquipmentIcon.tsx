import React from 'react';
import { 
  HardHat, 
  Package, 
  Wrench, 
  Lightbulb, 
  Shield, 
  Layers, 
  Hammer, 
  FileText 
} from 'lucide-react';

interface EquipmentIconProps {
  type?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EquipmentIcon: React.FC<EquipmentIconProps> = ({ 
  type = 'default', 
  className = '',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const containerClass = `rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs border ${sizeClasses[size]} ${className}`;

  switch (type) {
    case 'ciment':
      return (
        <div className={`${containerClass} bg-amber-50 border-amber-200 text-amber-800`}>
          {/* Stylized Cement Bag */}
          <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-amber-100 to-amber-200/80 p-1">
            <span className="text-[9px] font-black tracking-tighter text-amber-900 leading-none">CIM</span>
            <div className="w-4/5 h-1 bg-amber-800/40 rounded-full mt-0.5"></div>
            <span className="text-[7px] font-bold text-amber-700">CPJ</span>
          </div>
        </div>
      );

    case 'casque':
      return (
        <div className={`${containerClass} bg-amber-100 border-amber-300 text-amber-700`}>
          <HardHat className="w-3/5 h-3/5 text-amber-600 fill-amber-400" />
        </div>
      );

    case 'gilet':
      return (
        <div className={`${containerClass} bg-yellow-100 border-yellow-300 text-yellow-800`}>
          <div className="relative flex items-center justify-center w-full h-full bg-yellow-400/90 rounded">
            <div className="w-1.5 h-full bg-slate-100/90 absolute left-1/4"></div>
            <div className="w-1.5 h-full bg-slate-100/90 absolute right-1/4"></div>
            <span className="text-[8px] font-black text-slate-800 z-10">EPI</span>
          </div>
        </div>
      );

    case 'barre':
      return (
        <div className={`${containerClass} bg-slate-100 border-slate-300 text-slate-700`}>
          <div className="flex flex-col gap-0.5 items-center justify-center w-full h-full p-1.5">
            <div className="w-full h-1 bg-slate-500 rounded-full"></div>
            <div className="w-full h-1 bg-slate-600 rounded-full"></div>
            <div className="w-full h-1 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      );

    case 'betonniere':
      return (
        <div className={`${containerClass} bg-orange-100 border-orange-300 text-orange-700`}>
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="w-5 h-5 rounded-full bg-orange-500 border border-orange-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>
          </div>
        </div>
      );

    case 'gants':
      return (
        <div className={`${containerClass} bg-stone-100 border-stone-300 text-stone-700`}>
          <div className="flex items-center justify-center w-full h-full bg-stone-200">
            <span className="text-base leading-none">🧤</span>
          </div>
        </div>
      );

    case 'outil':
      return (
        <div className={`${containerClass} bg-blue-100 border-blue-300 text-blue-700`}>
          <Wrench className="w-3/5 h-3/5" />
        </div>
      );

    case 'eclairage':
      return (
        <div className={`${containerClass} bg-cyan-100 border-cyan-300 text-cyan-700`}>
          <Lightbulb className="w-3/5 h-3/5" />
        </div>
      );

    case 'harnais':
      return (
        <div className={`${containerClass} bg-purple-100 border-purple-300 text-purple-700`}>
          <Shield className="w-3/5 h-3/5" />
        </div>
      );

    default:
      return (
        <div className={`${containerClass} bg-slate-100 border-slate-200 text-slate-600`}>
          <Package className="w-3/5 h-3/5" />
        </div>
      );
  }
};
