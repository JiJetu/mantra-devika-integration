// src/pages/dashboard/ProductPopularity.jsx
import { useState } from "react";
import { Search, Flame, Eye } from "lucide-react";
import Heading from "../../components/shared/Heading";

// Fake data (replace with real API data later)
const fakeProductPopularity = [
  {
    rank: 1,
    name: "Jaipuri Sherwani",
    views: 468,
    viewsIn48: 468,
    isHot: true,
  },
  {
    rank: 2,
    name: "Denim Jeans",
    views: 356,
    viewsIn48: 100,
    isHot: true,
  },
  {
    rank: 3,
    name: "Leather Jacket",
    views: 298,
    viewsIn48: 150,
    isHot: true,
  },
  {
    rank: 4,
    name: "Running Shoes",
    views: 267,
    viewsIn48: 200,
    isHot: false,
  },
  {
    rank: 5,
    name: "Casual Shirt",
    views: 245,
    viewsIn48: 120,
    isHot: false,
  },
  {
    rank: 6,
    name: "Sports Cap",
    views: 187,
        viewsIn48: 80,
    isHot: false,
  },
  {
    rank: 7,
    name: "Sneakers",
    views: 165,
    viewsIn48: 60,
    isHot: false,
  },
  {
    rank: 8,
    name: "Hoodie",
    views: 142,
    viewsIn48: 70,
    isHot: false,
  },
];

const ProductPopularity = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Simple client-side filtering
  const filteredProducts = fakeProductPopularity.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10 lora">
      {/* Header */}
      <div>
        <Heading
          title="Product Popularity Tracking"
          subtitle="Track product views over time and display popularity indicators on the frontend"
        />
      </div>

      {/* Search */}
      <div className="relative p-6 bg-white rounded-xl shadow-sm shadow-[#F9EFD580] border border-[#F9EFD580]">
        <Search className="absolute left-[35px] top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base lg:text-lg"
        />
      </div>

      {/* Product View Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-6 py-4 text-center text-sm md:text-base lg:text-lg font-semibold text-gray-700">
                  Views (Current Period)
                </th>
                <th className="px-6 py-4 text-center text-sm md:text-base lg:text-lg font-semibold text-gray-700">
                  48H
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">
                    <span className="bg-gradient-to-r from-[#DBEAFE] to-[#F3E8FF] px-3 py-1 rounded-lg">{product.rank}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                        {product.name}
                      </span>
                      {product.isHot && (
                        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full">
                          <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                          <span className="text-xs md:text-sm font-medium text-orange-700">Hot</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <span>{product.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 text-sm md:text-base lg:text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span>{product.viewsIn48}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPopularity;