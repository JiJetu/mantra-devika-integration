import { Check, Ban, Trash2 } from "lucide-react";
import { Modal, message } from "antd";
import {
  useGetCustomerProfileQuery,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
} from "../../../redux/features/dashboard/customer.api";
import { formatDate } from "../../../lib/format/date";

 

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getOrderStatusStyle = (status) => {
  const s = String(status || "").toUpperCase();
  switch (s) {
    case "CONFIRMED":
      return "bg-green-100 text-green-700 border-green-300";
    case "PROCESSED":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "DISPATCHED":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "DELIVERED":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "PAID":
      return "bg-green-100 text-green-700 border-green-300";
    case "PENDING":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "FAILED":
      return "bg-red-100 text-red-700 border-red-300";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getOrderStatusText = (status) => {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    default:
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};

const CustomerProfile = ({ userId, onClose }) => {
  const { data, isFetching } = useGetCustomerProfileQuery(userId, {
    skip: !userId,
  });
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const name = data?.user_name || (data?.email || "").split("@")[0] || "";
  const id = data?.user_id;
  const email = data?.email || "";
  const phone = data?.phone || "";
  const totalOrders = data?.total_order ?? 0;
  const totalSpent = data?.total_spent ?? 0;
  const joinDate = formatDate(data?.join_date || "");
  const status = (data?.status || "").toLowerCase();
  const orderStats = {
    confirmed: data?.total_order_confirmed ?? 0,
    delivered: data?.total_order_deliveried ?? 0,
    returned: data?.total_order_returned ?? 0,
  };
  const orderHistory = data?.order_history ?? [];

  const confirmAction = (title, action) => {
    Modal.confirm({
      title,
      content: `Are you sure you want to ${String(title || "").toLowerCase()} this user?`,
      okText: title,
      cancelText: "Cancel",
      okButtonProps: { danger: title === "Delete" },
      onOk: async () => {
        await action();
      },
    });
  };

  const handleSuspend = () => {
    if (!userId) return;
    confirmAction("Suspend", async () => {
      await suspendUser(userId).unwrap();
      message.success("User suspended successfully");
    });
  };

  const handleBan = () => {
    if (!userId) return;
    confirmAction("Ban", async () => {
      await suspendUser(userId).unwrap();
      message.success("User banned successfully");
    });
  };

  const handleDelete = () => {
    if (!userId) return;
    confirmAction("Delete", async () => {
      await deleteUser(userId).unwrap();
      message.success("User deleted successfully");
      if (onClose) onClose();
    });
  };

  const handleActivate = () => {
    if (!userId) return;
    confirmAction("Activate", async () => {
      await activateUser(userId).unwrap();
      message.success("User activated successfully");
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 lora">
      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-[#FFFBEF] p-6 rounded-xl">
        <div>
          <p className="text-sm text-gray-500">Customer Name</p>
          <p className="text-base text-gray-900">{name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Customer ID</p>
          <p className="text-base text-gray-900">{id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-base text-gray-900">{email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-base text-gray-900">{phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-base text-gray-900">{totalOrders}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-base text-gray-900">${totalSpent.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Join Date</p>
          <p className="text-base text-gray-900">{joinDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block px-3 py-1 text-xs md:text-sm font-medium rounded-full ${getStatusStyle(status)}`}
          >
            <span className="flex justify-center items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M8 10.5V9.5C8 8.96957 7.78929 8.46086 7.41421 8.08579C7.03914 7.71071 6.53043 7.5 6 7.5H3C2.46957 7.5 1.96086 7.71071 1.58579 8.08579C1.21071 8.46086 1 8.96957 1 9.5V10.5"
                  stroke="#008236"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.5 5.5C5.60457 5.5 6.5 4.60457 6.5 3.5C6.5 2.39543 5.60457 1.5 4.5 1.5C3.39543 1.5 2.5 2.39543 2.5 3.5C2.5 4.60457 3.39543 5.5 4.5 5.5Z"
                  stroke="#008236"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 5.5L9 6.5L11 4.5"
                  stroke="#008236"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </span>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 bg-[#FFFBEF] p-6 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#008236] rounded-full w-8 h-8 flex items-center justify-center">
            <Check className=" text-white" size={20} />
          </div>
          <div>
            <p className="text-sm md:text-base text-gray-500">
              Order Confirmed
            </p>
            <p className="text-base md:text-lg lg:text-xl font-medium text-gray-900">
              {orderStats.confirmed}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path
              d="M15 24.75L19.5 26.25C19.5 26.25 30.75 24 32.25 24C33.75 24 33.75 25.5 32.25 27C30.75 28.5 25.5 33 21 33C16.5 33 13.5 30.75 10.5 30.75H3"
              stroke="#5B0D0D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 21.75C4.5 20.25 7.5 18 10.5 18C13.5 18 20.625 21 21.75 22.5C22.875 24 19.5 26.25 19.5 26.25M12 13.5V7.5C12 7.10218 12.158 6.72064 12.4393 6.43934C12.7206 6.15804 13.1022 6 13.5 6H31.5C31.8978 6 32.2794 6.15804 32.5607 6.43934C32.842 6.72064 33 7.10218 33 7.5V19.5"
              stroke="#5B0D0D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.75 6H26.25V12.75H18.75V6Z"
              fill="#5B0D0D"
              stroke="#5B0D0D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div>
            <p className="text-sm md:text-base text-gray-500">
              Order Delivered
            </p>
            <p className="text-base md:text-lg lg:text-xl font-medium text-gray-900">
              {orderStats.delivered}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <g clip-path="url(#clip0_398_85)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M26.5963 1.22139C23.8345 0.912822 20.952 0.642822 18 0.642822C15.048 0.642822 12.1654 0.912822 9.40368 1.22139C7.30461 1.46208 5.34929 2.40778 3.8574 3.90387C2.36551 5.39996 1.42532 7.35794 1.19054 9.45768C0.894822 12.2065 0.642822 15.0685 0.642822 18C0.642822 20.9314 0.894822 23.7934 1.19054 26.5422C1.42532 28.642 2.36551 30.6 3.8574 32.0961C5.34929 33.5922 7.30461 34.5378 9.40368 34.7785C12.1654 35.0871 15.048 35.3571 18 35.3571C20.952 35.3571 23.8345 35.0871 26.5963 34.7785C28.6953 34.5378 30.6506 33.5922 32.1425 32.0961C33.6344 30.6 34.5746 28.642 34.8094 26.5422C35.1051 23.7934 35.3571 20.9314 35.3571 18C35.3571 15.0685 35.1051 12.2065 34.8094 9.45768C34.5746 7.35794 33.6344 5.39996 32.1425 3.90387C30.6506 2.40778 28.6953 1.46208 26.5963 1.22139ZM18.7405 16.5985L19.1725 18.3214H16.7143C15.947 18.3214 15.2112 18.0166 14.6687 17.4741C14.1262 16.9316 13.8214 16.1958 13.8214 15.4285V10.2857C13.8214 9.68894 13.5843 9.11665 13.1624 8.69469C12.7404 8.27273 12.1681 8.03568 11.5714 8.03568C10.9747 8.03568 10.4024 8.27273 9.9804 8.69469C9.55845 9.11665 9.32139 9.68894 9.32139 10.2857V15.4285C9.32139 17.3892 10.1003 19.2696 11.4867 20.6561C12.8731 22.0425 14.7535 22.8214 16.7143 22.8214H19.1725L18.7405 24.5443C18.6694 24.8287 18.664 25.1256 18.7249 25.4124C18.7857 25.6992 18.9111 25.9684 19.0916 26.1994C19.2721 26.4305 19.5029 26.6174 19.7664 26.7458C20.03 26.8743 20.3193 26.941 20.6125 26.9408C22.2017 26.9408 23.6417 25.9585 24.6111 24.9865C25.6423 23.958 26.5448 22.5514 26.9254 21.0394C27.0023 20.7321 27.0023 20.4107 26.9254 20.1034C26.5448 18.5914 25.6423 17.1848 24.6111 16.1537C23.6417 15.1843 22.2017 14.202 20.6125 14.202C20.3193 14.2018 20.03 14.2685 19.7664 14.397C19.5029 14.5254 19.2721 14.7123 19.0916 14.9433C18.9111 15.1744 18.7857 15.4436 18.7249 15.7304C18.664 16.0172 18.6694 16.3141 18.7405 16.5985Z"
                fill="#E7000B"
              />
            </g>
            <defs>
              <clipPath id="clip0_398_85">
                <rect width="36" height="36" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div>
            <p className="text-sm md:text-base text-gray-500">Order Returned</p>
            <p className="text-base md:text-lg lg:text-xl font-medium text-gray-900">
              {orderStats.returned}
            </p>
          </div>
        </div>
      </div>

      {/* Order History - Card Design */}
      <div>
        <h3 className="text-lg text-gray-900 mb-4">Order History</h3>
        <div className="space-y-4">
          {orderHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found.</p>
          ) : (
            orderHistory.map((order, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-900">Order ID: {order.order_id}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.date || order.created_at)}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${Number(order.total_amount ?? 0).toFixed(2)}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getOrderStatusStyle(
                        order.status,
                      )}`}
                    >
                      {getOrderStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-200">
        {status === "inactive" ? (
          <>
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Check size={20} />
              Activate User
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className=" flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
              Delete User
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSuspend}
              disabled={isSuspending}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-100 text-black hover:bg-yellow-200 transition-colors disabled:opacity-50"
            >
              <Ban size={20} />
              Suspend Account
            </button>
            <button
              onClick={handleBan}
              disabled={isSuspending}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E7000B] text-white transition-colors disabled:opacity-50"
            >
              <Ban size={20} />
              Ban User
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className=" flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
              Delete User
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
