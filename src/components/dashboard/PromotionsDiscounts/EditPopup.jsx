import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const EditPopup = ({ item }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Prefill form values when `item` changes
  useEffect(() => {
    if (item) {
      setValue("title", item.title || "");
      setValue("shortDescription", item.shortDescription || "");
      setValue("startDate", item.startDate || "");
      setValue("endDate", item.endDate || "");

      if (item.popupImage) {
        setPreviewImage(item.popupImage); // Can be a URL from server
      }
    }
  }, [item, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("shortDescription", data.shortDescription);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    if (selectedFile) {
      formData.append("popupImage", selectedFile);
    }

    console.log("Submitting Edit Pop-up FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Reset form if needed
    // reset();
    // setPreviewImage(null);
    // setSelectedFile(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 lora">

      {/* Pop-up Image */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Pop-up Image</label>
        <div className="w-full p-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="popup-image"
          />
          <label htmlFor="popup-image">
            <span className="text-primary font-medium">Add file</span> or drop image here
          </label>
        </div>

        {previewImage && (
          <div className="mt-3 relative inline-block">
            <img
              src={previewImage}
              alt="popup preview"
              className="w-32 h-32 md:w-36 md:h-36 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={removePreview}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Title</label>
        <input
          {...register("title")}
          placeholder="Add Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Short Description</label>
        <input
          {...register("shortDescription")}
          placeholder="Add description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg transition-colors font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            removePreview();
            if (item && item.popupImage) {
              setPreviewImage(item.popupImage); // reset to original image
            }
          }}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPopup;
