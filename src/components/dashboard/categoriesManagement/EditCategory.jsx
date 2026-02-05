import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const EditCategory = ({ category, onClose }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // new file if uploaded
  const [removeImage, setRemoveImage] = useState(false); // flag to tell backend to remove image

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description);
      setPreviewImage(category.image); // show existing
      setSelectedFile(null);
      setRemoveImage(false);
    }
  }, [category, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setRemoveImage(false); // if new upload, no need to remove old one
    }
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setRemoveImage(true); // tell backend: remove existing image
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);

    if (selectedFile) {
      // New image uploaded → send it
      formData.append("image", selectedFile);
    } else if (removeImage) {
      // User removed image → tell backend to clear it
      formData.append("removeImage", "true");
    }
    // If neither → backend keeps existing image

    console.log("Submitting FormData for edit:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // → axios.put(`/api/categories/${category.id}`, formData)

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lora">
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Category Name
        </label>
        <input
          {...register("name")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Enter category description"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Category Photo
        </label>
        <div className="w-full p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center text-primary text-sm md:text-base">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="edit-category-photo"
          />
          <label htmlFor="edit-category-photo" className="cursor-pointer">
            <div>
              Add file <span className="text-[#777575]">or drop files here</span>
            </div>
          </label>
        </div>

        {previewImage && (
          <div className="mt-4 relative inline-block">
            <img
              src={previewImage}
              alt="category preview"
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemovePreview}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base"
        >
          Update Category
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

export default EditCategory;