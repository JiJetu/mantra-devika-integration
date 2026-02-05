import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  Clock,
  RotateCcw,
  Search,
  CircleCheckBig,
} from "lucide-react";
import Heading from "../../components/shared/Heading";
import CustomSelect from "../../components/ui/CustomSelect";

// Fake data (replace with API later)
const fakePayments = [
  {
    id: "TXN-2024-001",
    order: "ORD-2024-001",
    customer: "John Doe",
    amount: 139.97,
    method: "Credit Card",
    date: "2024-01-05 14:30",
    status: "COMPLETED",
  },
  {
    id: "TXN-2024-002",
    order: "ORD-2024-002",
    customer: "Jane Smith",
    amount: 199.99,
    method: "PayPal",
    date: "2024-01-04 11:20",
    status: "COMPLETED",
  },
  {
    id: "TXN-2024-003",
    order: "ORD-2024-003",
    customer: "Mike Johnson",
    amount: 209.96,
    method: "Credit Card",
    date: "2024-01-03 16:45",
    status: "COMPLETED",
  },
  {
    id: "TXN-2024-004",
    order: "ORD-2024-004",
    customer: "Sarah Williams",
    amount: 29.99,
    method: "Debit Card",
    date: "2024-01-02 09:15",
    status: "REFUNDED",
  },
  {
    id: "TXN-2024-005",
    order: "ORD-2024-005",
    customer: "Tom Brown",
    amount: 159.99,
    method: "Bank Transfer",
    date: "2024-01-06 10:00",
    status: "PENDING",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "COMPLETED":
      return ["bg-green-100 text-green-700 border-green-300", CircleCheckBig];
    case "PENDING":
      return ["bg-orange-100 text-orange-700 border-orange-300", Clock];
    case "REFUNDED":
      return ["bg-blue-100 text-blue-700 border-blue-300", DollarSign];
    default:
      return ["bg-gray-100 text-gray-700 border-gray-300", null];
  }
};

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dynamic filtering (add more logic later)
  const filteredPayments = fakePayments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Stats (computed dynamically)
  const totalTransactions = fakePayments.length;
  const completed = fakePayments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);
  const pending = fakePayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);
  const refunded = fakePayments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);

  const totalAmount = fakePayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10 lora">
      {/* Header */}
      <div>
        <Heading
          title="Payment Management"
          subtitle="Monitor all payment transactions"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Total</p>
          </div>
          <p className="text-2xl  font-bold text-gray-900">
            ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Completed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${completed}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Pending</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${pending}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-7">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <RotateCcw className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Refunded</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${refunded}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer, or order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>

        <div>
          <CustomSelect
            placeholder="All Status"
            options={["All Status", "Completed", "Pending", "Refunded"]}
            className="min-w-[180px]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{payment.order}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {payment.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{payment.method}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                  <td className="px-6 py-4 text-center">
                    <p
                      className={`inline-block px-4 py-1.5 text-[10px] font-medium rounded-full border lora ${getStatusStyle(payment.status)[0]}`}
                    >
                      <span className="flex items-center gap-1">
                          {(() => {
                          const StatusIcon = getStatusStyle(payment.status)[1];
                          return StatusIcon ? (
                            <StatusIcon size={12} className="mr-1" />
                          ) : null;
                        })()}
                        <span className="">{payment.status}</span>
                        </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
