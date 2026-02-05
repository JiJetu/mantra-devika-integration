import { useState } from "react";
import {
  Search,
  Eye,
  CircleCheckBig,
  Tractor,
  Van,
  Package,
  Split,
  ShieldHalf,
} from "lucide-react";
import Heading from "../../components/shared/Heading";
import Modal from "../../components/ui/Modal";
import OrderDetailsModalContent from "../../components/dashboard/ordersManagement/OrderDetailsModalContent";
import RefundOrderDetailsModalContent from "../../components/dashboard/ordersManagement/RefundOrderDetailsModalContent";
import CustomSelect from "../../components/ui/CustomSelect";

// Fake data (replace with API later)
const fakeOrders = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2024-01-05",
    total: 139.97,
    type: "Registered",
    agent: "Safi Mahmud",
    status: "confirmed",
    address: "San Francisco, CA",
    apartment: "416/1",
    country: "India",
    items: [
      { name: "Classic T-Shirt", quantity: 2, size: "S", price: 59.98 },
      { name: "Denim Jeans", quantity: 1, size: "M", price: 79.99 },
    ],
    refundRequested: false,
  },
  {
    id: "ORD-2024-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2024-01-04",
    total: 99.99,
    type: "Guest",
    agent: "Joy Molik",
    status: "in Transit",
    address: "New York, NY",
    apartment: "Apt 12",
    country: "USA",
    items: [{ name: "Premium Kurta", quantity: 1, size: "L", price: 99.99 }],
    refundRequested: false,
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    date: "2024-01-03",
    total: 209.96,
    type: "Registered",
    agent: "Joy Molik",
    status: "delivered",
    address: "House 7, London",
    apartment: "Flat 3B",
    country: "UK",
    items: [{ name: "Leather Jacket", quantity: 1, size: "XL", price: 209.96 }],
    refundRequested: true,
    refundMessage: "I got the wrong product.",
    refundAttachments: ["product_screenshot.jpg"],
  },
  {
    id: "ORD-2024-004",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    date: "2024-01-02",
    total: 29.99,
    type: "Guest",
    agent: "Safi Mahmud",
    status: "delivered",
    address: "Flat 3B, Sydney",
    apartment: "Unit 5A",
    country: "Australia",
    items: [{ name: "Classic T-Shirt", quantity: 1, size: "M", price: 29.99 }],
    refundRequested: false,
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "confirmed":
      return ["bg-blue-100 text-blue-700", CircleCheckBig];
    case "processed":
      return ["bg-orange-100 text-orange-700", ShieldHalf];
    case "dispatched":
      return ["bg-indigo-100 text-indigo-700", Split];
    case "delivered":
      return ["bg-green-100 text-green-700", Package];
    case "in Transit":
      return ["bg-yellow-100 text-yellow-700", Van];
    default:
      return ["bg-gray-100 text-gray-700", null];
  }
};

const OrdersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'details' | 'refund'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = fakeOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                "All Status",
                "Confirmed",
                "Processed",
                "Dispatched",
                "Delivered",
              ]}
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
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex flex-col">
                      {order.id}
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
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          order.type === "Registered"
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
