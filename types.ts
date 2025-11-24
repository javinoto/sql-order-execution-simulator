export interface User {
  id: number;
  name: string;
  country: string;
}

export interface Order {
  id: number;
  fkUid: number;
  product: string;
  amount: number;
}

export interface GridCell {
  key: string;
  content: string | number;
  type: 'header' | 'data';
  source: 'user' | 'order' | 'group';
  colName: string;
  
  gridRow: number;
  gridCol: number;
  isVisible: boolean;
  isDimmed?: boolean;
  isGhost?: boolean; // New property for the transition effect
  colorTheme: 'cyan' | 'fuchsia' | 'neutral' | 'emerald' | 'emeraldSoft';
  
  subtitle?: string;
  customOpacity?: number;
}

export interface UnifiedRow {
  rowId: string;
  user: User | null;
  order: Order | null;
  
  isMatched: boolean;
  isSecondaryUser: boolean;
  
  isFilteredByWhere: boolean;
  isFilteredByLimit: boolean;
  
  originalUserIndex: number;
  originalOrderIndex: number;
}

export enum Step {
  FROM_JOIN = 0,
  ON = 1,
  WHERE = 2,
  GROUP_BY = 3,
  HAVING = 4,
  ORDER_BY = 5,
  SELECT = 6,
  LIMIT = 7
}