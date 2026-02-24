import { useState } from "react";
import {  Plus, SquarePen, Trash2 } from "lucide-react";
import Modal from "../../components/ui/Modal";
import EditCategory from "../../components/dashboard/categoriesManagement/EditCategory";
import AddCategory from "../../components/dashboard/categoriesManagement/AddCategory";
import SubCategoriesModal from "../../components/dashboard/categoriesManagement/SubCategoriesModal";
import { useListCategoriesQuery, useDeleteCategoryMutation } from "../../redux/features/dashboard/category";
import { message, Popconfirm } from "antd";

const sanitizeUrl = (u) => String(u || "").replace(/[`"]/g, "").trim();

const CategoriesManagement = () => {
  const [modalType, setModalType] = useState(null); // 'add' | 'edit'

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data, isFetching } = useListCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deletingId, setDeletingId] = useState(null);
  const categories = (data ?? []).map((c, idx) => ({
    id: c.category_id ?? c.id ?? idx + 1,
    name: c.name,
    description: c.description || "",
    productCount: c.total_number_of_product ?? 0,
    status: c.is_active ? "active" : "inactive",
    image: sanitizeUrl(c.photo),
    wear_type: c.wear_type ?? c.wearType ?? "",
    size_guides: Array.isArray(c.size_guides) ? c.size_guides : [],
  }));

  const openModal = (type, category = null) => {
    setModalType(type);
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCategory(id).unwrap();
      message.success("Category deleted successfully");
    } catch {
      message.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
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
            {/* <button
              onClick={() => openModal("subcategory")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5B0D0D] text-white rounded-lg hover:bg-[#4a0b0b] transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              Add SubCategory
            </button> */}
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
          {isFetching ? (
            <div className="col-span-3 p-6 text-center text-gray-500">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-3 p-6 text-center text-gray-500">No categories found.</div>
          ) : categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-[#F9EFD5] p-5 md:p-6 hover:shadow-md transition-all duration-200 group"
            >
              {/* Top section: Icon + Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-gray-200 bg-[#FFF8E6]"
                  />
                  <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal("edit", category)}
                      className="text-blue-600 hover:text-blue-800 transition-colors rounded"
                    >
                      <SquarePen size={18} />
                    </button>
                    <Popconfirm
                      title="Delete this category?"
                      okText="Delete"
                      cancelText="Cancel"
                      okType="danger"
                      onConfirm={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                    >
                      <button
                        disabled={deletingId === category.id}
                        className="text-red-600 hover:text-red-800 transition-colors rounded disabled:opacity-60"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Popconfirm>
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
