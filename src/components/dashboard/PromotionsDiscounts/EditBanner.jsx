import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { message } from "antd";
import { useEditBannerMutation } from "../../../redux/features/dashboard/promotion";

const EditBanner = ({ item, onClose }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [editBanner, { isLoading }] = useEditBannerMutation();

  // Image state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // new file if changed
  const [removeImage, setRemoveImage] = useState(false); // flag to remove existing

  // Video state
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [removeVideo, setRemoveVideo] = useState(false);

  useEffect(() => {
    if (item) {
      setValue("title", item.title || "");
      setValue("description", item.description || "");
      setValue("isActive", !!(item.is_active ?? (item.status === "active")));
      const sd = item.startDate || item.start_date;
      const ed = item.endDate || item.end_date;
      if (sd) setValue("startDate", String(sd).slice(0, 10));
      if (ed) setValue("endDate", String(ed).slice(0, 10));

      // Show existing media
      setImagePreview(item.image || null);
      setVideoPreview(item.video || null);
      try {
        const vn = (item.video || "").split("/").pop() || "";
        setVideoName(vn);
      } catch {
        setVideoName("");
      }

      // Reset new files/flags
      setImageFile(null);
      setVideoFile(null);
      setRemoveImage(false);
      setRemoveVideo(false);
    }
  }, [item, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false); // new upload → no need to remove old
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setVideoName(file.name);
      setRemoveVideo(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setRemoveImage(true); // tell backend to remove existing image
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setVideoFile(null);
    setVideoName("");
    setRemoveVideo(true);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.startDate) formData.append("start_date", data.startDate);
      if (data.endDate) formData.append("end_date", data.endDate);
      if (typeof data.isActive === "boolean") formData.append("is_active", String(data.isActive));
      if (imageFile) formData.append("image", imageFile);
      if (videoFile) formData.append("video", videoFile);
      const bannerId = item?.id ?? item?.banner_id;
      await editBanner({ bannerId, body: formData }).unwrap();
      message.success("Banner updated");
      onClose?.();
    } catch {
      message.error("Failed to update banner");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lora">
      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Title
        </label>
        <input
          {...register("title")}
          placeholder="Enter Banner Title"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter Description"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            End Date
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="banner-active"
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="banner-active" className="text-sm md:text-base text-gray-700">
          Active
        </label>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Image
        </label>
        <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm md:text-base">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="edit-banner-image"
          />
          <label htmlFor="edit-banner-image" className="cursor-pointer">
            <span className="text-primary">Add file</span> or drop Image here
          </label>
        </div>

        {imagePreview && (
          <div className="mt-4 relative inline-block">
            <img
              src={imagePreview}
              alt="banner preview"
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Video (Optional)
        </label>
        <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm md:text-base font-medium">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
            id="edit-banner-video"
          />
          <label htmlFor="edit-banner-video" className="cursor-pointer">
            <span className="text-primary">Add file</span> or drop Video here
          </label>
        </div>

        {(videoPreview || videoName) && (
          <div className="mt-4 flex items-center gap-3">
            {videoPreview ? (
              <video
                src={videoPreview}
                controls
                className="w-28 h-20 object-cover rounded border border-gray-300"
              />
            ) : null}
            <div className="flex items-center gap-2">
              {videoName && <span className="text-sm text-gray-700">{videoName}</span>}
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="bg-red-600 text-white rounded px-2 py-1 text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

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

export default EditBanner;
