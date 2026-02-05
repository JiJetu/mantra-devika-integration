import { DollarSign, Users, Eye, ShoppingBag } from "lucide-react";
import { dashboardFakeData } from "../../data/dashboardData";
import StatCard from "../../components/dashboard/home/StatCard";
import DashboardChart from "../../components/dashboard/home/DashboardChart";
import Heading from "../../components/shared/Heading";
import CustomSelect from "../../components/ui/CustomSelect";

const COLORS = [
  "#3B82F6", // blue - Confirmed
  "#F59E0B", // amber - Processed
  "#991B1B", // dark red/maroon - Dispatched
  "#10B981", // green - Delivered
  "#D9D9D9", // gray - others/returned
];

const Dashboard = () => {
  const data = dashboardFakeData;

  // For progress bars
  const maxVisits = Math.max(...data.mostVisitedPages.map((p) => p.visits));

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
          value={`$${data.summary.totalRevenue.toLocaleString()}`}
          change={data.summary.revenueChange}
          icon={DollarSign}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Total Sales"
          value={data.summary.totalSales.toLocaleString()}
          change={data.summary.salesChange}
          icon={ShoppingBag}
          iconColor="text-red-500"
          iconBg="bg-red-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Total Customers"
          value={data.summary.totalCustomers.toLocaleString()}
          change={data.summary.customersChange}
          icon={Users}
          iconColor="text-purple-500"
          iconBg="bg-purple-100"
          changeColor="text-red-500"
        />

        <StatCard
          title="Website Visitors"
          value={data.summary.websiteVisitors.toLocaleString()}
          change={data.summary.visitorsChange}
          icon={Eye}
          iconColor="text-orange-500"
          iconBg="bg-orange-100"
          changeColor="text-red-500"
        />
      </div>

      {/* Charts */}
      <DashboardChart COLORS={COLORS} salesTrend={data.salesTrend} orderStatus={data.orderStatus} />

      {/* Bottom section - Most Visited + Product Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Most Visited Pages */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 lg:p-7 border-2 border-[#F9EFD580]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Most Visited Pages
            </h3>

            <CustomSelect
              options={["Last 7 Days", "Last 30 Days", "This Month", "This Year"]}
              placeholder="Last 7 Days"
              className="w-full sm:w-44"
            />
          </div>

          <div className="space-y-4 md:space-y-5">
            {data.mostVisitedPages.map((item) => (
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
              options={["Last 7 Days", "Last 30 Days", "This Month", "This Year"]}
              placeholder="Last 7 Days"
              className="w-full sm:w-44"
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
                {data.productEngagement.map((item, idx) => (
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