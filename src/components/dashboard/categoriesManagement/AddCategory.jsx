import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const AddCategory = () => {
  const { register, handleSubmit, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

    // Add text fields
    formData.append("name", data.name);
    formData.append("description", data.description);

    // Add image file (if selected)
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    console.log("Submitting FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // → Here you would do: axios.post('/api/categories', formData)

    // Reset form after submit
    reset();
    setPreviewImage(null);
    setSelectedFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 md:space-y-8 lora"
    >
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Category Name
        </label>
        <input
          {...register("name")}
          placeholder="Enter category name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
        />
      </div>

      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter category description"
          rows={4}
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
            id="category-photo"
          />
          <label htmlFor="category-photo" className="cursor-pointer">
            <div>
              Add file <span className="text-[#777575]">or drop files here</span>
            </div>
          </label>
        </div>

        {previewImage && (
          <div className="mt-4 relative inline-block">
            <img
              src={previewImage}
              alt="preview"
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={removePreview}
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
          Add Category
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

export default AddCategory;