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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Heading from "../../components/shared/Heading";
import { IMAGES } from "../../assets";
import Modal from "../../components/ui/Modal";
import ViewSizes from "../../components/dashboard/productManagement/ViewSizes";
import EditProduct from "../../components/dashboard/productManagement/EditProduct";
import AddProduct from "../../components/dashboard/productManagement/AddProduct";
import AddColor from "../../components/dashboard/productManagement/AddColor";
import CustomSelect from "../../components/ui/CustomSelect";

// Fake data (unchanged)
const fakeProducts = [
  {
    id: 1,
    name: "Waistcoats",
    subtitle: "Comfortable cotton Waistcoats",
    image: IMAGES.product,
    price: 29.99,
    initialStock: 500,
    currentStock: 266,
    sold: 234,
    sizeStock: [
      { size: "S", initial: 100, current: 45, sold: 55, color: "#FF0000" },
      { size: "M", initial: 150, current: 65, sold: 85, color: "#E5E7EB" },
      { size: "L", initial: 150, current: 92, sold: 58, color: "#FF0000" },
      { size: "XL", initial: 100, current: 64, sold: 36, color: "#FF0000" },
    ],
  },
  {
    id: 2,
    name: "Jacket",
    subtitle: "Premium quality Jacket",
    image: IMAGES.product,
    price: 79.99,
    initialStock: 400,
    currentStock: 211,
    sold: 189,
    sizeStock: [
      { size: "S", initial: 100, current: 45, sold: 55, color: "#FF0000" },
      { size: "M", initial: 150, current: 65, sold: 85, color: "#E5E7EB" },
      { size: "L", initial: 150, current: 92, sold: 58, color: "#FF0000" },
      { size: "XL", initial: 100, current: 64, sold: 36, color: "#FF0000" },
    ],
  },
  {
    id: 3,
    name: "Kurta",
    subtitle: "Premium quality Kurta",
    image: IMAGES.product,
    price: 99.99,
    initialStock: 200,
    currentStock: 44,
    sold: 156,
    sizeStock: [
      { size: "S", initial: 100, current: 45, sold: 55, color: "#FF0000" },
      { size: "M", initial: 150, current: 65, sold: 85, color: "#E5E7EB" },
      { size: "L", initial: 150, current: 92, sold: 58, color: "#FF0000" },
      { size: "XL", initial: 100, current: 64, sold: 36, color: "#FF0000" },
    ],
  },
  {
    id: 4,
    name: "Trouser",
    subtitle: "Comfortable cotton Trouser",
    image: IMAGES.product,
    price: 99.99,
    initialStock: 200,
    currentStock: 44,
    sold: 156,
    sizeStock: [
      { size: "S", initial: 100, current: 45, sold: 55, color: "#FF0000" },
      { size: "M", initial: 150, current: 65, sold: 85, color: "#E5E7EB" },
      { size: "L", initial: 150, current: 92, sold: 58, color: "#FF0000" },
      { size: "XL", initial: 100, current: 64, sold: 36, color: "#FF0000" },
    ],
  },
  {
    id: 5,
    name: "Trouser",
    subtitle: "Comfortable cotton Trouser",
    image: IMAGES.product,
    price: 99.99,
    initialStock: 200,
    currentStock: 0,
    sold: 200,
    sizeStock: [
      { size: "S", initial: 100, current: 45, sold: 55, color: "#FF0000" },
      { size: "M", initial: 150, current: 65, sold: 85, color: "#E5E7EB" },
      { size: "L", initial: 150, current: 92, sold: 58, color: "#FF0000" },
      { size: "XL", initial: 100, current: 64, sold: 36, color: "#FF0000" },
    ],
  },
];

// Your helpers (unchanged)
const getStockStatus = (current, initial) => {
  if (current === 0) {
    return {
      label: "Out of Stock",
      color: "bg-red-100 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    };
  }
  if (current <= initial * 0.25) {
    return {
      label: "Low Stock",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      dotColor: "bg-orange-500",
    };
  }
  return {
    label: "In Stock",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
  };
};

const getProgressColor = (percent) => {
  if (percent >= 50) return "bg-[#00C950]";
  if (percent >= 25) return "bg-yellow-500";
  return "bg-[#FB2C36]";
};

const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false); // New state for Add Color modal

  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = fakeProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Stats
  const totalProducts = fakeProducts.length;
  const totalCurrentStock = fakeProducts.reduce(
    (sum, p) => sum + p.currentStock,
    0,
  );
  const totalSold = fakeProducts.reduce((sum, p) => sum + p.sold, 0);
  const lowStockItems = fakeProducts.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.initialStock * 0.25,
  ).length;

  const handleViewSizes = (product) => {
    setSelectedProduct(product);
  };

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
              options={["All Categories", "Waistcoats", "Jackets", "Kurtas"]}
              // placeholder="All Categories"
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
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Initial Stock
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Current Stock
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Sold
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Stock Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(
                    product.currentStock,
                    product.initialStock,
                  );
                  const soldPercent =
                    product.initialStock > 0
                      ? 100 - (product.sold / product.initialStock) * 100
                      : 0;

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
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {product.initialStock}
                      </td>
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
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-medium rounded-full border ${stockStatus.color}`}
                        >
                          {stockStatus.label}
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
                          <button className="text-red-600 hover:text-red-800 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm text-gray-600 border-t">
            <div>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1.5 rounded-md border border-gray-300 font-medium ${
                      currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
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
