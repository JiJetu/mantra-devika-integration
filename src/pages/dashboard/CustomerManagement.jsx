import { useState } from "react";
import { Search } from "lucide-react";
import CustomerTable from "../../components/dashboard/customerManagement/CustomerTable";
import Modal from "../../components/ui/Modal";
import CustomerProfile from "../../components/dashboard/customerManagement/CustomerProfile";
import Heading from "../../components/shared/Heading";
import Pagination from "../../components/shared/Pagination";
import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";
import {
  useGetCustomersListQuery,
  useSearchCustomersQuery,
} from "../../redux/features/dashboard/customer.api";

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm, 450);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const itemsPerPage = 10;

  const useSearch = debouncedTerm.trim().length > 0;

  const { data: listData, isFetching: isListLoading } =
    useGetCustomersListQuery(
      { page: currentPage, page_size: itemsPerPage },
      { skip: useSearch },
    );

  const { data: searchData, isFetching: isSearchLoading } =
    useSearchCustomersQuery(
      { q: debouncedTerm, page: currentPage, page_size: itemsPerPage },
      { skip: !useSearch },
    );

  const apiData = useSearch ? searchData : listData;
  const loading = useSearch ? isSearchLoading : isListLoading;

  const totalPages = apiData?.total_pages ?? 0;
  const paginatedCustomers = (apiData?.results ?? []).map((c) => ({
    id: c.id,
    name:
      c.user_name || (c.email || "").split("@")[0] || c.email || `User ${c.id}`,
    contact: c.email,
    phone: c.phone,
    totalOrders: c.total_orders ?? 0,
    totalSpent: c.total_spent ?? 0,
    joinDate: c.join_date,
    status: (c.status || "").toLowerCase(),
  }));

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
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <CustomerTable
                paginatedCustomers={paginatedCustomers}
                handleViewProfile={handleViewProfile}
              />
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            pageSize={apiData?.page_size ?? itemsPerPage}
            totalCount={apiData?.count ?? 0}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {/* View Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Profile"
        className="max-w-2xl lg:max-w-3xl"
      >
        <CustomerProfile userId={selectedCustomerId} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default CustomerManagement;
