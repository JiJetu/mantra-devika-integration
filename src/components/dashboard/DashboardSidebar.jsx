import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { IMAGES } from "../../assets";
import { LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { BsEye } from "react-icons/bs";
import { Megaphone, Package, StickyNote } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { GiPreviousButton } from "react-icons/gi";

const DashboardSidebar = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard", icon: LuLayoutDashboard, label: "Dashboard Overview" },
    { to: "/dashboard/customers", icon: LuUsers, label: "Customer Management" },
    { to: "/dashboard/products", icon: Package, label: "Products Management" },
    {
      to: "/dashboard/categories",
      icon: StickyNote,
      label: "Categories Management",
    },
    {
      to: "/dashboard/orders",
      icon: FiShoppingCart,
      label: "Orders Management",
    },
    { to: "/dashboard/payment", icon: MdPayment, label: "Payment Management" },
    {
      to: "/dashboard/promotions",
      icon: Megaphone,
      label: "Promotions & Discounts",
    },
    {
      to: "/dashboard/product-popularity",
      icon: BsEye,
      label: "Product Popularity",
    },
    { to: "/dashboard/settings", icon: IoSettingsOutline, label: "Settings" },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`
    bg-primary text-white min-h-screen flex flex-col
    ${collapsed ? "items-center px-0 py-8" : "py-6 px-4 md:px-5 lg:px-6"}
  `}
    >
      {/* Logo – smaller when collapsed */}
      <div className="mb-10 lg:mb-2 2xl:mb-10">
        <img
          src={IMAGES.logo}
          className={
            collapsed
              ? "w-14 h-14 mx-auto"
              : "w-32 lg:w-40 h-20 lg:h-28 mx-auto"
          }
          alt="Maanttra"
        />
      </div>

      <nav className="flex-1 space-y-1 w-full">
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="block w-full">
            <div
              className={`
            flex items-center rounded-xl transition-colors
            ${
              collapsed
                ? "justify-center py-4 px-3"
                : "gap-3 lg:gap-4 px-4 lg:px-5 py-3 lg:py-3.5"
            }
            ${
              isActive(item.to)
                ? "bg-[#F9EFD5] text-primary shadow-sm"
                : "hover:bg-white/10"
            }
          `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={collapsed ? "w-7 h-7" : "w-5 h-5 lg:w-6 lg:h-6"}
              />
              {!collapsed && (
                <span className="text-base lg:text-lg truncate">
                  {item.label}
                </span>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Logout – same pattern */}
      <div className="mt-auto 2xl:pt-6">
        <div className="border-t border-white/20 mb-4" />

        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-2 px-4 lg:px-5 py-3 lg:py-3.5 rounded-xl 
            hover:bg-white/10 transition-all text-left
          `}
        >
          <div className="p-2">
            <IoIosLogOut className="w-6 h-6 lg:w-7 lg:h-7" />
          </div>
          {!collapsed && (
            <span className="text-base lg:text-lg font-medium">Log Out</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
