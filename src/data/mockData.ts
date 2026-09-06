import { Category, Equipment, Delivery, Dispatch, Reminder, ActivityLog, Supplier } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Raw Materials',
    code: 'MAT',
    siteName: 'Horizon West Tower',
    managerName: 'Grâce Kevine (Works Supervisor)',
    description: 'Binders, aggregates, rebar steel, cinder blocks, and structural construction items.',
    color: 'blue',
    createdDate: '2024-05-01T08:00:00Z'
  },
  {
    id: 'cat-2',
    name: 'PPE & Safety',
    code: 'PPE',
    siteName: 'All Jobsites',
    managerName: 'Sarah Jenkins (HSE Safety Lead)',
    description: 'Personal protective equipment (helmets, high-vis vests, cut-resistant gloves, harnesses, goggles).',
    color: 'amber',
    createdDate: '2024-05-02T08:30:00Z'
  },
  {
    id: 'cat-3',
    name: 'Heavy Equipment',
    code: 'EQP',
    siteName: 'Grand Viaduct Bridge',
    managerName: 'Raymond Ellis (Chief Jobsite Foreman)',
    description: 'Heavy construction machinery (concrete mixers, compressors, diesel generators, light towers).',
    color: 'purple',
    createdDate: '2024-05-05T09:15:00Z'
  },
  {
    id: 'cat-4',
    name: 'Power Tools',
    code: 'TLS',
    siteName: 'Civic Metro Center',
    managerName: 'David Chen (Jobsite Engineer)',
    description: 'Professional electro-portable tools (rotary hammers, angle grinders, circular saws, laser levels).',
    color: 'emerald',
    createdDate: '2024-05-10T11:00:00Z'
  },
  {
    id: 'cat-5',
    name: 'Consumables',
    code: 'CON',
    siteName: 'All Jobsites',
    managerName: 'Grâce Kevine (Works Supervisor)',
    description: 'Diamond blades, drill bits, structural bolts, chemical anchors, and fuels.',
    color: 'rose',
    createdDate: '2024-05-12T14:20:00Z'
  },
  {
    id: 'cat-6',
    name: 'Lighting & Power',
    code: 'PWR',
    siteName: 'Horizon West Tower',
    managerName: 'Derek Nolan (Electrical Crew Lead)',
    description: 'Heavy-duty LED floodlights, industrial cable drums, and temporary power distribution panels.',
    color: 'cyan',
    createdDate: '2024-05-15T16:00:00Z'
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eqp-1',
    code: 'MAT-CEM-45',
    name: 'Portland Cement CPJ 45',
    category: 'Raw Materials',
    currentStock: 8,
    minThreshold: 20, // Alert: 8 < 20 -> Critical Stock
    unit: 'bags',
    location: 'Central Warehouse - Bay C3',
    supplier: 'LafargeHolcim Cement',
    unitCost: 14,
    lastUpdated: '09/06/2024 08:30',
    iconType: 'ciment',
    notes: 'High-strength structural cement 42.5N. Minimum safety threshold set to 20 bags by site manager.'
  },
  {
    id: 'eqp-2',
    code: 'PPE-HLM-01',
    name: 'Hard Hat Safety Helmet',
    category: 'PPE & Safety',
    currentStock: 5,
    minThreshold: 10, // Alert: 5 < 10 -> Critical Stock
    unit: 'units',
    location: 'Safety Storage - Locker A1',
    supplier: 'Delta Plus Safety',
    unitCost: 28,
    lastUpdated: '09/06/2024 08:15',
    iconType: 'casque',
    notes: 'High-impact helmet with 4-point chin strap compliant with EN397 standard.'
  },
  {
    id: 'eqp-3',
    code: 'PPE-VST-02',
    name: 'High-Visibility Safety Vest',
    category: 'PPE & Safety',
    currentStock: 12,
    minThreshold: 15, // Alert: 12 < 15 -> Low Stock
    unit: 'units',
    location: 'Safety Storage - Shelf 2',
    supplier: 'Delta Plus Safety',
    unitCost: 15,
    lastUpdated: '09/06/2024 09:00',
    iconType: 'gilet',
    notes: 'EN ISO 20471 Class 2 reflective vests with zip closure.'
  },
  {
    id: 'eqp-4',
    code: 'MAT-RBR-16',
    name: 'Steel Rebar Rods Ø16mm',
    category: 'Raw Materials',
    currentStock: 45,
    minThreshold: 40, // 45 > 40 -> Optimal
    unit: 'pieces',
    location: 'Open Yard - Section E2',
    supplier: 'ArcelorMittal Rebar',
    unitCost: 22,
    lastUpdated: '09/06/2024 10:20',
    iconType: 'barre',
    notes: 'High-adherence Fe E500 rebar bars in 12-meter lengths.'
  },
  {
    id: 'eqp-5',
    code: 'EQP-MIX-350',
    name: 'Site Concrete Mixer 350L',
    category: 'Heavy Equipment',
    currentStock: 2,
    minThreshold: 2, // 2 == 2 -> Threshold Reached Alert
    unit: 'units',
    location: 'Machine Yard - Depot B',
    supplier: 'Altrad Belle Heavy',
    unitCost: 1650,
    lastUpdated: '09/06/2024 07:45',
    iconType: 'betonniere',
    notes: 'Diesel-powered towable concrete mixer with sound-insulated canopy.'
  },
  {
    id: 'eqp-6',
    code: 'PPE-GLV-04',
    name: 'Cut-Resistant Handling Gloves',
    category: 'PPE & Safety',
    currentStock: 35,
    minThreshold: 25,
    unit: 'pairs',
    location: 'Safety Storage - Bin 4',
    supplier: 'Honeywell Industrial',
    unitCost: 8,
    lastUpdated: '09/06/2024 11:30',
    iconType: 'gants',
    notes: 'EN388 Level 4X cut-resistant nitrile palms.'
  },
  {
    id: 'eqp-7',
    code: 'TLS-GRD-230',
    name: 'Heavy Angle Grinder 230mm',
    category: 'Power Tools',
    currentStock: 4,
    minThreshold: 5, // 4 < 5 -> Low
    unit: 'units',
    location: 'Tool Room - Shelf T3',
    supplier: 'Hilti Construction',
    unitCost: 320,
    lastUpdated: '09/06/2024 14:10',
    iconType: 'outil',
    notes: '2400W concrete cutting grinder with vibration damper handle.'
  },
  {
    id: 'eqp-8',
    code: 'PWR-LGT-150',
    name: 'Jobsite LED Floodlight 150W',
    category: 'Lighting & Power',
    currentStock: 3,
    minThreshold: 6, // 3 < 6 -> Critical
    unit: 'units',
    location: 'Electrical Storage - Bay L1',
    supplier: 'Brennenstuhl Pro',
    unitCost: 110,
    lastUpdated: '09/06/2024 15:00',
    iconType: 'eclairage',
    notes: 'IP65 rugged aluminum floodlight with telescopic tripod.'
  },
  {
    id: 'eqp-9',
    code: 'PPE-HRN-02',
    name: 'Full Body Fall Arrest Harness',
    category: 'PPE & Safety',
    currentStock: 6,
    minThreshold: 8, // 6 < 8 -> Low
    unit: 'units',
    location: 'Safety Storage - Locker A3',
    supplier: 'Delta Plus Safety',
    unitCost: 95,
    lastUpdated: '09/06/2024 16:20',
    iconType: 'harnais',
    notes: '2-point fall protection harness compliant with EN361 with shock absorber lanyard.'
  },
  {
    id: 'eqp-10',
    code: 'MAT-SND-04',
    name: 'River Washing Sand 0/4',
    category: 'Raw Materials',
    currentStock: 0,
    minThreshold: 15, // 0 -> OUT OF STOCK
    unit: 'tons',
    location: 'Yard Bulk Silo 1',
    supplier: 'LafargeHolcim Aggregates',
    unitCost: 45,
    lastUpdated: '09/06/2024 17:00',
    iconType: 'default',
    notes: 'Washed silica sand for masonry and plastering mortar.'
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del-1',
    deliveryNumber: 'GRN-2024-089',
    equipmentId: 'eqp-1',
    equipmentName: 'Portland Cement CPJ 45',
    equipmentCode: 'MAT-CEM-45',
    quantity: 50,
    unit: 'bags',
    supplier: 'LafargeHolcim Cement',
    status: 'RECEIVED',
    unitCost: 14,
    totalCost: 700,
    receivedBy: 'Marc Dupont (Warehouse Keeper)',
    receivedDate: '09/06/2024 08:30',
    invoiceNumber: 'INV-LH-99201',
    notes: 'Checked and unloaded onto wooden pallets in Central Hangar Bay C3.'
  },
  {
    id: 'del-2',
    deliveryNumber: 'GRN-2024-090',
    equipmentId: 'eqp-2',
    equipmentName: 'Hard Hat Safety Helmet',
    equipmentCode: 'PPE-HLM-01',
    quantity: 20,
    unit: 'units',
    supplier: 'Delta Plus Safety',
    status: 'RECEIVED',
    unitCost: 28,
    totalCost: 560,
    receivedBy: 'Grâce Kevine (Works Supervisor)',
    receivedDate: '09/06/2024 09:15',
    invoiceNumber: 'INV-DP-4412',
    notes: 'Conformity certificates verified.'
  },
  {
    id: 'del-3',
    deliveryNumber: 'GRN-2024-091',
    equipmentId: 'eqp-4',
    equipmentName: 'Steel Rebar Rods Ø16mm',
    equipmentCode: 'MAT-RBR-16',
    quantity: 100,
    unit: 'pieces',
    supplier: 'ArcelorMittal Rebar',
    status: 'RECEIVED',
    unitCost: 22,
    totalCost: 2200,
    receivedBy: 'Marc Dupont (Warehouse Keeper)',
    receivedDate: '08/06/2024 14:00',
    invoiceNumber: 'INV-AM-0881',
    notes: 'Standard 12m lengths bundled in lots of 25.'
  },
  {
    id: 'del-4',
    deliveryNumber: 'GRN-2024-092',
    equipmentId: 'eqp-7',
    equipmentName: 'Heavy Angle Grinder 230mm',
    equipmentCode: 'TLS-GRD-230',
    quantity: 5,
    unit: 'units',
    supplier: 'Hilti Construction',
    status: 'PENDING',
    unitCost: 320,
    totalCost: 1600,
    receivedBy: 'Grâce Kevine (Works Supervisor)',
    receivedDate: '10/06/2024 (Planned)',
    invoiceNumber: 'PO-BAT-5510',
    notes: 'Carrier dispatch in transit, expected today at 14:00.'
  }
];

export const INITIAL_DISPATCHES: Dispatch[] = [
  {
    id: 'disp-1',
    dispatchNumber: 'DSP-2024-112',
    equipmentId: 'eqp-1',
    equipmentName: 'Portland Cement CPJ 45',
    equipmentCode: 'MAT-CEM-45',
    quantity: 42,
    unit: 'bags',
    siteName: 'Horizon West Tower',
    siteManager: 'Grâce Kevine',
    dispatchedDate: '09/06/2024 10:15',
    isReturnable: false,
    notes: 'Consumed for level 4 concrete slab pouring.'
  },
  {
    id: 'disp-2',
    dispatchNumber: 'DSP-2024-113',
    equipmentId: 'eqp-2',
    equipmentName: 'Hard Hat Safety Helmet',
    equipmentCode: 'PPE-HLM-01',
    quantity: 15,
    unit: 'units',
    siteName: 'Grand Viaduct Bridge',
    siteManager: 'Raymond Ellis',
    dispatchedDate: '09/06/2024 11:00',
    isReturnable: true,
    returnStatus: 'ON_JOBSITE',
    returnedQuantity: 0,
    notes: 'Issued for new subcontracting civil crew.'
  },
  {
    id: 'disp-3',
    dispatchNumber: 'DSP-2024-114',
    equipmentId: 'eqp-5',
    equipmentName: 'Site Concrete Mixer 350L',
    equipmentCode: 'EQP-MIX-350',
    quantity: 1,
    unit: 'units',
    siteName: 'Civic Metro Center',
    siteManager: 'David Chen',
    dispatchedDate: '08/06/2024 08:00',
    isReturnable: true,
    returnStatus: 'ON_JOBSITE',
    returnedQuantity: 0,
    notes: 'Dispatched with maintenance logbook.'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Urgent: Cement Reorder Below Safety Threshold',
    description: 'Stock for Portland Cement CPJ 45 is down to 8 bags (Safety threshold: 20 bags). Send PO to LafargeHolcim.',
    timeLabel: 'Today, 09:00',
    type: 'CRITICAL_STOCK',
    priority: 'high',
    completed: false
  },
  {
    id: 'rem-2',
    title: 'Receive Hilti Power Tools Delivery',
    description: 'Carrier delivery expected at Central Depot for 5 angle grinders 230mm (GRN-2024-092).',
    timeLabel: 'Today, 14:00',
    type: 'DELIVERY',
    priority: 'medium',
    completed: false
  },
  {
    id: 'rem-3',
    title: 'Bi-weekly Physical Stock Audit (Horizon Jobsite)',
    description: 'Conduct cycle count of PPE and hand power tools with site supervisor Grâce Kevine.',
    timeLabel: 'Tomorrow, 08:00',
    type: 'INVENTORY',
    priority: 'medium',
    completed: false
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'LafargeHolcim Cement',
    category: 'Raw Materials & Binders',
    contactPerson: 'Philippe Martin',
    phone: '+1 (555) 342-8901',
    email: 'orders@lafargeholcim-pro.com',
    address: '1420 Industrial Parkway, North Depot',
    rating: 4.8
  },
  {
    id: 'sup-2',
    name: 'Delta Plus Safety',
    category: 'PPE & Jobsite Protection',
    contactPerson: 'Camille Leroy',
    phone: '+1 (555) 781-4432',
    email: 'contact@deltaplus-safety.com',
    address: '88 Logistics Boulevard, Logistics Hub',
    rating: 4.9
  },
  {
    id: 'sup-3',
    name: 'Altrad Belle Heavy',
    category: 'Construction Machinery & Scaffolding',
    contactPerson: 'Robert Vaughan',
    phone: '+1 (555) 902-6611',
    email: 'fleet@altrad-equip.com',
    address: '500 Heavy Machinery Way, West Sector',
    rating: 4.7
  },
  {
    id: 'sup-4',
    name: 'Hilti Construction Systems',
    category: 'Power Tools & Fastening',
    contactPerson: 'Sarah Lin',
    phone: '+1 (555) 431-7788',
    email: 'pro-service@hilti-tools.com',
    address: '12 Technology Park, High-Tech Zone',
    rating: 5.0
  }
];
