import { useForm } from "react-hook-form";
import { useEffect } from "react";

const EditPromoCode = ({ item }) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (item) {
      setValue("code", item.code);
      setValue("discountType", item.discountType);
      setValue("discount", item.discount);
      setValue("maxDiscount", item.maxDiscount);
      setValue("startDate", item.startDate || "");
      setValue("endDate", item.endDate || "");
    }
  }, [item, setValue]);

  const onSubmit = (data) => {
    console.log("Updated Promo Code:", { ...item, ...data }); // Handle update logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lora">
      {/* Code */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Code
        </label>
        <input
          {...register("code")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Discount Type
        </label>
        <select
          {...register("discountType")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        >
          <option>Percentage</option>
          <option>Fixed Amount</option>
        </select>
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Discount
        </label>
        <input
          {...register("discount")}
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
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base md:text-lg"
        >
          Save
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base md:text-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPromoCode;
