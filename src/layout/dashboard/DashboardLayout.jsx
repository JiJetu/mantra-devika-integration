import { Outlet } from "react-router-dom";
import { useState } from "react";
import { LuPanelRightClose, LuPanelLeftClose } from "react-icons/lu";
import { MdOutlineMenu } from "react-icons/md";
import { HeaderContext } from "../../contexts/HeaderContext";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <HeaderContext.Provider value={{ setTitle, setDescription }}>
      <div className="relative flex h-screen overflow-hidden bg-white">

        {/* Mobile hamburger */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-2xl text-primary"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MdOutlineMenu />
            </button>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          className={`
            transition-all duration-300 h-full fixed top-0 left-0 z-40 bg-primary
            ${collapsed
              ? "w-16 lg:w-20 xl:w-20 2xl:w-24" 
              : "lg:w-[33%] xl:w-[23%] 2xl:w-[18%]"
            }
            hidden lg:block
          `}
        >
          {/* Collapse toggle button – adjusted position */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              absolute z-50 text-white bg-primary/90 p-1.5 rounded-full shadow-md
              ${collapsed ? "top-14 -right-3.5" : "top-14 -right-3.5"}
            `}
          >
            {collapsed ? <LuPanelRightClose size={18} /> : <LuPanelLeftClose size={18} />}
          </button>

          <DashboardSidebar collapsed={collapsed} />
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="bg-primary w-72 sm:w-80 h-full overflow-y-auto">
              <button
                className="absolute top-5 left-[240px] md:left-[270px] text-3xl text-white z-50"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
              <DashboardSidebar collapsed={false} />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <div
          className={`
            flex-1 flex flex-col transition-all duration-300 w-screen md:w-[70vh] 
            ${collapsed
              ? "lg:ml-16 xl:ml-20 2xl:ml-24" 
              : "lg:ml-[33%] xl:ml-[23%] 2xl:ml-[18%]"
            }
            pt-14 lg:pt-0
          `}
        >
          <DashboardHeader title={title} description={description} />
          <main className="flex-1 overflow-y-auto bg-[#fbf9f7] p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderContext.Provider>
  );
};

export default DashboardLayout;