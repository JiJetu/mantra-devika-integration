import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const EditBanner = ({ item, onClose }) => {
  const { register, handleSubmit, setValue } = useForm();

  // Image state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // new file if changed
  const [removeImage, setRemoveImage] = useState(false); // flag to remove existing

  // Video state
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);

  useEffect(() => {
    if (item) {
      setValue("title", item.title || "");
      setValue("description", item.description || "");

      // Show existing media
      setImagePreview(item.image || null);
      setVideoPreview(item.video || null);

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
    setRemoveVideo(true);
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    // Text fields
    formData.append("title", data.title);
    formData.append("description", data.description);

    // Image handling
    if (imageFile) {
      formData.append("image", imageFile); // new image
    } else if (removeImage) {
      formData.append("removeImage", "true"); // remove existing
    }
    // If neither → keep existing (backend logic)

    // Video handling
    if (videoFile) {
      formData.append("video", videoFile);
    } else if (removeVideo) {
      formData.append("removeVideo", "true");
    }

    console.log("Submitting Edit Banner FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // → axios.put(`/api/banners/${item.id}`, formData)

    onClose?.();
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

        {videoPreview && (
          <div className="mt-4 relative inline-block">
            <video
              src={videoPreview}
              controls
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base"
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

export default EditBanner;