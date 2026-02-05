import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import CustomerTable from "../../components/dashboard/customerManagement/CustomerTable";
import Modal from "../../components/ui/Modal";
import CustomerProfile from "../../components/dashboard/customerManagement/CustomerProfile";
import fakeCustomers from "../../data/customerManagementData";
import Heading from "../../components/shared/Heading";

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const itemsPerPage = 10;

  // Filter customers
  const filteredCustomers = fakeCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewProfile = (id) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 lora">
        <Heading
          title="Customer Management"
          subtitle="Manage your customer base"
        />
        {/* Search */}
        <div className="relative w-full p-5 bg-white rounded-xl shadow-sm border border-[#F9EFD580]">
          <Search className="absolute left-[35px] top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or customer ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
          />
        </div>

        {/* Table Container - FIXED FOR RESPONSIVE */}
        <div className="w-full overflow-hidden rounded-xl shadow-sm border-2 border-[#F9EFD580] bg-white">
          {/* Mobile hint */}
          <div className="hidden lg:block xl:hidden p-3 bg-gray-50 text-sm text-gray-500 text-center border-b">
            ← Scroll horizontally to view all columns →
          </div>
          <div className="block lg:hidden p-3 bg-gray-50 text-sm text-gray-500 text-center border-b">
            🔻 click to view all columns 🔻
          </div>

          {/* Scrollable table container */}
          <div className="w-full overflow-x-auto">
            <CustomerTable
              paginatedCustomers={paginatedCustomers}
              handleViewProfile={handleViewProfile}
            />
          </div>

          {/* Pagination + Showing text */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm text-gray-600 border-t">
            <div>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} users
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`
                  px-3 py-1.5 rounded-md border border-gray-300 font-medium
                  ${
                    currentPage === page
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-gray-50"
                  }
                `}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Profile"
        className="max-w-2xl lg:max-w-3xl"
      >
        <CustomerProfile />
      </Modal>
    </>
  );
};

export default CustomerManagement;
