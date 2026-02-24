import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { message } from "antd";
import { useEditHeadingMutation } from "../../../redux/features/dashboard/promotion";

const EditHeadingAnnouncement = ({ item, onClose }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [editHeading, { isLoading }] = useEditHeadingMutation();

  useEffect(() => {
    if (item) {
      setValue("title", item.title);
      setValue("startDate", item.startDate || "");
      setValue("endDate", item.endDate || "");
      setValue("isActive", !!(item.is_active ?? (item.status === "active")));
    }
  }, [item, setValue]);

  const onSubmit = async (data) => {
    try {
      const body = {};
      if (data.title) body.title = data.title;
      if (data.startDate) body.start_date = data.startDate;
      if (data.endDate) body.end_date = data.endDate;
      if (typeof data.isActive === "boolean") body.is_active = data.isActive;
      const announcementId = item?.id ?? item?.announcement_id;
      await editHeading({ announcementId, body }).unwrap();
      message.success("Heading announcement updated");
      onClose?.();
    } catch {
      message.error("Failed to update heading announcement");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lora">
      {/* Title */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Title
        </label>
        <input
          {...register("title")}
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

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <input
          id="heading-active"
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="heading-active" className="text-sm md:text-base text-gray-700">
          Active
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base disabled:opacity-60">{isLoading ? "Saving..." : "Save"}</button>
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

export default EditHeadingAnnouncement;
