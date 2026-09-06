export interface Category {
  id: string;
  name: string; // Ex: "Raw Materials", "PPE & Safety", "Heavy Equipment", "Power Tools"
  code: string; // Ex: "MAT", "PPE", "EQP", "TLS"
  siteName: string; // Jobsite configured by manager, e.g., "Horizon West Tower", "All Jobsites"
  managerName: string; // Manager handling category e.g., "Grâce Kevine (Site Works Supervisor)"
  description?: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate' | 'cyan';
  createdDate: string;
}

export type StockStatus = 
  | 'SUFFICIENT' 
  | 'LOW' 
  | 'CRITICAL' 
  | 'OUT_OF_STOCK'
  | 'SUFFISANT' 
  | 'FAIBLE' 
  | 'CRITIQUE' 
  | 'RUPTURE';

export interface Equipment {
  id: string;
  code: string; // Ex: "MAT-CEM-01"
  name: string; // Ex: "Portland Cement CPJ 45"
  category: string; // Category entered by site manager
  currentStock: number;
  minThreshold: number; // Safety minimum threshold defined by site manager/client
  unit: string; // "bags", "units", "pieces", "pairs", "meters", "kg"
  location: string; // "Central Warehouse - Bay A", "Horizon Jobsite - Bay 3"
  supplier: string; // "LafargeHolcim", "Delta Plus Safety", etc.
  unitCost: number; // Unit cost in $ / €
  lastUpdated: string; // Timestamp
  iconType?: 'ciment' | 'casque' | 'gilet' | 'barre' | 'betonniere' | 'gants' | 'eclairage' | 'harnais' | 'outil' | 'default';
  notes?: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string; // "GRN-2024-089"
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  quantity: number;
  unit: string;
  supplier: string;
  status: 'PENDING' | 'RECEIVED' | 'PLANNED' | 'EN_COURS' | 'REÇUE' | 'PLANIFIÉE';
  unitCost: number;
  totalCost: number;
  receivedBy: string; // "John Doe (Warehouse Keeper)", "Grâce Kevine"
  receivedDate: string; // ISO date or formatted
  invoiceNumber?: string;
  notes?: string;
}

export interface Dispatch {
  id: string;
  dispatchNumber: string; // "DSP-2024-112"
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  quantity: number;
  unit: string;
  siteName: string; // Destination Jobsite
  siteManager: string; // Site supervisor or foreman
  dispatchedDate: string; // ISO date or formatted
  isReturnable: boolean;
  returnStatus?: 'ON_JOBSITE' | 'PARTIALLY_RETURNED' | 'FULLY_RETURNED' | 'RETOUR_COMPLET' | 'RETOUR_PARTIEL';
  returnedQuantity?: number;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  type: 'INFLOW' | 'OUTFLOW' | 'DELIVERY' | 'UPDATE' | 'CATEGORY' | 'ENTREE' | 'SORTIE' | 'LIVRAISON' | 'MISE_A_JOUR' | 'CATEGORIE';
  title: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  timeLabel: string; // "Today, 09:00", "Today, 14:00", "June 15, 2024, 08:00"
  type: 'CRITICAL_STOCK' | 'DELIVERY' | 'INVENTORY';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
}

export interface AppUser {
  id: string;
  name: string;
  role: string;
  email: string;
  site: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'equipements'
  | 'categories'
  | 'stock'
  | 'entrees'
  | 'sorties'
  | 'livraisons'
  | 'fournisseurs'
  | 'alertes'
  | 'rappels'
  | 'rapports'
  | 'historique'
  | 'parametres';


