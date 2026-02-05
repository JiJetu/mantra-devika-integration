import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";

export default function SubCategoriesModal() {
  const { register, handleSubmit, reset } = useForm();

  const [subcategories, setSubcategories] = useState([
    { id: 1, name: "Cotton", category: "Punjabi" },
    { id: 2, name: "Silk", category: "Punjabi" },
    { id: 3, name: "Jeans", category: "Pant" },
    { id: 4, name: "Cotton", category: "Kurta" },
  ]);

  const categories = ["Punjabi", "Pant", "Kurta"];

  const onSubmit = (data) => {
    const newSubcategory = {
      id: Date.now(),
      name: data.subcategoryName,
      category: data.category,
    };

    setSubcategories((prev) => [...prev, newSubcategory]);
    reset();
  };

  const handleDelete = (id) => {
    setSubcategories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#FFFBEF] lora">

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Subcategory Name */}
          <div>
            <label className="block text-sm text-[#7a1f1f] mb-1">
              Subcategory Name
            </label>
            <input
              {...register("subcategoryName", { required: true })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-transparent"
            />
          </div>

          {/* Select Category */}
          <div>
            <label className="block text-sm text-[#7a1f1f] mb-1">
              Select Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-transparent"
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Save Button */}
        <div className="text-right mt-3">
          <button
            type="submit"
            className="bg-[#6b0f0f] text-white px-14 py-2 rounded-md hover:bg-[#5a0d0d]"
          >
            Save
          </button>
        </div>
      </form>

      {/* Added Subcategory Table */}
      <h2 className="text-lg font-semibold text-[#7a1f1f] mt-10 mb-4 border-b pb-2">
        Added Subcategory
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[#7a1f1f] border-b">
              <th className="py-2">Sub category name</th>
              <th className="py-2">Category</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.category}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
