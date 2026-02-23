import { useState } from "react";
import { DollarSign, Users, Eye, ShoppingBag } from "lucide-react";
import StatCard from "../../components/dashboard/home/StatCard";
import DashboardChart from "../../components/dashboard/home/DashboardChart";
import Heading from "../../components/shared/Heading";
import CustomSelect from "../../components/ui/CustomSelect";
import {
  useGetDashboardStatsQuery,
  useGetSalesTrendsQuery,
  useGetOrderStatusQuery,
  useGetMostVisitedPagesQuery,
  useGetProductEngagementInsightsQuery,
} from "../../redux/features/dashboard/dashboard.api";

const COLORS = [
  "#3B82F6", // blue - Confirmed
  "#F59E0B", // amber - Processed
  "#991B1B", // dark red/maroon - Dispatched
  "#10B981", // green - Delivered
  "#D9D9D9", // gray - others/returned
];

const Dashboard = () => {
  const RANGE_OPTIONS = ["Last 7 Days", "Last 30 Days", "This Month", "This Year"];
  const [salesRange, setSalesRange] = useState("Last 7 Days");
  const [pagesRange, setPagesRange] = useState("Last 7 Days");
  const [orderRange, setOrderRange] = useState("Last 7 Days");
  const [engagementRange, setEngagementRange] = useState("Last 7 Days");
  const { data: stats } = useGetDashboardStatsQuery();
  const { data: trends } = useGetSalesTrendsQuery();
  const { data: orderStatusRaw } = useGetOrderStatusQuery();
  const { data: mostVisitedRaw } = useGetMostVisitedPagesQuery();
  const { data: engagementRaw } = useGetProductEngagementInsightsQuery();

  const pickList = (raw) => {
    if (Array.isArray(raw)) return raw;
    const keys = [
      "last_7_days",
      "last_30_days",
      "this_month",
      "this_year",
      "results",
      "items",
      "data",
      "list",
    ];
    for (const k of keys) {
      if (Array.isArray(raw?.[k])) return raw[k];
    }
    const first = Object.keys(raw || {}).find((k) => Array.isArray(raw[k]));
    return first ? raw[first] : [];
  };

  const summary = {
    totalRevenue: stats?.total_revinue ?? 0,
    revenueChange: 0,
    totalSales: stats?.total_sells ?? 0,
    salesChange: 0,
    totalCustomers: stats?.total_customers ?? 0,
    customersChange: 0,
    websiteVisitors: stats?.website_visits ?? 0,
    visitorsChange: 0,
  };

  const salesRangeKey =
    salesRange === "Last 7 Days"
      ? "last_7_days"
      : salesRange === "Last 30 Days"
      ? "last_30_days"
      : salesRange === "This Month"
      ? "this_month"
      : "this_year";
  const salesList = Array.isArray(trends?.[salesRangeKey]) ? trends[salesRangeKey] : [];
  const salesTrend = salesList.map((d) => ({
    day: d?.date ?? d?.month ?? "",
    value: d?.total_sales ?? 0,
  }));

  const orderRangeKey =
    orderRange === "Last 7 Days"
      ? "last_7_days"
      : orderRange === "Last 30 Days"
      ? "last_30_days"
      : orderRange === "This Month"
      ? "this_month"
      : "this_year";
  const orderStatusList = Array.isArray(orderStatusRaw?.[orderRangeKey]?.breakdown)
    ? orderStatusRaw[orderRangeKey].breakdown
    : [];
  const orderStatus = orderStatusList.map((b) => ({
    name: b?.status ?? "",
    value: b?.count ?? 0,
  }));

  const pagesRangeKey =
    pagesRange === "Last 7 Days"
      ? "last_7_days"
      : pagesRange === "Last 30 Days"
      ? "last_30_days"
      : pagesRange === "This Month"
      ? "this_month"
      : "this_year";
  const pagesList = Array.isArray(mostVisitedRaw?.[pagesRangeKey]) ? mostVisitedRaw[pagesRangeKey] : [];
  const mostVisitedPages = pagesList.map((item) => ({
    rank: item?.rank ?? 0,
    page: item?.page ?? item?.path ?? "Unknown",
    visits: item?.visit_count ?? item?.visits ?? item?.count ?? 0,
  }));

  const engagementRangeKey =
    engagementRange === "Last 7 Days"
      ? "last_7_days"
      : engagementRange === "Last 30 Days"
      ? "last_30_days"
      : engagementRange === "This Month"
      ? "this_month"
      : "this_year";
  const engagementList = Array.isArray(engagementRaw?.[engagementRangeKey])
    ? engagementRaw[engagementRangeKey]
    : [];
  const productEngagement = engagementList.map((item) => ({
    product: item?.product_name ?? item?.product ?? item?.name ?? "Unknown",
    views: item?.views ?? 0,
    clicks: item?.clicks ?? 0,
    addToCart: item?.add_to_cart ?? item?.addToCart ?? 0,
  }));

  const maxVisits = Math.max(
    1,
    ...mostVisitedPages.map((p) => p.visits ?? 0)
  );

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10 p-4 md:p-6 lg:p-8 bg-[#fbf9f7] min-h-screen lora">
      <Heading
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store today."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          change={summary.revenueChange}
          icon={DollarSign}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Total Sales"
          value={summary.totalSales.toLocaleString()}
          change={summary.salesChange}
          icon={ShoppingBag}
          iconColor="text-red-500"
          iconBg="bg-red-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Total Customers"
          value={summary.totalCustomers.toLocaleString()}
          change={summary.customersChange}
          icon={Users}
          iconColor="text-purple-500"
          iconBg="bg-purple-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Website Visitors"
          value={summary.websiteVisitors.toLocaleString()}
          change={summary.visitorsChange}
          icon={Eye}
          iconColor="text-orange-500"
          iconBg="bg-orange-100"
          changeColor="text-red-500"
        />
      </div>

      {/* Charts */}
      <DashboardChart
        COLORS={COLORS}
        salesTrend={salesTrend}
        orderStatus={orderStatus}
        salesRange={salesRange}
        rangeOptions={RANGE_OPTIONS}
        onChangeSalesRange={(e) => setSalesRange(e.target.value)}
        orderRange={orderRange}
        onChangeOrderRange={(e) => setOrderRange(e.target.value)}
      />

      {/* Bottom section - Most Visited + Product Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Most Visited Pages */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 lg:p-7 border-2 border-[#F9EFD580]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Most Visited Pages
            </h3>

            <CustomSelect
              options={RANGE_OPTIONS}
              placeholder="Last 7 Days"
              className="w-full sm:w-44"
              value={pagesRange}
              onChange={(e) => setPagesRange(e.target.value)}
            />
          </div>

          <div className="space-y-4 md:space-y-5">
            {mostVisitedPages.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 md:gap-4">
                <span className="bg-[#FFF8E6] text-right text-primary text-sm md:text-lg px-3 py-1 rounded-lg">
                  {item.rank}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm md:text-base mb-1.5">
                    <span className="font-medium">{item.page}</span>
                    <span className="font-semibold">
                      {item.visits.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#F9EFD5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(item.visits / maxVisits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Engagement Table */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 lg:p-7 overflow-x-auto border-2 border-[#F9EFD580]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Product Engagement Insights
            </h3>

            {/* ← Fixed with CustomSelect */}
            <CustomSelect
              options={RANGE_OPTIONS}
              placeholder="Last 7 Days"
              className="w-full sm:w-44"
              value={engagementRange}
              onChange={(e) => setEngagementRange(e.target.value)}
            />
          </div>

          <div className="min-w-[600px]">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="pb-3 text-left font-medium">Product</th>
                  <th className="pb-3 text-center font-medium">Views</th>
                  <th className="pb-3 text-center font-medium">Clicks</th>
                  <th className="pb-3 text-center font-medium">Add to Cart</th>
                </tr>
              </thead>
              <tbody>
                {productEngagement.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-3 md:py-4">{item.product}</td>
                    <td className="py-3 md:py-4 text-center">
                      {item.views.toLocaleString()}
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      {item.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      <span className="bg-secondary p-1 text-primary">
                        {item.addToCart.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
