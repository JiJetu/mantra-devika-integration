import { useForm } from "react-hook-form";
import CustomSelect from "../../ui/CustomSelect";
import { message } from "antd";
import { useCreateCouponMutation } from "../../../redux/features/dashboard/promotion";

const AddPromoCode = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const onSubmit = async (data) => {
    try {
      const body = {
        code: data.code,
        discount_percentage: Number(data.discount) || 0,
        max_discount_amount: Number(data.maxDiscount) || 0,
        valid_from: data.startDate || "",
        valid_to: data.endDate || "",
      };
      await createCoupon(body).unwrap();
      message.success("Coupon created");
      reset();
      onClose?.();
    } catch {
      message.error("Failed to create coupon");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 md:space-y-8 lora"
    >
      {/* Code */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Code
        </label>
        <input
          {...register("code")}
          placeholder="Enter Code"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Discount Type
        </label>
        <CustomSelect
          name="discountType"
          register={register}
          placeholder="Select Discount Type"
          options={["Percentage", "Fixed Amount"]}
        />
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Discount
        </label>
        <input
          {...register("discount")}
          placeholder="Enter Discount"
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      {/* Max Discount Amount */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Max Discount Amount
        </label>
        <input
          {...register("maxDiscount")}
          placeholder="Enter Max Discount Amount"
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
            End Date
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddPromoCode;
