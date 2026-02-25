import { useState } from "react";
import Heading from "../../components/shared/Heading";
import { message } from "antd";
import {
  useOpenShopMutation,
  useCloseShopMutation,
  useSetShopStatusMutation,
} from "../../redux/features/dashboard/shop";

const ShopManagement = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [openShop, { isLoading: opening }] = useOpenShopMutation();
  const [closeShop, { isLoading: closing }] = useCloseShopMutation();
  const [setShopStatus, { isLoading: setting }] = useSetShopStatusMutation();

  const onToggle = async (e) => {
    const next = e.target.checked;
    try {
      await setShopStatus({ is_open: next }).unwrap();
      setIsOpen(next);
      message.success(next ? "Shop opened" : "Shop closed");
    } catch {
      message.error("Failed to update shop status");
    }
  };

  const onOpen = async () => {
    try {
      await openShop({ is_open: true }).unwrap();
      setIsOpen(true);
      message.success("Shop opened");
    } catch {
      message.error("Failed to open shop");
    }
  };

  const onClose = async () => {
    try {
      await closeShop({ is_open: false }).unwrap();
      setIsOpen(false);
      message.success("Shop closed");
    } catch {
      message.error("Failed to close shop");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10">
      <div className="flex items-center justify-between">
        <Heading title="Shop Management" subtitle="Control storefront availability" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Shop Status</p>
            <p className="text-sm text-gray-500">
              {isOpen === null ? "Unknown" : isOpen ? "Open" : "Closed"}
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={!!isOpen}
              onChange={onToggle}
              disabled={opening || closing || setting}
            />
            <span
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isOpen ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  isOpen ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onOpen}
            disabled={opening || setting}
            className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Open Shop
          </button>
          <button
            onClick={onClose}
            disabled={closing || setting}
            className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Close Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;

