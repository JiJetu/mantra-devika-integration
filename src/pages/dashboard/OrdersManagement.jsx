import { useState } from "react";
import {
  Search,
  Eye,
  CircleCheckBig,
  Package,
  Split,
  ShieldHalf,
} from "lucide-react";
import Heading from "../../components/shared/Heading";
import Modal from "../../components/ui/Modal";
import OrderDetailsModalContent from "../../components/dashboard/ordersManagement/OrderDetailsModalContent";
import RefundOrderDetailsModalContent from "../../components/dashboard/ordersManagement/RefundOrderDetailsModalContent";
import CustomSelect from "../../components/ui/CustomSelect";
import Pagination from "../../components/shared/Pagination";
import { useListOrdersQuery, useSearchOrdersQuery, useFilterOrdersQuery } from "../../redux/features/dashboard/order";
import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d || "");
  }
};

const getStatusStyle = (status) => {
  const s = String(status || "").toUpperCase();
  switch (s) {
    case "PROCESSING":
      return ["bg-orange-100 text-orange-700", ShieldHalf];
    case "SHIPPED":
      return ["bg-indigo-100 text-indigo-700", Split];
    case "DELIVERED":
      return ["bg-green-100 text-green-700", Package];
    case "PAID":
      return ["bg-blue-100 text-blue-700", CircleCheckBig];
    case "PENDING":
      return ["bg-yellow-100 text-yellow-700", CircleCheckBig];
    case "CANCELLED":
      return ["bg-red-100 text-red-700", null];
    default:
      return ["bg-gray-100 text-gray-700", null];
  }
};

const OrdersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm, 450);
  const [modalType, setModalType] = useState(null); // 'details' | 'refund'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const itemsPerPage = 10;
  const searchEnabled = !!debouncedTerm;
  const filterEnabled = !searchEnabled && !!status;
  const { data: listData, isFetching: isFetchingList } = useListOrdersQuery(
    { page: currentPage, page_size: itemsPerPage },
    { skip: searchEnabled }
  );
  const { data: searchData, isFetching: isFetchingSearch } = useSearchOrdersQuery(
    { page: currentPage, page_size: itemsPerPage, q: debouncedTerm },
    { skip: !searchEnabled }
  );
  const { data: filterData, isFetching: isFetchingFilter } = useFilterOrdersQuery(
    { page: currentPage, page_size: itemsPerPage, status },
    { skip: !filterEnabled }
  );
  const data = searchEnabled ? searchData : filterEnabled ? filterData : listData;
  const isFetching = searchEnabled
    ? isFetchingSearch
    : filterEnabled
    ? isFetchingFilter
    : isFetchingList;
  const totalPages = data?.total_pages ?? 0;
  const orders = (data?.results ?? []).map((o) => ({
    id: o.order_id,
    customer: o.customer_name,
    email: o.customer_email,
    date: o.date,
    total: o.grand_total ?? o.total_amount,
    type: o.customer_user_type,
    agent: o.order_country ?? "",
    status: o.order_status,
    items: (o.order_items ?? []).map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      size: i.size,
      price: i.subtotal,
    })),
    refundRequested: Boolean(o.is_applyed_for_refund),
    refundId: o.refund_id ?? o.refund_request_id ?? o.refund?.id ?? null,
    refundMessage: o.refund_message ?? o.refund?.message ?? "",
    refundAttachments: o.refund_attachments ?? o.refund?.attachments ?? [],
  }));

  const filteredOrders = orders;

  const openModal = (type, order) => {
    setModalType(type);
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 lg:space-y-10">
        {/* Header */}
        <div>
          <Heading
            title="Orders Management"
            subtitle="Organize your products into categories"
          />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
            />
          </div>

          {/* Fixed: Using your CustomSelect */}
          <div>
            <CustomSelect
              placeholder="All Status"
              options={[
                { value: "", label: "All Status" },
                { value: "PENDING", label: "Pending" },
                { value: "PAID", label: "Paid" },
                { value: "PROCESSING", label: "Processing" },
                { value: "SHIPPED", label: "Shipped" },
                { value: "DELIVERED", label: "Delivered" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="min-w-[180px]"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isFetching ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex flex-col">
                      ORD-{order.id}
                      {order.refundRequested && (
                        <span className="text-red-500 hover:text-red-700 text-sm mt-1 font-normal">
                          ⚠️ Refund Requested
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(order.date)}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      ${Number(order.total ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          String(order.type).toLowerCase() === "registered"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {order.agent}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)[0]}`}
                      >
                        <span className="flex items-center gap-1">
                          {(() => {
                          const StatusIcon = getStatusStyle(order.status)[1];
                          return StatusIcon ? (
                            <StatusIcon size={12} className="mr-1" />
                          ) : null;
                        })()}
                        <span className="">{order.status.toUpperCase()}</span>
                        </span>
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          openModal(
                            `${order.refundRequested ? "refund" : "details"}`,
                            order,
                          )
                        }
                        className="text-[#5B0D0D] transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye size={18} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={data?.page_size ?? itemsPerPage}
          totalCount={data?.count ?? 0}
          totalPages={totalPages}
          onPageChange={(p) => {
            if (p >= 1 && p <= totalPages) setCurrentPage(p);
          }}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === "details"}
        onClose={closeModal}
        title="Order Details"
        className="max-w-md md:max-w-2xl lg:max-w-3xl"
      >
        {selectedOrder && <OrderDetailsModalContent order={selectedOrder} />}
      </Modal>

      <Modal
        isOpen={modalType === "refund"}
        onClose={closeModal}
        title="Order Details"
        className="max-w-md md:max-w-2xl lg:max-w-3xl"
      >
        {selectedOrder && (
          <RefundOrderDetailsModalContent order={selectedOrder} />
        )}
      </Modal>
    </>
  );
};

export default OrdersManagement;
