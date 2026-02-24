import React, { useState, useRef, useMemo, useEffect } from "react";
import { Trash2, Upload, X } from "lucide-react";
import { useListColorsQuery } from "../../../redux/features/dashboard/color.api";
import { useEditProductMutation } from "../../../redux/features/dashboard/product.api";
import { message } from "antd";

/* ---------- SIZE DATA ---------- */
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

/* ---------- COLOR HEX MAPPING ---------- */
const COLOR_HEX_MAP = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Blue": "#0000FF",
  "Green": "#008000",
  "Red": "#FF0000",
  "Sky Blue": "#87CEEB"
};

/* ---------- HEX TO COLOR NAME MAPPING ---------- */
const HEX_COLOR_MAP = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#0000FF": "Blue",
  "#008000": "Green",
  "#FF0000": "Red",
  "#87CEEB": "Sky Blue",
  // Common variants
  "#000": "Black",
  "#fff": "White",
  "#f00": "Red",
  "#0f0": "Green",
  "#00f": "Blue",
  "#c0c0c0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#ffa500": "Orange",
  "#ffff00": "Yellow",
  "#800080": "Purple",
  "#ff00ff": "Pink",
  "#a52a2a": "Brown"
};

/* ---------- CATEGORY DATA ---------- */
const CATEGORY_DATA = [
  { id: 1, name: "Men", subCategories: ["T-Shirt", "Shirt", "Pants", "Jacket"] },
  { id: 2, name: "Women", subCategories: ["Dress", "Top", "Skirt", "Jeans"] },
  { id: 3, name: "Kids", subCategories: ["Baby Wear", "School Wear", "Winter Wear"] },
  { id: 4, name: "Accessories", subCategories: ["Belt", "Cap", "Wallet", "Sunglasses"] },
];

/* ---------- SIMPLE COLOR NAME HELPER ---------- */
const getColorNameFromHex = (hex) => {
  if (!hex || hex === "#" || hex === "") return "Select color";

  // Make sure hex starts with #
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }

  // Convert 3-digit hex to 6-digit
  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  // Normalize to uppercase for consistent matching
  hex = hex.toUpperCase();

  // Check exact match first
  if (HEX_COLOR_MAP[hex]) {
    return HEX_COLOR_MAP[hex];
  }

  // Try to find closest match from our COLOR_OPTIONS
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substr(0, 2), 16);
  const g = parseInt(hexValue.substr(2, 2), 16);
  const b = parseInt(hexValue.substr(4, 2), 16);

  // Simple color detection for basic colors
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "Unknown";

  // Check for black/white/gray
  if (r < 50 && g < 50 && b < 50) return "Black";
  if (r > 200 && g > 200 && b > 200) return "White";
  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
    if (r < 100) return "Black";
    if (r > 150) return "White";
    return "Gray";
  }

  // Check for primary colors
  if (r > 200 && g < 100 && b < 100) return "Red";
  if (g > 200 && r < 100 && b < 100) return "Green";
  if (b > 200 && r < 100 && g < 100) return "Blue";
  if (r > 200 && g > 200 && b < 100) return "Yellow";
  if (r > 200 && b > 200 && g < 100) return "Pink";
  if (g > 150 && b > 150 && r < 100) return "Cyan";
  if (r > 150 && b > 150 && g < 100) return "Purple";

  return "Unknown";
};

/* ---------- EDIT PRODUCT COMPONENT ---------- */
const EditProduct = ({ product, onClose, onSave }) => {
  const { data: apiColors = [] } = useListColorsQuery();
  const [editProduct, { isLoading: saving }] = useEditProductMutation();

  /* ---------- STATE ---------- */
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockRows, setStockRows] = useState([]);

  /* ---------- FORM DATA ---------- */
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

  /* ---------- INITIALIZE WITH PRODUCT DATA ---------- */
  useEffect(() => {
    if (product) {
      // Set form data from product
      setFormData({
        productName: product.name || product.product_name || "",
        productDetails: product.description || product.subtitle || product.product_description || "",
        careInstruction: product.careInstruction || "",
        price: product.price || product.product_price || "",
        discount: product.discount || "",
        discountFrom: product.discountFrom || "",
        discountTo: product.discountTo || "",
        stockQuantity: product.stockQuantity ?? product.currentStock ?? product.current_stock ?? "",
        tag: product.tag || "",
      });

      // Set category and subcategory
      setSelectedCategory(product.category || "");
      setSelectedSubCategory(product.subCategory || "");

      // Set images
      const productImages = product.images || (product.image ? [product.image] : (product.product_main_image ? [product.product_main_image] : []));
      setExistingImages(productImages);
      setImages([]);

      // Set sizes and colors from product data
      const srcRows = product.sizeStock && product.sizeStock.length > 0
        ? product.sizeStock
        : (product.variants && product.variants.length > 0
            ? product.variants.map(v => ({
                size: v.size,
                color: v.color_hex || (v.color ? (COLOR_HEX_MAP[v.color] || "#000000") : "#000000"),
                initial: (typeof v.current_stock === "number" && typeof v.number_of_purches === "number")
                  ? v.current_stock + v.number_of_purches
                  : 0,
                current: v.current_stock ?? 0,
                sold: v.number_of_purches ?? 0,
              }))
            : []);
      if (srcRows.length > 0) {
        const sizes = [...new Set(srcRows.map(item => item.size))];
        const colorNames = [...new Set(srcRows.map(item => getColorNameFromHex(item.color)))].filter(n => n && n !== "Unknown" && n !== "Select color");
        setSelectedSizes(sizes);
        setSelectedColors(colorNames);
        setStockRows(srcRows);
      }
    }
  }, [product]);

  const currentCategory = CATEGORY_DATA.find(
    (cat) => cat.name === selectedCategory
  );

  /* ---------- IMAGE HANDLING ---------- */
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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- SIZE & COLOR HANDLING ---------- */
  const handleSizeSelect = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(prev => prev.filter(s => s !== size));
      // Remove rows with this size
      setStockRows(prev => prev.filter(row => row.size !== size));
    } else {
      setSelectedSizes(prev => [...prev, size]);
      // Auto-generate rows for this size with all selected colors
      if (selectedColors.length > 0) {
        const newRows = selectedColors.map(colorName => {
          const hexColor = COLOR_HEX_MAP[colorName] || "#000000";
          return {
            size,
            color: hexColor,
            initial: 0,
            current: 0,
            sold: 0,
          };
        });
        setStockRows(prev => [...prev, ...newRows]);
      }
    }
  };

  const handleColorSelect = (colorName) => {
    const hexColor = COLOR_HEX_MAP[colorName] || "#000000";

    if (selectedColors.includes(colorName)) {
      setSelectedColors(prev => prev.filter(c => c !== colorName));
      // Remove rows with this color
      setStockRows(prev => prev.filter(row => row.color !== hexColor));
    } else {
      setSelectedColors(prev => [...prev, colorName]);
      // Auto-generate rows for this color with all selected sizes
      if (selectedSizes.length > 0) {
        const newRows = selectedSizes.map(size => ({
          size,
          color: hexColor,
          initial: 0,
          current: 0,
          sold: 0,
        }));
        setStockRows(prev => [...prev, ...newRows]);
      }
    }
  };

  /* ---------- REMOVE STOCK ROW ---------- */
  const removeStockRow = (index) => {
    const rowToRemove = stockRows[index];
    setStockRows(prev => prev.filter((_, i) => i !== index));

    // Check if this was the last row with this size
    const hasSize = stockRows.some((row, i) => i !== index && row.size === rowToRemove.size);
    if (!hasSize) {
      setSelectedSizes(prev => prev.filter(size => size !== rowToRemove.size));
    }

    // Check if this was the last row with this color
    const colorName = getColorNameFromHex(rowToRemove.color);
    const hasColor = stockRows.some((row, i) => i !== index && getColorNameFromHex(row.color) === colorName);
    if (!hasColor) {
      setSelectedColors(prev => prev.filter(color => color !== colorName));
    }
  };

  /* ---------- UPDATE STOCK VALUE ---------- */
  const updateStockValue = (index, field, value) => {
    const numValue = parseInt(value) || 0;
    setStockRows(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: numValue } : row
      )
    );
  };

  /* ---------- UPDATE COLOR VALUE ---------- */
  const updateColorValue = (index, newHexColor) => {
    setStockRows(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, color: newHexColor } : row
      )
    );

    // Update selected colors if needed
    const colorName = getColorNameFromHex(newHexColor);
    if (colorName !== "Unknown" && colorName !== "Select color" && !selectedColors.includes(colorName)) {
      setSelectedColors(prev => [...prev, colorName]);
    }
  };

  /* ---------- INPUT HANDLING ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ---------- FORM SUBMISSION ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productId = product?.id ?? product?.product_id;
      const fd = new FormData();
      if (formData.productName) fd.append("name", formData.productName);
      if (formData.productDetails) fd.append("description", formData.productDetails);
      if (formData.careInstruction) fd.append("care_instructions", formData.careInstruction);
      if (formData.price !== "") fd.append("price", String(formData.price));
      if (formData.discount !== "") fd.append("discount", String(formData.discount));

      // Colors payload [{name, hex_code}]
      const colorSet = new Set(selectedColors);
      const colorsPayload = Array.from(colorSet).map(name => ({
        name,
        hex_code: COLOR_HEX_MAP[name] || "#000000",
      }));
      if (colorsPayload.length > 0) {
        fd.append("colors", JSON.stringify(colorsPayload));
      }

      // Variants payload [{size, stock_quantity, in_stock, color_name}]
      const variantsPayload = stockRows.map(row => ({
        size: row.size,
        stock_quantity: Number(row.current) || 0,
        in_stock: (Number(row.current) || 0) > 0,
        color_name: getColorNameFromHex(row.color),
      }));
      if (variantsPayload.length > 0) {
        fd.append("variants", JSON.stringify(variantsPayload));
      }

      // Tags (single tag field to array)
      if (formData.tag) {
        fd.append("tags", JSON.stringify([{ name: String(formData.tag).trim(), slug: String(formData.tag).trim().toLowerCase().replace(/\s+/g, "-") }]));
      }

      // Photos
      images.forEach(img => {
        if (img?.file) fd.append("photos", img.file);
      });
      // If user removed all existing images and there were some before, clear old
      if ((existingImages?.length ?? 0) === 0 && (product?.images?.length > 0 || product?.image || product?.product_main_image)) {
        fd.append("clear_photos", "true");
      }

      await editProduct({ productId, body: fd }).unwrap();
      message.success("Product updated");
      onSave?.();
      onClose?.();
    } catch {
      message.error("Failed to update product");
    }
  };

  /* ---------- CANCEL ---------- */
  const handleCancel = () => {
    onClose?.();
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
            required
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
              <option key={cat.id} value={cat.name}>{cat.name}</option>
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
              <option key={i} value={sub}>{sub}</option>
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
            className="input number-input"
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
            className="input number-input"
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
            className="input number-input"
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

        {/* Existing Images */}
        <div className="flex gap-2 mt-3">
          {existingImages.map((img, i) => (
            <div key={`existing-${i}`} className="relative">
              <img src={img} alt="" className="w-10 h-14 object-cover border rounded" />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-[2px]"
              >
                <X size={12} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>

        {/* New Images */}
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <div key={`new-${i}`} className="relative">
              <img src={img.preview} alt="" className="w-10 h-14 object-cover border rounded" />
              <button
                type="button"
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
                const colorHex = color.hex || color.color_code || "#cccccc";
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

      {/* -------- Stock Table (WITH COLOR PICKER) -------- */}
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
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <div
                          className="w-8 h-8 rounded-full border border-gray-300"
                          style={{ backgroundColor: row.color }}
                        />
                        <input
                          type="color"
                          value={row.color}
                          onChange={(e) => updateColorValue(i, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {getColorNameFromHex(row.color)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input number-input"
                      type="number"
                      min="0"
                      value={row.initial}
                      onChange={(e) => updateStockValue(i, "initial", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input number-input"
                      type="number"
                      min="0"
                      value={row.current}
                      onChange={(e) => updateStockValue(i, "current", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="table-input number-input"
                      type="number"
                      min="0"
                      value={row.sold}
                      onChange={(e) => updateStockValue(i, "sold", e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeStockRow(i)}
                      className="hover:bg-gray-100 p-1 rounded"
                    >
                      <Trash2 size={16} className="text-red-600 cursor-pointer" />
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
          disabled={saving}
        >
          Update Product
        </button>
        <button
          className="border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
          border-color: #6E0B0B;
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
          border-color: #6E0B0B;
        }
        .table-input {
          width: 100%;
          padding: 4px 6px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          outline: none;
        }
        .table-input:focus {
          border-color: #6E0B0B;
        }
        /* Remove spinner arrows from number inputs */
        .number-input::-webkit-outer-spin-button,
        .number-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .number-input {
          -moz-appearance: textfield;
        }
        .number-input::-webkit-inner-spin-button,
        .number-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default EditProduct;
