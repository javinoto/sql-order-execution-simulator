
import { User, Order } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice', country: 'USA' },
  { id: 2, name: 'Chen', country: 'Taiwan' },
  { id: 3, name: 'Eiko', country: 'Japan' },
  { id: 4, name: 'Bob', country: 'UK' },
  { id: 5, name: 'Dieter', country: 'Korea' },
];

// New scrambled dataset with 1-to-many relationships and mismatches
export const ORDERS: Order[] = [
  { id: 101, fkUid: 4, product: 'Laptop', amount: 1200 },
  { id: 102, fkUid: 5, product: 'Keyboard', amount: 150 },
  { id: 103, fkUid: 2, product: 'Desk', amount: 200 },
  { id: 104, fkUid: 2, product: 'Mouse', amount: 80 },
  { id: 105, fkUid: 1, product: 'Headset', amount: 200 },
  { id: 106, fkUid: 1, product: 'Dock', amount: 80 },
  { id: 107, fkUid: 9, product: 'Unknown', amount: 999 }, // No matching user
];

export const STEP_DESCRIPTIONS = [
  { title: "FROM & JOIN", desc: "Load USERS (5 rows) and ORDERS (7 rows). Independent datasets in the void." },
  { title: "ON users.id = orders.fkUid", desc: "INNER JOIN. Orders snap to matches. Alice, Bob, and Dieter have multiple orders. Chen, Eiko, and 'Unknown' vanish." },
  { title: "WHERE country IN ('USA', 'Korea', 'UK')", desc: "Filter active. Only USA, Korea and UK. All matches satisfy this condition." },
  { title: "GROUP BY country", desc: "Grouping by Country. USA and UK clusters form." },
  { title: "ORDER BY amount ASC", desc: "Re-sorting rows by Order Amount. Mouse and Dock ($80) rise to the top." },
  { title: "SELECT name, product, amount", desc: "Projection. Focusing on the requested columns." },
  { title: "LIMIT 2", desc: "Final Cut. Keeping only the top 2 cheapest orders." }
];
