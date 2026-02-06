import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAdminUserQuery } from "../../redux/features/dashboard/dashboard.api";

const DashboardHeader = ({ title, description }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const { data: admin } = useGetAdminUserQuery();

  const fullName =
    [admin?.first_name, admin?.last_name].filter(Boolean).join(" ") ||
    "Admin User";
  const email = admin?.email || "admin@maantra.com";
  const shortName = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const hasContent = title || description;

  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-6 lg:px-8 bg-[#fbf9f7] border-b border-gray-200 lora">
      {/* Left Side: Title/Description or Welcome fallback */}
      <div className="flex flex-col">
        {hasContent ? (
          <>
            {title && (
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm md:text-base lg:text-lg text-gray-600">
                {description}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
              Welcome,{" "}
              <span className="lg:text-xl text-[#1E2939] font-normal">
                Admin Dashboard
              </span>
            </h1>
          </>
        )}
      </div>

      {/* Right Side: Admin Info with hover tooltip */}
      <div className="relative flex items-center gap-4 md:gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard/profile")}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="text-right">
            <p className="text-sm md:text-base lg:text-lg font-medium text-gray-900">
              {fullName}
            </p>
            <p className="text-xs md:text-sm lg:text-base text-gray-600">
              {email}
            </p>
          </div>

          <div className="relative">
            <div className="flex h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-sm md:text-base lg:text-xl shadow-sm group-hover:shadow-md transition-shadow">
              {shortName}
            </div>

            {/* Hover Tooltip */}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-lg p-3 border border-gray-200 whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">Profile</p>
                <p className="text-xs text-gray-600">{fullName}</p>
                <p className="text-xs text-gray-600">{email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
