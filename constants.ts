import { User, Order } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice', country: 'USA' },
  { id: 2, name: 'Chen', country: 'Taiwan' },
  { id: 3, name: 'Eiko', country: 'Japan' },
  { id: 4, name: 'Bob', country: 'UK' },
  { id: 5, name: 'Dieter', country: 'Korea' },
];

export const ORDERS: Order[] = [
  { id: 101, fkUid: 4, product: 'Laptop', amount: 1200 },
  { id: 102, fkUid: 5, product: 'Keyboard', amount: 150 },
  { id: 103, fkUid: 2, product: 'Desk', amount: 200 },
  { id: 104, fkUid: 2, product: 'Mouse', amount: 80 },
  { id: 105, fkUid: 1, product: 'Headset', amount: 200 },
  { id: 106, fkUid: 1, product: 'Dock', amount: 80 },
  { id: 107, fkUid: 9, product: 'Unknown', amount: 999 },
];

export const STEP_DESCRIPTIONS = [
  { title: "FROM & JOIN", desc: "Load USERS (5 rows) and ORDERS (7 rows). Independent datasets in the void." },
  { title: "ON users.id = orders.fkUid", desc: "INNER JOIN. Orders snap to matching users. Alice, Bob, and Dieter remain. Chen, Eiko, and 'Unknown' order vanish." },
  { title: "WHERE country IN ('USA', 'Korea', 'UK')", desc: "Filter active. Only USA, Korea and UK. Chen's orders (Taiwan) are removed." },
  { title: "GROUP BY Country", desc: "Grouping by Country. Rows collapse into USA, UK, and Korea buckets." },
  { title: "HAVING SUM(Amount) > 200", desc: "Filtering groups. Korea ($150) is removed as the group total does not meet the threshold." },
  { title: "ORDER BY TotalAmount ASC", desc: "Re-sorting rows by TotalAmount. USA ($280) comes before UK ($1200)." },
  { title: "SELECT Country, SUM(Amount)", desc: "Projection. Focusing only on the requested columns: Country and Total Amount." },
  { title: "LIMIT 1", desc: "Final Cut. Keeping the top result (USA, $280)." }
];