import { useState, useRef, useMemo } from "react";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateProductMutation } from "../../../redux/features/dashboard/product.api";
import { useListCategoriesQuery } from "../../../redux/features/dashboard/category";
import { useListColorsQuery } from "../../../redux/features/dashboard/color.api";

const AddProduct = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories = [] } = useListCategoriesQuery();
  const { data: apiColors = [] } = useListColorsQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  /* ---------- IMAGE STATE (UNCHANGED) ---------- */
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  /* ---------- SIZE & COLOR STATE (NEW) ---------- */
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockRows, setStockRows] = useState([]);

  /* ---------- FORM DATA STATE (NEW) ---------- */
  const [formData, setFormData] = useState({
    productName: "",
    productDetails: "",
    careInstruction: "",
    price: "",
    discount: "",
    maxDiscountPrice: "",
    stockQuantity: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleCategoryChange = (e) => {
    const v = e.target.value;
    setSelectedCategoryId(v);
    setSelectedSizes([]);
    setStockRows([]);
  };

  const currentCategory = useMemo(
    () => (categories || []).find((c) => String(c.id ?? c.category_id) === String(selectedCategoryId)),
    [categories, selectedCategoryId],
  );

  const sizeOptions = useMemo(
    () => Array.isArray(currentCategory?.size_guides)
      ? currentCategory.size_guides.map((sg) => sg.size_name).filter(Boolean)
      : [],
    [currentCategory],
  );

  /* ---------- IMAGE LOGIC (UNCHANGED) ---------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setImageError(false);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- HANDLE SIZE & COLOR SELECTION (FIXED) ---------- */
  const handleSizeSelect = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes((prev) => prev.filter((s) => s !== size));
    } else {
      setSelectedSizes((prev) => [...prev, size]);
      // Auto-generate rows for this size with all selected colors
      if (selectedColors.length > 0) {
        const newRows = selectedColors.map((color) => ({
          size,
          color,
          initial: 0,
          current: 0,
          sold: 0,
        }));
        setStockRows((prev) => [...prev, ...newRows]);
      }
    }
  };

  const handleColorSelect = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors((prev) => prev.filter((c) => c !== color));
      // Remove rows with this color
      setStockRows((prev) => prev.filter((row) => row.color !== color));
    } else {
      setSelectedColors((prev) => [...prev, color]);
      // Auto-generate rows for this color with all selected sizes
      if (selectedSizes.length > 0) {
        const newRows = selectedSizes.map((size) => ({
          size,
          color,
          initial: 0,
          current: 0,
          sold: 0,
        }));
        setStockRows((prev) => [...prev, ...newRows]);
      }
    }
  };

  /* ---------- REMOVE STOCK ROW (FIXED) ---------- */
  const removeStockRow = (index) => {
    const rowToRemove = stockRows[index];
    setStockRows((prev) => prev.filter((_, i) => i !== index));

    // Check if this was the last row with this size
    const hasSize = stockRows.some(
      (row, i) => i !== index && row.size === rowToRemove.size,
    );
    if (!hasSize) {
      setSelectedSizes((prev) =>
        prev.filter((size) => size !== rowToRemove.size),
      );
    }

    // Check if this was the last row with this color
    const hasColor = stockRows.some(
      (row, i) => i !== index && row.color === rowToRemove.color,
    );
    if (!hasColor) {
      setSelectedColors((prev) =>
        prev.filter((color) => color !== rowToRemove.color),
      );
    }
  };

  /* ---------- UPDATE STOCK VALUE ---------- */
  const updateStockValue = (index, field, value) => {
    const numValue = parseInt(value) || 0;
    setStockRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: numValue } : row)),
    );
  };

  /* ---------- HANDLE INPUT CHANGE ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- HANDLE FORM SUBMIT ---------- */
  const handleSubmit = async () => {
    if (images.length === 0) {
      setImageError(true);
      toast.error("Please upload at least one product photo.");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("name", formData.productName || "");
      fd.append("description", formData.productDetails || "");
      fd.append("price", String(formData.price || 0));
      fd.append("actual_price", String(formData.price || 0));
      fd.append("discount", String(formData.discount || 0));
      if (formData.maxDiscountPrice !== "") {
        fd.append("max_discount_price", String(formData.maxDiscountPrice));
      }
      fd.append("care_instructions", formData.careInstruction || "");
      const colors = selectedColors.map((name) => {
        const found = apiColors.find((c) => c.name === name);
        return { name, hex_code: found?.hex_code || found?.color_code || "" };
      });
      const variants = stockRows.map((row) => ({
        size: row.size,
        in_stock: Number(row.current) > 0,
        stock_quantity: Number(row.current) || 0,
        color_name: row.color,
      }));
      const tagsPayload = tags.map((t) => ({ name: t }));
      if (selectedCategoryId) {
        fd.append("category_ids", JSON.stringify([Number(selectedCategoryId)]));
      }
      fd.append("colors", JSON.stringify(colors));
      fd.append("variants", JSON.stringify(variants));
      if (tagsPayload.length > 0) {
        fd.append("tags", JSON.stringify(tagsPayload));
      }
      images.forEach((img) => {
        if (img?.file) fd.append("photos", img.file);
      });
      fd.append("is_main_index", "0");
      await createProduct(fd).unwrap();
      toast.success("Product added successfully!");
      setFormData({
        productName: "",
        productDetails: "",
        careInstruction: "",
        price: "",
        discount: "",
        maxDiscountPrice: "",
        stockQuantity: "",
      });
      setSelectedCategoryId("");
      setImages([]);
      setImageError(false);
      setSelectedSizes([]);
      setSelectedColors([]);
      setStockRows([]);
      setTags([]);
      setTagInput("");
    } catch (e) {
      toast.error("Failed to add product");
    }
  };

  /* ---------- HANDLE CANCEL ---------- */
  const handleCancel = () => {
    setFormData({
      productName: "",
      productDetails: "",
      careInstruction: "",
      price: "",
      discount: "",
      maxDiscountPrice: "",
      stockQuantity: "",
    });
    setSelectedCategoryId("");
    setImages([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setStockRows([]);
    setTags([]);
    setTagInput("");
  };

  return (
    <div className="bg-white p-6 rounded-xl space-y-6 text-sm lora">
      {/* -------- Top Inputs -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Product Name</label>
          <input
            className="input"
            placeholder="Enter Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Categories</label>
          <select
            className="input"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => {
              const id = cat.id ?? cat.category_id;
              return (
                <option key={id} value={id}>
                  {cat.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* -------- Textareas -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Product Details</label>
          <textarea
            className="textarea"
            placeholder="Enter product description"
            name="productDetails"
            value={formData.productDetails}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-1">Care Instruction</label>
          <textarea
            className="textarea"
            placeholder="Enter product description"
            name="careInstruction"
            value={formData.careInstruction}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* -------- Pricing -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Price ($)</label>
          <input
            className="input"
            placeholder="Enter Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Discount</label>
          <input
            className="input"
            placeholder="0%"
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-1">Max Discount Price</label>
          <input
            className="input"
            placeholder="e.g., 199.99"
            type="number"
            name="maxDiscountPrice"
            value={formData.maxDiscountPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* -------- Quantity & Tags -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Stock Quantity</label>
          <input
            className="input"
            placeholder="Enter Quantity"
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-1">Tags</label>
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg border">
            {tags.map((t, i) => (
              <span key={`${t}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-xs">
                {t}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-red-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[140px] outline-none"
              placeholder="Type and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "," ) {
                  e.preventDefault();
                  const val = tagInput.trim();
                  if (val.length > 0 && !tags.includes(val)) {
                    setTags((prev) => [...prev, val]);
                  }
                  setTagInput("");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* -------- Product Photo -------- */}
      <div>
        <label className="block mb-2">
          Product Photo <span className="text-red-500">*</span>
        </label>

        <div
          onClick={() => fileInputRef.current.click()}
          className={`border border-dashed rounded-lg py-4 text-center cursor-pointer transition-colors ${imageError
            ? "bg-red-50 border-red-500"
            : "bg-[#F3EAEA] border-[#6E0B0B]"
            }`}
        >
          <p className="text-[#6E0B0B] font-medium">
            Add file <span className="text-gray-500">or drop files here</span>
          </p>
          {imageError && (
            <p className="text-red-500 text-xs mt-1">At least one photo is required</p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.preview}
                alt=""
                className="w-10 h-14 object-cover border rounded"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-[2px]"
              >
                <X size={12} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* -------- Size & Color (CHIP STYLE) -------- */}
      <div className="space-y-4">
        {/* Sizes */}
        <div>
          <label className="block mb-2">Size & Stock Information</label>
          {selectedCategoryId ? (
            sizeOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border">
                {sizeOptions.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-1.5 rounded-md border text-sm transition
                        ${active
                          ? "bg-[#6E0B0B] text-white border-[#6E0B0B]"
                          : "bg-white text-gray-700 border-gray-300"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No sizes configured for this category.</div>
            )
          ) : (
            <div className="text-sm text-gray-500 italic">Select a category to see available sizes.</div>
          )}
        </div>

        {/* Colors */}
        <div>
          <label className="block mb-2">Color Select</label>
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border">
            {apiColors.length === 0 ? (
              <span className="text-sm text-gray-400 italic">No colors available. Add colors first.</span>
            ) : (
              apiColors.map((color) => {
                const colorName = color.name;
                const colorHex = color.hex_code || color.color_code || "#cccccc";
                const active = selectedColors.includes(colorName);
                return (
                  <button
                    key={color.id ?? color.color_id}
                    type="button"
                    onClick={() => handleColorSelect(colorName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition
                      ${active
                        ? "bg-[#6E0B0B] text-white border-[#6E0B0B]"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: colorHex }}
                    />
                    {colorName}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* -------- Stock Table -------- */}
      {stockRows.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left">Size</th>
                <th className="px-3 py-2 text-left">Color</th>
                <th className="px-3 py-2 text-left">Initial Stock</th>
                <th className="px-3 py-2 text-left">Current Stock</th>
                <th className="px-3 py-2 text-left">Sold</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {stockRows.map((row, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-3 py-2">{row.size}</td>
                  <td className="px-3 py-2">{row.color}</td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input"
                      type="number"
                      min="0"
                      value={row.initial}
                      onChange={(e) =>
                        updateStockValue(i, "initial", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input"
                      type="number"
                      min="0"
                      value={row.current}
                      onChange={(e) =>
                        updateStockValue(i, "current", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input"
                      type="number"
                      min="0"
                      value={row.sold}
                      onChange={(e) =>
                        updateStockValue(i, "sold", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeStockRow(i)}
                      className="hover:bg-gray-100 p-1 rounded"
                    >
                      <Trash2
                        size={16}
                        className="text-red-600 cursor-pointer"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* -------- Actions -------- */}
      <div className="flex gap-4">
        <button
          className="flex-1 bg-[#6E0B0B] text-white py-3 rounded-lg font-medium hover:bg-[#5a0909] transition-colors"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Add Product
        </button>
        <button
          className="border border-gray-300 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {/* -------- Shared styles -------- */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
        }
        .input:focus {
          border-color: #6e0b0b;
        }
        .textarea {
          width: 100%;
          min-height: 90px;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          resize: none;
          outline: none;
        }
        .textarea:focus {
          border-color: #6e0b0b;
        }
        .table-input {
          width: 100%;
          padding: 4px 6px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          outline: none;
        }
        .table-input:focus {
          border-color: #6e0b0b;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
