import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useListColorsQuery,
  useCreateColorMutation,
  useDeleteColorMutation,
} from "../../../redux/features/dashboard/color.api";

const AddColorModalContent = () => {
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const { data: addedColors = [], isLoading: isLoadingColors } =
    useListColorsQuery();
  const [createColor, { isLoading: isCreating }] = useCreateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const handleAddColor = async () => {
    if (!colorName.trim() || !colorHex) return;
    try {
      await createColor({ name: colorName.trim(), hex_code: colorHex }).unwrap();
      toast.success("Color added!");
      setColorName("");
      setColorHex("#000000");
    } catch (err) {
      const msg =
        err?.data?.detail ||
        err?.data?.message ||
        "Failed to add color";
      toast.error(msg);
    }
  };

  const handleRemoveColor = async (colorId) => {
    try {
      await deleteColor(colorId).unwrap();
      toast.success("Color removed");
    } catch {
      toast.error("Failed to remove color");
    }
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
              placeholder="e.g. Sky Blue"
              required
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
                required
                className="w-10 h-10 border border-[#D6C9B5] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddColor}
            disabled={!colorName.trim() || isCreating}
            className="
              px-6 py-2
              bg-[#5B0D0D] text-white
              rounded-md
              disabled:opacity-40
            "
          >
            {isCreating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* ---------- Added Colors ---------- */}
      <div className="space-y-3">
        <h3 className="text-[#5B0D0D] font-semibold">
          Added Colors
        </h3>

        <div className="border-b border-[#E5D9C8]" />

        {isLoadingColors ? (
          <p className="text-sm text-gray-500">Loading colors...</p>
        ) : addedColors.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No colors added yet.</p>
        ) : (
          <div className="space-y-2">
            {addedColors.map((color) => (
              <div
                key={color.id ?? color.color_id}
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
                    style={{ backgroundColor: color.hex_code || color.color_code }}
                  />
                  <button
                    onClick={() =>
                      handleRemoveColor(color.id ?? color.color_id)
                    }
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddColorModalContent;
