import React, { useState, useRef, useMemo } from "react";
import { Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

/* ---------- FAKE SIZE & COLOR DATA (NEW) ---------- */
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = ["Black", "White", "Blue", "Green", "Red", "Sky Blue"];

/* ---------- CATEGORY DATA (UNCHANGED) ---------- */
const CATEGORY_DATA = [
  {
    id: 1,
    name: "Men",
    subCategories: ["T-Shirt", "Shirt", "Pants", "Jacket"],
  },
  { id: 2, name: "Women", subCategories: ["Dress", "Top", "Skirt", "Jeans"] },
  {
    id: 3,
    name: "Kids",
    subCategories: ["Baby Wear", "School Wear", "Winter Wear"],
  },
  {
    id: 4,
    name: "Accessories",
    subCategories: ["Belt", "Cap", "Wallet", "Sunglasses"],
  },
];

const AddProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  /* ---------- IMAGE STATE (UNCHANGED) ---------- */
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

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
    discountFrom: "",
    discountTo: "",
    stockQuantity: "",
    tag: "",
  });

  const currentCategory = CATEGORY_DATA.find(
    (cat) => cat.name === selectedCategory,
  );

  /* ---------- IMAGE LOGIC (UNCHANGED) ---------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
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
  const handleSubmit = () => {
    console.log("Form Data:", formData);
    console.log("Images:", images);
    console.log("Stock Rows:", stockRows);
    toast.success("Product added successfully!");
  };

  /* ---------- HANDLE CANCEL ---------- */
  const handleCancel = () => {
    setFormData({
      productName: "",
      productDetails: "",
      careInstruction: "",
      price: "",
      discount: "",
      discountFrom: "",
      discountTo: "",
      stockQuantity: "",
      tag: "",
    });
    setSelectedCategory("");
    setSelectedSubCategory("");
    setImages([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setStockRows([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl space-y-6 text-sm lora">
      {/* -------- Top Inputs -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Product Name</label>
          <input
            className="input"
            placeholder="Enter Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
          >
            <option value="">Select Category</option>
            {CATEGORY_DATA.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Sub category</label>
          <select
            className="input"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">Select Sub-Category</option>
            {currentCategory?.subCategories.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Price ($)</label>
          <input
            className="input"
            placeholder="Enter Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
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
          <label className="block mb-1">From</label>
          <input
            className="input"
            type="date"
            name="discountFrom"
            value={formData.discountFrom}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-1">To</label>
          <input
            className="input"
            type="date"
            name="discountTo"
            value={formData.discountTo}
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
          <label className="block mb-1">Tag</label>
          <input
            className="input"
            placeholder="enter tag"
            name="tag"
            value={formData.tag}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* -------- Product Photo -------- */}
      <div>
        <label className="block mb-2">Product Photo</label>

        <div
          onClick={() => fileInputRef.current.click()}
          className="bg-[#F3EAEA] border border-dashed border-[#6E0B0B] rounded-lg py-4 text-center cursor-pointer"
        >
          <p className="text-[#6E0B0B] font-medium">
            Add file <span className="text-gray-500">or drop files here</span>
          </p>
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
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border">
            {SIZE_OPTIONS.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-1.5 rounded-md border text-sm transition
                    ${
                      active
                        ? "bg-[#6E0B0B] text-white border-[#6E0B0B]"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block mb-2">Color Select</label>
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border">
            {COLOR_OPTIONS.map((color) => {
              const active = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-1.5 rounded-md border text-sm transition
                    ${
                      active
                        ? "bg-[#6E0B0B] text-white border-[#6E0B0B]"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {color}
                </button>
              );
            })}
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
