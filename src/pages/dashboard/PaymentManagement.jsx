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
import Pagination from "../../components/shared/Pagination";
import { useGetPaymentSummaryQuery, useListPaymentsQuery, useSearchPaymentsQuery, useFilterPaymentsQuery } from "../../redux/features/dashboard/payment";
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
    case "COMPLETED":
    case "COMPLETE":
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
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: summary } = useGetPaymentSummaryQuery();
  const debouncedTerm = useDebouncedValue(searchTerm, 450);
  const searchEnabled = !!debouncedTerm;
  const filterEnabled = !searchEnabled && !!status;
  const { data: listData, isFetching: isFetchingList } = useListPaymentsQuery(
    { page: currentPage, page_size: itemsPerPage },
    { skip: searchEnabled || filterEnabled }
  );
  const { data: searchData, isFetching: isFetchingSearch } = useSearchPaymentsQuery(
    { q: debouncedTerm, page: currentPage, page_size: itemsPerPage },
    { skip: !searchEnabled }
  );
  const { data: filterData, isFetching: isFetchingFilter } = useFilterPaymentsQuery(
    { status, page: currentPage, page_size: itemsPerPage },
    { skip: !filterEnabled }
  );
  const data = searchEnabled ? searchData : filterEnabled ? filterData : listData;
  const isFetching = searchEnabled ? isFetchingSearch : filterEnabled ? isFetchingFilter : isFetchingList;
  const totalPages = data?.total_pages ?? 0;
  const rawPayments = data?.results ?? [];
  const payments = rawPayments.map((p) => ({
    id: p.transaction_id,
    order: String(p.order_id),
    customer: p.customer_name,
    amount: Number(p.amount ?? 0),
    method: p.payment_method,
    date: formatDate(p.date),
    status: String(p.status || "").toUpperCase() === "COMPLETE" ? "COMPLETED" : String(p.status || "").toUpperCase(),
  }));
  const filteredPayments = payments;
  const totalAmount = Number(summary?.Total_Order_amount ?? 0);
  const completed = Number(summary?.Total_Order_Completed_Amount ?? 0).toFixed(2);
  const pending = Number(summary?.Total_Order_pending_Amount ?? 0).toFixed(2);
  const refunded = Number(summary?.Total_order_Refund_Amount ?? 0).toFixed(2);

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
            options={[
              { value: "", label: "All Status" },
              { value: "Complete", label: "Completed" },
              { value: "Pending", label: "Pending" },
              { value: "Refund", label: "Refunded" },
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
              {isFetching ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : filteredPayments.map((payment) => (
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
      <Pagination
        currentPage={currentPage}
        pageSize={listData?.page_size ?? itemsPerPage}
        totalCount={listData?.count ?? 0}
        totalPages={totalPages}
        onPageChange={(p) => {
          if (p >= 1 && p <= totalPages) setCurrentPage(p);
        }}
      />
    </div>
  );
};

export default PaymentManagement;
