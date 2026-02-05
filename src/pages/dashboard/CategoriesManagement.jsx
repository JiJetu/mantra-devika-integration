import { useState } from "react";
import { Folder, Plus, SquarePen, Trash2 } from "lucide-react";
import Modal from "../../components/ui/Modal";
import EditCategory from "../../components/dashboard/categoriesManagement/EditCategory";
import AddCategory from "../../components/dashboard/categoriesManagement/AddCategory";
import { IMAGES } from "../../assets";
import SubCategoriesModal from "../../components/dashboard/categoriesManagement/SubCategoriesModal";

// Fake data (replace with real API data later)
const fakeCategories = [
  {
    id: 1,
    name: "Waistcoats",
    description: "Comfortable cotton Waistcoats",
    productCount: 45,
    status: "active",
    image: IMAGES.product,
  },
  {
    id: 2,
    name: "Jacket",
    description: "Premium quality Jacket",
    productCount: 23,
    status: "active",
    image: "https://via.placeholder.com/80x80/5B0D0D/FFFBEF?text=J",
  },
  {
    id: 3,
    name: "Kurta",
    description: "Premium quality Kurta",
    productCount: 18,
    status: "active",
    image: "https://via.placeholder.com/80x80/5B0D0D/FFFBEF?text=K",
  },
  {
    id: 4,
    name: "Trouser",
    description: "Comfortable cotton Trouser",
    productCount: 32,
    status: "active",
    image: "https://via.placeholder.com/80x80/5B0D0D/FFFBEF?text=T",
  },
  {
    id: 5,
    name: "Trending Now",
    description: "Most Popular product that you shouldn't miss",
    productCount: 42,
    status: "active",
    image: "https://via.placeholder.com/80x80/5B0D0D/FFFBEF?text=TN",
  },
  {
    id: 6,
    name: "Latest Collection",
    description: "Newest product that you shouldn't miss",
    productCount: 21,
    status: "active",
    image: "https://via.placeholder.com/80x80/5B0D0D/FFFBEF?text=LC",
  },
];

const CategoriesManagement = () => {
  const [modalType, setModalType] = useState(null); // 'add' | 'edit'

  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = (type, category = null) => {
    setModalType(type);
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 lg:space-y-10 lora">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Categories Management
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your products into categories
            </p>
          </div>
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => openModal("subcategory")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5B0D0D] text-white rounded-lg hover:bg-[#4a0b0b] transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              Add SubCategory
            </button>
            <button
              onClick={() => openModal("add")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5B0D0D] text-white rounded-lg hover:bg-[#4a0b0b] transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {fakeCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-[#F9EFD5] p-5 md:p-6 hover:shadow-md transition-all duration-200 group"
            >
              {/* Top section: Icon + Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="p-3.5 bg-[#FFF8E6] rounded-lg">
                    <Folder className="h-7 w-7 md:h-8 md:w-8 text-[#5B0D0D]" />
                  </div>
                  <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal("edit", category)}
                      className="text-blue-600 hover:text-blue-800 transition-colors rounded"
                    >
                      <SquarePen size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 my-4" />

              {/* Bottom section: Products count + Status */}
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-base font-medium text-[#4A5565]">
                  {category.productCount} Products
                </p>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                  {category.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === "add"}
        onClose={closeModal}
        title="Add Category"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        <AddCategory onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={modalType === "subcategory"}
        onClose={closeModal}
        title="Add SubCategory"
        className="max-w-md md:max-w-lg lg:max-w-xl !bg-[#FFFBEF]"
      >
        <SubCategoriesModal onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalType === "edit"}
        onClose={closeModal}
        title="Edit Category"
        className="max-w-md md:max-w-lg lg:max-w-xl"
      >
        {selectedCategory && (
          <EditCategory category={selectedCategory} onClose={closeModal} />
        )}
      </Modal>
    </>
  );
};

export default CategoriesManagement;
