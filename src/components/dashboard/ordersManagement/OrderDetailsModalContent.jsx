

const OrderDetailsModalContent = ({ order }) => {
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "processed":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "dispatched":
        return "bg-[#DCFCE7] text-[#008236]";
      case "delivered":
        return "bg-[#FFE2E2] text-[#C10007]";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
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
          {["Confirmed", "Processed", "Dispatched", "Delivered"].map((s) => (
            <button
              key={s}
              className={`flex-1 px-5 py-2.5 rounded-lg text-sm md:text-base font-medium transition-colors ${getStatusButtonStyle(s.toLowerCase())}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModalContent;
