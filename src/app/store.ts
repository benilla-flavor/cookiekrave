// ── Shared in-memory store (React state lifted to module level via callbacks) ──
// Each page manages its own state; this file just exports shared types + initial data.

export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
export type StockLevel  = "Critical" | "Low" | "OK" | "Full";
export type Tier        = "Gold" | "Silver" | "Bronze";
export type Category    = "Classic" | "Specialty";
export type InvCategory = "Ingredients" | "Packaging" | "Supplies";

export interface Order {
  id: string;
  customer: string;
  avatar: string;
  items: string;
  total: string;
  status: OrderStatus;
  time: string;
}

export interface Product {
  id: number;
  emoji: string;
  name: string;
  category: Category;
  price: string;
  perDozen: string | null;
  rating: number;
  sold: number;
  available: boolean;
  badge: string | null;
}

export interface InventoryItem {
  id: number;
  emoji: string;
  name: string;
  qty: number;
  unit: string;
  max: number;
  reorder: number;
  category: InvCategory;
}

export interface Customer {
  id: number;
  name: string;
  avatar: string;
  email: string;
  orders: number;
  spent: string;
  tier: Tier;
  lastOrder: string;
  fav: string;
}

export const INITIAL_ORDERS: Order[] = [
  { id: "#3421", customer: "Emma Wilson",   avatar: "EW", items: "Choc Chunk ×12, Snickerdoodle ×6", total: "$54.00",  status: "Ready",     time: "2 min ago"  },
  { id: "#3420", customer: "James Carter",  avatar: "JC", items: "Oatmeal Raisin ×24",               total: "$72.00",  status: "Preparing", time: "14 min ago" },
  { id: "#3419", customer: "Sofia Reyes",   avatar: "SR", items: "Macaron Box ×2, Brownie ×8",       total: "$48.50",  status: "Pending",   time: "22 min ago" },
  { id: "#3418", customer: "Liam Nguyen",   avatar: "LN", items: "Sugar Cookie ×36",                 total: "$90.00",  status: "Delivered", time: "1 hr ago"   },
  { id: "#3417", customer: "Ava Thompson",  avatar: "AT", items: "Choc Chunk ×6, Peanut Butter ×6",  total: "$36.00",  status: "Delivered", time: "2 hr ago"   },
  { id: "#3416", customer: "Noah Kim",      avatar: "NK", items: "Custom Cake Cookies ×48",          total: "$144.00", status: "Cancelled", time: "3 hr ago"   },
  { id: "#3415", customer: "Isabella Park", avatar: "IP", items: "Snickerdoodle ×12, Brownie ×4",    total: "$42.00",  status: "Delivered", time: "4 hr ago"   },
  { id: "#3414", customer: "Ethan Brooks",  avatar: "EB", items: "Oatmeal Raisin ×12",               total: "$36.00",  status: "Delivered", time: "5 hr ago"   },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, emoji: "🍫", name: "Chocolate Chunk",      category: "Classic",   price: "$3.00",  perDozen: "$32.00", rating: 4.9, sold: 1240, available: true,  badge: "Best Seller" },
  { id: 2, emoji: "🥜", name: "Peanut Butter",        category: "Classic",   price: "$3.00",  perDozen: "$32.00", rating: 4.7, sold: 890,  available: true,  badge: null },
  { id: 3, emoji: "🌾", name: "Oatmeal Raisin",       category: "Classic",   price: "$2.75",  perDozen: "$29.00", rating: 4.5, sold: 670,  available: true,  badge: null },
  { id: 4, emoji: "🍬", name: "Snickerdoodle",        category: "Classic",   price: "$2.75",  perDozen: "$29.00", rating: 4.8, sold: 980,  available: true,  badge: "Popular" },
  { id: 5, emoji: "🍰", name: "Macaron Box (6)",      category: "Specialty", price: "$14.00", perDozen: null,     rating: 4.9, sold: 340,  available: true,  badge: "New" },
  { id: 6, emoji: "🍫", name: "Double Fudge Brownie", category: "Specialty", price: "$4.50",  perDozen: "$48.00", rating: 4.8, sold: 520,  available: true,  badge: null },
  { id: 7, emoji: "🎂", name: "Custom Cake Cookie",   category: "Specialty", price: "$6.00",  perDozen: "$65.00", rating: 5.0, sold: 210,  available: false, badge: "Limited" },
  { id: 8, emoji: "🍪", name: "Sugar Cookie",         category: "Classic",   price: "$2.50",  perDozen: "$26.00", rating: 4.6, sold: 760,  available: true,  badge: null },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1,  emoji: "🍫", name: "Chocolate Chips",      qty: 8,   unit: "lbs",   max: 50,  reorder: 15, category: "Ingredients" },
  { id: 2,  emoji: "🥣", name: "Specialty Dough Mix",  qty: 22,  unit: "bags",  max: 80,  reorder: 25, category: "Ingredients" },
  { id: 3,  emoji: "🧈", name: "Butter",               qty: 18,  unit: "lbs",   max: 40,  reorder: 12, category: "Ingredients" },
  { id: 4,  emoji: "🥚", name: "Eggs",                 qty: 6,   unit: "doz",   max: 20,  reorder: 8,  category: "Ingredients" },
  { id: 5,  emoji: "🌾", name: "All-Purpose Flour",    qty: 35,  unit: "lbs",   max: 60,  reorder: 20, category: "Ingredients" },
  { id: 6,  emoji: "🍬", name: "Vanilla Extract",      qty: 4,   unit: "btl",   max: 10,  reorder: 3,  category: "Ingredients" },
  { id: 7,  emoji: "📦", name: "Cookie Boxes (Small)", qty: 120, unit: "pcs",   max: 200, reorder: 60, category: "Packaging"   },
  { id: 8,  emoji: "📦", name: "Cookie Boxes (Large)", qty: 200, unit: "pcs",   max: 200, reorder: 60, category: "Packaging"   },
  { id: 9,  emoji: "🎀", name: "Ribbon & Twine",       qty: 45,  unit: "rolls", max: 50,  reorder: 15, category: "Packaging"   },
  { id: 10, emoji: "🍪", name: "Parchment Paper",      qty: 12,  unit: "rolls", max: 30,  reorder: 10, category: "Supplies"    },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: "Emma Wilson",   avatar: "EW", email: "emma@email.com",   orders: 34, spent: "$892.00",   tier: "Gold",   lastOrder: "Today",       fav: "Chocolate Chunk" },
  { id: 2, name: "James Carter",  avatar: "JC", email: "james@email.com",  orders: 28, spent: "$740.00",   tier: "Gold",   lastOrder: "Yesterday",   fav: "Oatmeal Raisin" },
  { id: 3, name: "Sofia Reyes",   avatar: "SR", email: "sofia@email.com",  orders: 19, spent: "$510.00",   tier: "Silver", lastOrder: "Today",       fav: "Macaron Box" },
  { id: 4, name: "Liam Nguyen",   avatar: "LN", email: "liam@email.com",   orders: 12, spent: "$320.00",   tier: "Silver", lastOrder: "3 days ago",  fav: "Sugar Cookie" },
  { id: 5, name: "Ava Thompson",  avatar: "AT", email: "ava@email.com",    orders: 8,  spent: "$198.00",   tier: "Bronze", lastOrder: "1 week ago",  fav: "Peanut Butter" },
  { id: 6, name: "Noah Kim",      avatar: "NK", email: "noah@email.com",   orders: 5,  spent: "$130.00",   tier: "Bronze", lastOrder: "2 weeks ago", fav: "Snickerdoodle" },
  { id: 7, name: "Isabella Park", avatar: "IP", email: "bella@email.com",  orders: 41, spent: "$1,120.00", tier: "Gold",   lastOrder: "Today",       fav: "Double Fudge Brownie" },
  { id: 8, name: "Ethan Brooks",  avatar: "EB", email: "ethan@email.com",  orders: 22, spent: "$580.00",   tier: "Silver", lastOrder: "Yesterday",   fav: "Chocolate Chunk" },
];
