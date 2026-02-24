import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle, X } from "lucide-react";
import { useEditCategoryMutation } from "../../../redux/features/dashboard/category";
import { message } from "antd";
import CustomSelect from "../../ui/CustomSelect";

const EditCategory = ({ category, onClose }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // new file if uploaded
  const [wearType, setWearType] = useState("");
  const [sizeTitle, setSizeTitle] = useState("");
  const [sizeValue, setSizeValue] = useState("");
  const [sizeGuide, setSizeGuide] = useState([]);
  const [editCategory, { isLoading: isUpdating }] = useEditCategoryMutation();

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description);
      setValue("is_active", category.status === "active");
      setPreviewImage(category.image);
      setSelectedFile(null);
      setWearType(category.wear_type ?? category?.wearType ?? "");
      try {
        const sg = category.size_guides ?? category.size_guide ?? category?.sizeGuide;
        if (Array.isArray(sg)) {
          const normalized = sg.map((item) =>
            item && typeof item === "object" && "size_name" in item
              ? { title: item.size_name, value: item.size }
              : item
          );
          setSizeGuide(normalized);
        }
        else if (typeof sg === "string") {
          const parsed = JSON.parse(sg);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((item) =>
              item && typeof item === "object" && "size_name" in item
                ? { title: item.size_name, value: item.size }
                : item
            );
            setSizeGuide(normalized);
          }
        }
      } catch {
        setSizeGuide([]);
      }
    }
  }, [category, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const onSubmit = async (data) => {
    if (sizeGuide.length === 0) {
      message.error("Please add at least one size guide");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("is_active", data.is_active ? "true" : "false");
    if (wearType) formData.append("wear_type", wearType);
    {
      const apiGuides = sizeGuide.map((g) => ({
        size_name: g.title,
        size: g.value,
      }));
      formData.append("size_guides", JSON.stringify(apiGuides));
    }
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
    const categoryId = category?.id ?? category?.category_id;
    try {
      await editCategory({ categoryId, body: formData }).unwrap();
      message.success("Category updated successfully");
      onClose?.();
    } catch (e) {
      message.error("Failed to update category");
    }
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

      {/* Wear type */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Wear type
        </label>
        <CustomSelect
          options={[
            { label: "Upper Body wear", value: "UPPER" },
            { label: "Lower Body wear", value: "LOWER" },
            { label: "Footwear", value: "FOOTWEAR" },
            { label: "Accessories", value: "ACCESSORIES" },
          ]}
          placeholder="Select wear type"
          value={wearType}
          onChange={(e) => setWearType(e.target.value)}
          selectClassName="bg-[#F3E9E7]"
        />
      </div>

      {/* Update your sizeguide */}
      <div>
        <label className="block text-sm md:text-base text-gray-700 mb-2">
          Update your sizeguide
        </label>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3">
          <CustomSelect
            options={["XS", "S", "M", "L", "XL"].map((s) => ({
              label: s,
              value: s,
            }))}
            placeholder="Size Title"
            value={sizeTitle}
            onChange={(e) => setSizeTitle(e.target.value)}
            selectClassName="bg-[#F3E9E7]"
          />
          <input
            value={sizeValue}
            type="number"
            onChange={(e) => setSizeValue(e.target.value)}
            placeholder="Size value"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => {
              if (!sizeTitle || !sizeValue) return;
              setSizeGuide((prev) => [...prev, { title: sizeTitle, value: sizeValue }]);
              setSizeTitle("");
              setSizeValue("");
            }}
            aria-label="Add size"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        {sizeGuide.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sizeGuide.map((sg, idx) => (
              <span
                key={`${sg.title}-${idx}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF8E6] text-sm border border-[#F9EFD5]"
              >
                {sg.title}: {sg.value}
                <button
                  type="button"
                  onClick={() => setSizeGuide((prev) => prev.filter((_, i) => i !== idx))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  aria-label="Remove size"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} />
        <span className="text-sm md:text-base text-gray-700">Active</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="submit"
          disabled={isUpdating}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-base disabled:opacity-60"
        >
          {isUpdating ? "Updating..." : "Update Category"}
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
