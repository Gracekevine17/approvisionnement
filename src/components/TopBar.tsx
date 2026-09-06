import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Sliders, 
  HardHat, 
  User, 
  CheckCircle2,
  X,
  LogOut
} from 'lucide-react';
import { ActiveTab, Reminder, Equipment, AppUser } from '../types';

interface TopBarProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
  alertsCount: number;
  reminders: Reminder[];
  equipmentWithAlerts: Equipment[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenThresholdModal: () => void;
  currentUser?: AppUser | null;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onToggleSidebar,
  alertsCount,
  reminders,
  equipmentWithAlerts,
  soundEnabled,
  onToggleSound,
  onNavigateToTab,
  onOpenThresholdModal,
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState(() => {
    return currentUser?.name || localStorage.getItem('batistock_user_name') || 'Site Supervisor';
  });
  const [userRole, setUserRole] = useState(() => {
    return currentUser?.role || localStorage.getItem('batistock_user_role') || 'Works Supervisor / Site Manager';
  });

  React.useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserRole(currentUser.role);
    }
  }, [currentUser]);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempRole, setTempRole] = useState(userRole);

  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setUserRole(tempRole.trim() || 'Site Manager');
      localStorage.setItem('batistock_user_name', tempName.trim());
      localStorage.setItem('batistock_user_role', tempRole.trim() || 'Site Manager');
      setIsEditingUser(false);
    }
  };

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Operational Dashboard';
      case 'equipements':
        return 'Jobsite Equipment Directory';
      case 'categories':
        return 'Jobsite Categories (Site Manager Setup)';
      case 'stock':
        return 'Stock Inventory & Safety Thresholds';
      case 'entrees':
        return 'Inbound Receipts & Deliveries (GRN)';
      case 'sorties':
        return 'Jobsite Dispatches & Material Usage';
      case 'livraisons':
        return 'Supplier Delivery Monitoring';
      case 'fournisseurs':
        return 'Construction Suppliers Directory';
      case 'alertes':
        return 'Stock Deficit & Safety Threshold Alerts';
      case 'rappels':
        return 'Jobsite Deadlines & Task Reminders';
      case 'rapports':
        return 'Inventory Reports & Flow Analytics';
      case 'historique':
        return 'Activity Log & Operations Audit';
      case 'parametres':
        return 'System Preferences & Alert Rules';
      default:
        return 'BATISTOCK';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
          {getTabTitle(activeTab)}
        </h1>
      </div>

      {/* Right: Actions, Audio, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Safety Threshold Button */}
        <button
          onClick={onOpenThresholdModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          title="Configure safety thresholds defined by site manager"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-600" />
          <span>Safety Thresholds</span>
        </button>

        {/* Audio Alert Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-slate-50 text-amber-600 border-amber-200 hover:bg-amber-50'
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
          }`}
          title={soundEnabled ? 'Audio alert active (Threshold warning sound on)' : 'Audio alert muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Threshold alerts & reminders"
          >
            <Bell className="w-5 h-5" />
            {alertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {alertsCount > 9 ? '9+' : alertsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900">Detected Alerts & Reminders</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 space-y-2 max-h-72 overflow-y-auto">
                {equipmentWithAlerts.length === 0 && reminders.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No active stock alerts</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">All equipment stocks comply with safety thresholds</p>
                  </div>
                )}
                {equipmentWithAlerts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToTab('alertes');
                    }}
                    className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5 cursor-pointer hover:bg-rose-50 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 flex-shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-rose-700 font-semibold">
                        Stock: {item.currentStock} {item.unit} (Min Threshold: {item.minThreshold} {item.unit})
                      </p>
                    </div>
                  </div>
                ))}

                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToTab('rappels');
                    }}
                    className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{rem.title}</p>
                      <p className="text-[11px] text-slate-500">{rem.timeLabel}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToTab('alertes');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View all alerts &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            {/* Avatar image / portrait */}
            <div className="w-9 h-9 rounded-full bg-blue-600 overflow-hidden ring-2 ring-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-white text-xs">
              <span className="w-full h-full flex items-center justify-center font-black">
                {userName.substring(0, 2).toUpperCase() || 'GK'}
              </span>
            </div>

            <div className="hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{userName}</div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight truncate max-w-[140px]">{userRole}</div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
              {isEditingUser ? (
                <form onSubmit={handleSaveUserProfile} className="p-2 border-b border-slate-100 mb-2 space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Role / Title</label>
                    <input
                      type="text"
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingUser(false)}
                      className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{userName}</p>
                    <p className="text-slate-400 text-[11px] truncate max-w-[170px]">{userRole}</p>
                  </div>
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setTempRole(userRole);
                      setIsEditingUser(true);
                    }}
                    className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateToTab('categories');
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer"
              >
                Manage Jobsite Categories
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateToTab('parametres');
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 cursor-pointer"
              >
                Settings & Alert Rules
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onLogout) {
                    onLogout();
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 font-bold text-rose-600 cursor-pointer flex items-center justify-between"
              >
                <span>Sign Out</span>
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
