
export interface User {
  id: number;
  name: string;
  country: string;
}

export interface Order {
  id: number;
  fkUid: number; // Renamed from uid to match new spec
  product: string;
  amount: number;
}

export interface GridCell {
  key: string; // Unique ID for Framer Motion layoutId
  content: string | number;
  type: 'header' | 'data';
  source: 'user' | 'order' | 'group'; // Added 'group' source
  colName: string; // To identify column type for logic
  
  // Visual Properties calculated per step
  gridRow: number;
  gridCol: number;
  isVisible: boolean;
  isDimmed?: boolean; // For LIMIT step
  colorTheme: 'cyan' | 'fuchsia' | 'neutral' | 'emerald'; // Added emerald
  
  // New properties for Group By visualization
  subtitle?: string;
  customOpacity?: number;
}

// Represents a joined row of data before it's broken into cells
export interface UnifiedRow {
  rowId: string; // unique composite ID
  user: User | null;
  order: Order | null;
  
  // Meta flags for visualization
  isMatched: boolean; // True if Inner Join succeeds
  isSecondaryUser: boolean; // True if this is a duplicate user row (for 1-to-many joins)
  
  // Filtering flags
  isFilteredByWhere: boolean; // True if removed by WHERE
  isFilteredByLimit: boolean; // True if removed by LIMIT
  
  // Layout helpers
  originalUserIndex: number; // For Step 0 positioning
  originalOrderIndex: number; // For Step 0 positioning
}

export enum Step {
  FROM_JOIN = 0,
  ON = 1,
  WHERE = 2,
  GROUP_BY = 3,
  ORDER_BY = 4,
  SELECT = 5,
  LIMIT = 6
}
