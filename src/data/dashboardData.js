export const dashboardFakeData = {
  summary: {
    totalRevenue: 48574,
    revenueChange: 12.5,
    totalSales: 1245,
    salesChange: 8.2,
    totalCustomers: 856,
    customersChange: 15.3,
    websiteVisitors: 12458,
    visitorsChange: 23.1,
  },

  salesTrend: [
    { day: "Mon", value: 4200 },
    { day: "Tue", value: 3800 },
    { day: "Wed", value: 5200 },
    { day: "Thu", value: 4800 },
    { day: "Fri", value: 6200 },
    { day: "Sat", value: 8100 },
    { day: "Sun", value: 6800 },
  ],

  orderStatus: [
    { name: "Confirmed", value: 45 },
    { name: "Processed", value: 40 },
    { name: "Dispatched", value: 120 },
    { name: "Delivered", value: 30 },
    { name: "Order return", value: 3 },
  ],

  mostVisitedPages: [
    { rank: 1, page: "Homepage", visits: 12458 },
    { rank: 2, page: "Product Listing", visits: 8934 },
    { rank: 3, page: "Mantra Story", visits: 6723 },
    { rank: 4, page: "Cart", visits: 3456 },
    { rank: 5, page: "Checkout", visits: 1892 },
    { rank: 6, page: "Account", visits: 2341 },
    { rank: 7, page: "Rewards", visits: 2341 },
  ],

  productEngagement: [
    { product: "Classic T-Shirt", views: 2345, clicks: 802, addToCart: 234 },
    { product: "Denim Jeans", views: 1987, clicks: 756, addToCart: 189 },
    { product: "Leather Jacket", views: 1654, clicks: 623, addToCart: 156 },
    { product: "Running Shoes", views: 1432, clicks: 542, addToCart: 143 },
  ],
};