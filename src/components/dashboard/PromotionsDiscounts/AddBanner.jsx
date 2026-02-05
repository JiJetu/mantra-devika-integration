import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const AddBanner = () => {
  const { register, handleSubmit, reset } = useForm();

  // Image previews
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Video previews
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...newPreviews]);
    setVideoFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    videoFiles.forEach((file) => {
      formData.append("videos", file);
    });

    console.log("Submitting banner FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    reset();
    setImagePreviews([]);
    setImageFiles([]);
    setVideoPreviews([]);
    setVideoFiles([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lora">
      {/* Title */}
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

      {/* Description */}
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

      {/* Start Date & End Date (ADDED HERE — as requested) */}
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

      {/* Image */}
      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Image
        </label>
        <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm md:text-base">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="banner-images"
          />
          <label htmlFor="banner-images" className="cursor-pointer">
            <span className="text-primary">Add file</span> or drop Image here
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative w-20 h-20 md:w-24 md:h-24">
                <img
                  src={src}
                  alt="banner preview"
                  className="w-full h-full object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      <div>
        <label className="block text-sm text-gray-700 mb-1 md:mb-2">
          Video (Optional)
        </label>
        <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm md:text-base font-medium">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
            id="banner-videos"
          />
          <label htmlFor="banner-videos" className="cursor-pointer">
            <span className="text-primary">Add file</span> or drop Video here
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base"
        >
          Save
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddBanner;
