import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, change, icon: Icon, iconColor = "text-primary", iconBg = "bg-primary/10", changeColor = "text-red-500" }) {

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow lora border-2 border-[#F9EFD580]">
      <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6">
        <div className={`${iconBg} p-2 md:p-3 rounded-lg`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColor}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm md:text-base ${changeColor}`}>
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5 rotate-0" />
          +{change}%
        </div>
      </div>
      <p className="text-sm md:text-base text-gray-600 mb-1 md:mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}