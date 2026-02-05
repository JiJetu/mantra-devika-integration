// Fake data (replace with real API later)
const fakeCustomers = [
  {
    id: 1,
    name: "John Doe",
    contact: "john@example.com",
    phone: "+1234 567 8900",
    totalOrders: 12,
    totalSpent: 249.88,
    joinDate: "2023-06-15",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    contact: "jane@example.com",
    phone: "+1234 567 8901",
    totalOrders: 8,
    totalSpent: 856.42,
    joinDate: "2023-08-22",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    contact: "mike@example.com",
    phone: "+1234 567 8902",
    totalOrders: 15,
    totalSpent: 2134.50,
    joinDate: "2023-03-10",
    status: "banned",
  },
  // ... add more entries (10+ for pagination demo)
  // duplicate some for demo
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    name: "Mike Johnson",
    contact: "mike@example.com",
    phone: "+1234 567 8902",
    totalOrders: 15,
    totalSpent: 2134.50,
    joinDate: "2023-03-10",
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "suspended" : "guest",
  })),
];

export default fakeCustomers;