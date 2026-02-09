import React from "react";
import { message } from "antd";
import { useUpdateOrderStatusMutation } from "../../../redux/features/dashboard/order";
const OrderDetailsModalContent = ({ order }) => {
  const [currentStatus, setCurrentStatus] = React.useState(order.status);
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case "PAID":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "PROCESSING":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";
      case "DELIVERED":
        return "bg-[#DCFCE7] text-[#008236] hover:bg-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };
  const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const handleUpdate = async (next) => {
    try {
      await updateStatus({ orderId: order.id, status: next }).unwrap();
      setCurrentStatus(next);
      message.success(`Order status updated to ${next}`);
    } catch {
      message.error("Failed to update order status");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 lora">
      {/* Order Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-[#FFFBEF] p-5 md:p-6 lg:p-8 rounded-xl">
        <div>
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {order.id}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Country</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {order.country}
          </p>
        </div>
        <div
          className={`${order.apartment ? "sm:col-span-1" : "sm:col-span-2"}`}
        >
          <p className="text-sm text-gray-600">Address</p>
          <p className="text-base md:text-lg font-medium text-gray-900">
            {order.address}
          </p>
        </div>
        {order.apartment && (
          <div className="sm:col-span-1">
            <p className="text-sm text-gray-600">Apartment/Suite</p>
            <p className="text-base md:text-lg font-medium text-gray-900">
              {order.apartment}
            </p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-lg text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} | Size: {item.size}
                </p>
              </div>
              <p className="font-medium text-gray-900">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-lg md:text-xl font-semibold text-gray-900">Total</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900">
          ${order.total.toFixed(2)}
        </p>
      </div>

      {/* Update Status */}
      <div>
        <h3 className="text-lg text-gray-900 mb-4">Update Order Status</h3>
        <div className="flex flex-wrap gap-3">
          {statuses.map((s) => (
            <button
              key={s}
              disabled={isLoading}
              onClick={() => handleUpdate(s)}
              className={`flex-1 px-5 py-2.5 rounded-lg text-sm md:text-base font-medium transition-colors ${getStatusButtonStyle(s)} ${currentStatus === s ? "ring-2 ring-offset-1 ring-primary" : ""}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModalContent;
