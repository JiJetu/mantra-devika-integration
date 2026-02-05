import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CustomSelect from "../../ui/CustomSelect";

const DashboardChart = ({ salesTrend, orderStatus, COLORS }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lora">
      {/* Sales Trend */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#F9EFD580] p-5 md:p-6 lg:p-7 lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
          <h3 className="text-xl font-semibold text-gray-900">Sales Trend</h3>

          {/* Fixed with CustomSelect */}
          <CustomSelect
            options={["Last 7 Days", "Last 30 Days", "This Month", "This Year"]}
            placeholder="Last 7 Days"
            className="w-full sm:w-44"
          />
        </div>

        <div className="h-[320px] md:h-[380px] lg:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 13 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 13 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "10px 14px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5B0D0D"
                strokeWidth={3.5}
                dot={{
                  r: 5,
                  stroke: "#5B0D0D",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                activeDot={{
                  r: 7,
                  stroke: "#5B0D0D",
                  strokeWidth: 3,
                  fill: "#5B0D0D",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#F9EFD580] p-5 md:p-6 lg:p-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-7 gap-3">
          <h3 className="text-xl font-semibold text-gray-900">Orders by Status</h3>


          <CustomSelect
            options={["Last 7 Days", "Last 30 Days", "This Month", "This Year"]}
            placeholder="Last 7 Days"
            className="w-full sm:w-44"
          />
        </div>

        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Donut Chart */}
          <div className="w-full h-[250px] md:h-[340px] lg:h-[300px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={1}
                  dataKey="value"
                  labelLine={false}
                  isAnimationActive={false}
                >
                  {orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} orders`]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="w-full space-y-2 text-sm lg:text-base">
            {orderStatus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;