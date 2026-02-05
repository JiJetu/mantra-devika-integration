import { useState } from "react";
import { Trash2, Palette } from "lucide-react";

const AddColorModalContent = () => {
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");

  const [addedColors, setAddedColors] = useState([
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
  ]);

  const handleAddColor = () => {
    if (!colorName.trim() || !colorHex) return;

    setAddedColors((prev) => [
      ...prev,
      { name: colorName.trim(), hex: colorHex },
    ]);

    setColorName("");
    setColorHex("");
  };

  const handleRemoveColor = (index) => {
    setAddedColors((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-[#FFF9EE] space-y-6 lora">

      <div className="space-y-4">

        <div className="md:flex gap-4 items-end">
          {/* Color Name */}
          <div className="md:flex-1 mb-4 md:mb-0">
            <label className="block text-[#5B0D0D] mb-1">
              Color Name
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="
                w-full px-3 py-2
                border border-[#D6C9B5]
                rounded-md bg-[#FFFDF7]
                focus:outline-none
              "
            />
          </div>

          {/* Pick Color */}
          <div>
            <label className="block text-[#5B0D0D] mb-1">
              Pick Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="w-10 h-10 border border-[#D6C9B5] rounded cursor-pointer"
              />

              <div
                className="w-6 h-6"
                // style={{ backgroundColor: colorHex || "#ffffff" }}
              >
                {!colorHex && (
                  <Palette size={20} className="m-auto mt-1 text-[#5B0D0D]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddColor}
            disabled={!colorName.trim() || !colorHex}
            className="
              px-6 py-2
              bg-[#5B0D0D] text-white
              rounded-md
              disabled:opacity-40
            "
          >
            Save
          </button>
        </div>
      </div>

      {/* ---------- Added Colors ---------- */}
      <div className="space-y-3">
        <h3 className="text-[#5B0D0D] font-semibold">
          Added Color
        </h3>

        <div className="border-b border-[#E5D9C8]" />

        <div className="space-y-2">
          {addedColors.map((color, idx) => (
            <div
              key={idx}
              className="
                flex items-center justify-between
                px-3 py-2
                bg-[#FFFDF7]
                border border-[#E5D9C8]
                rounded-md
              "
            >
              <span className="text-[#5B0D0D]">
                {color.name}
              </span>

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-6 border border-[#D6C9B5] rounded-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <button
                  onClick={() => handleRemoveColor(idx)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddColorModalContent;

 