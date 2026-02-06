import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../../lib/format/date";

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-300";
    case "banned":
      return "bg-red-100 text-red-700 border-red-300";
    case "suspended":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "guest":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const CustomerTable = ({ paginatedCustomers, handleViewProfile }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Total Orders
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Total Spent
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Join Date
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
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-500">ID: {customer.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{customer.contact}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-center font-medium">
                  {customer.totalOrders}
                </td>
                <td className="px-6 py-4 text-center font-medium">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {formatDate(customer.joinDate)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(
                      customer.status,
                    )}`}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {customer.status !== "guest" ? (
                    <button
                      onClick={() => handleViewProfile(customer.id)}
                      className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 font-medium"
                    >
                      <Eye size={16} />
                      View Profile
                    </button>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-1.5">
                      <EyeOff size={16} /> No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden">
        {paginatedCustomers.map((customer) => (
          <div key={customer.id} className="border-b last:border-b-0 p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleRow(customer.id)}
            >
              <div>
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">ID: {customer.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(
                    customer.status,
                  )}`}
                >
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
                <span className="text-gray-400">
                  {expandedRow === customer.id ? '▲' : '▼'}
                </span>
              </div>
            </div>
            
            {expandedRow === customer.id && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Contact</div>
                    <div className="font-medium">{customer.contact}</div>
                    <div className="text-sm text-gray-600">{customer.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                    <div className="font-medium">{customer.totalOrders}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Spent</div>
                    <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Join Date</div>
                    <div className="font-medium">{formatDate(customer.joinDate)}</div>
                  </div>
                </div>
                <div className="pt-2">
                  {customer.status !== "guest" ? (
                    <button
                      onClick={() => handleViewProfile(customer.id)}
                      className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      <Eye size={14} />
                      View Profile
                    </button>
                  ) : (
                    <span className="text-gray-400 inline-flex items-center gap-1.5 text-sm">
                      <EyeOff size={14} /> No action available
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerTable;
