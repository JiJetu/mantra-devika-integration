import { useState } from "react";
import {
  Package,
  PackageCheck,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  SquarePen,
} from "lucide-react";
import Heading from "../../components/shared/Heading";
import Modal from "../../components/ui/Modal";
import ViewSizes from "../../components/dashboard/productManagement/ViewSizes";
import EditProduct from "../../components/dashboard/productManagement/EditProduct";
import AddProduct from "../../components/dashboard/productManagement/AddProduct";
import AddColor from "../../components/dashboard/productManagement/AddColor";
import CustomSelect from "../../components/ui/CustomSelect";
import Pagination from "../../components/shared/Pagination";
import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";
import { Modal as AntModal, message } from "antd";
import { useListCategoriesQuery } from "../../redux/features/dashboard/category";
import {
  useGetProductStatsQuery,
  useListProductsQuery,
  useDeleteProductMutation,
} from "../../redux/features/dashboard/product.api";

const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "in_stock")
    return "bg-green-100 text-green-700 border-green-200";
  if (s === "out_of_stock")
    return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

// Your helpers (unchanged)
const getProgressColor = (percent) => {
  if (percent >= 50) return "bg-[#00C950]";
  if (percent >= 25) return "bg-yellow-500";
  return "bg-[#FB2C36]";
};

const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm, 450);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false); // New state for Add Color modal

  const itemsPerPage = 10;

  const { data: stats } = useGetProductStatsQuery();
  const { data: listData, isFetching } = useListProductsQuery({
    page: currentPage,
    page_size: itemsPerPage,
    q: debouncedTerm || undefined,
  });
  const [deleteProduct] = useDeleteProductMutation();
  const { data: categoriesData, isFetching: isFetchingCategories } = useListCategoriesQuery();
  const categoryOptions = [
    "All Categories",
    ...((categoriesData ?? []).map((c) => c.name)),
  ];

  const totalPages = listData?.total_pages ?? 0;
  const products = (listData?.results ?? []).map((p) => ({
    id: p.product_id,
    name: p.product_name,
    subtitle: p.product_description,
    image: String(p.product_main_image || "").trim(),
    price: p.price,
    currentStock: p.current_stock,
    sold: p.sold,
    status: p.status,
    variants: p.product_variant ?? [],
    initialStock:
      (typeof p.current_stock === "number" ? p.current_stock : 0) +
      (typeof p.sold === "number" ? p.sold : 0),
  }));

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const totalProducts = stats?.total_product ?? 0;
  const totalCurrentStock = stats?.total_current_stock ?? 0;
  const totalSold = stats?.total_sold ?? 0;
  const lowStockItems = stats?.total_low_stock_item ?? 0;

  const handleViewSizes = (product) => {
    setSelectedProduct(product);
  };

  const confirmDelete = (productId) => {
    AntModal.confirm({
      title: "Delete Product",
      content: "Are you sure you want to delete this product?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteProduct(productId).unwrap();
        message.success("Product deleted successfully");
      },
    });
  };

  const hasInitialStock = products.some(
    (p) => typeof p.initialStock === "number" && p.initialStock > 0,
  );
  const columnCount = 6 + (hasInitialStock ? 2 : 0);

  return (
    <>
      <div className="space-y-6 md:space-y-8 lg:space-y-10 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Products Management"
            subtitle="Manage your product catalog"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsAddColorModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm md:text-base"
            >
              <Plus size={18} /> Add Color
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm md:text-base"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <PackageCheck className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Current Stock</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totalCurrentStock}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Sold</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalSold}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <CustomSelect
              options={categoryOptions}
              disabled={isFetchingCategories}
              className="w-full sm:w-44"
            />
            <CustomSelect
              options={["All Status", "In Stock", "Low Stock", "Out of Stock"]}
              // placeholder="All Categories"
              className="w-full sm:w-44"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-hidden rounded-xl shadow-sm border-2 border-[#F9EFD580] bg-white">
          {/* Mobile hint */}
          <div className="hidden lg:block xl:hidden p-3 bg-gray-50 text-sm text-gray-500 text-center border-b">
            ← Scroll horizontally to view all columns →
          </div>
          <div className="block lg:hidden p-3 bg-gray-50 text-sm text-gray-500 text-center border-b">
            🔻 click to view all columns 🔻
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  {hasInitialStock && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Initial Stock
                    </th>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Current Stock
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Sold
                  </th>
                  {hasInitialStock && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Stock Status
                    </th>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isFetching ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const initial = Number(product.initialStock) || 0;
                    const soldPercent =
                      initial > 0 ? 100 - (Number(product.sold) / initial) * 100 : 0;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-18 object-cover rounded border border-gray-200 shadow-sm"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {product.subtitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </td>
                        {hasInitialStock && (
                          <td className="px-6 py-4 text-center text-gray-600">
                            {initial}
                          </td>
                        )}
                        <td
                          className={`px-6 py-4 text-center font-medium ${Number(product.currentStock) < 50 ? "text-red-600" : "text-gray-900"}`}
                        >
                          {product.currentStock}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="text-[#FB2C36]" />
                            <span className="font-medium text-gray-900">
                              {product.sold}
                            </span>
                          </div>
                        </td>
                        {hasInitialStock && (
                          <td className="px-6 py-4 text-center">
                            <span className="flex items-center gap-1">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(soldPercent)} transition-all`}
                                  style={{ width: `${soldPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {soldPercent.toFixed(1)}%
                              </span>
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3.5 py-1 text-xs font-medium rounded-full border ${statusBadge(product.status)}`}
                          >
                            {String(product.status || "").replaceAll("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="text-[#9810FA] px-3 py-1 bg-[#FAF5FF] rounded-lg transition-colors text-sm md:text-base"
                            >
                              View Sizes
                            </button>
                            <button
                              onClick={() => setSelectedEditProduct(product)}
                              className="text-[#155DFC] transition-colors"
                            >
                              <SquarePen size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(product.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            pageSize={listData?.page_size ?? itemsPerPage}
            totalCount={listData?.count ?? 0}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {/* Existing Modals */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={`${selectedProduct?.name || ""}`}
        description="Size-wise Stock Details"
      >
        {selectedProduct && (
          <ViewSizes
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!selectedEditProduct}
        onClose={() => setSelectedEditProduct(null)}
        title="Edit Product"
        className="max-w-4xl lg:max-w-5xl"
      >
        {selectedEditProduct && (
          <EditProduct
            product={selectedEditProduct}
            onClose={() => setSelectedEditProduct(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        className="max-w-4xl lg:max-w-5xl"
      >
        <AddProduct onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isAddColorModalOpen}
        onClose={() => setIsAddColorModalOpen(false)}
        title="Add new color"
        className="max-w-md md:max-w-lg lg:max-w-xl !bg-[#FFFBEF]"
      >
        <AddColor />
      </Modal>
    </>
  );
};

export default ProductsManagement;
