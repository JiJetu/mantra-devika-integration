import { AlertTriangle, Paperclip } from "lucide-react";

const RefundOrderDetailsModalContent = ({ order }) => {
  return (
    <div className="space-y-6 md:space-y-8 lora">
      {/* Same order info as above */}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Items
        </h3>
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

      {/* Update Status (same as normal details) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Update Order Status
        </h3>
        <div className="flex flex-wrap gap-3">
          {["Confirmed", "Processed", "Dispatched", "Delivered"].map((s) => (
            <button
              key={s}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                s.toLowerCase() === order.status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Refund Request Section */}
      {order.refundRequested && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 md:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-700">
              Refund Request
            </h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            Customer has requested a refund for this order.
          </p>

          <div className="space-y-4 bg-white p-7 border border-[#F9EFD5] rounded-lg">
            <div>
              <p className="text-sm md:text-base font-medium text-gray-900">
                User Message
              </p>
              <p className="text-sm md:text-base text-gray-700 mt-1 bg-[#F9FAFB] p-4 rounded-lg">
                {order.refundMessage || "No message provided."}
              </p>
            </div>

            {order.refundAttachments?.length > 0 && (
              <div>
                <p className="text-sm md:text-base font-medium text-[#364153] flex items-center">
                  <Paperclip size={18} className="inline mr-2" />Attachments
                </p>
                <div className="flex gap-3 mt-2">
                  {order.refundAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-[#EEF2FF] rounded-lg text-sm text-primary"
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Approve / Reject */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="px-6 py-3 bg-[#00A63E] text-white rounded-lg transition-colors font-medium text-sm">
              Approve Refund
            </button>
            <button className="px-6 py-3 bg-[#4A5565] text-white rounded-lg transition-colors font-medium text-sm">
              Reject Refund
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundOrderDetailsModalContent;
