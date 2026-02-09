// src/pages/dashboard/ProductPopularity.jsx
import { useState } from "react";
import { Search, Flame, Eye } from "lucide-react";
import Heading from "../../components/shared/Heading";
import { useGetProductPopularityQuery, useSearchProductPopularityQuery } from "../../redux/features/dashboard/popularity";
import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";

const mapPopularity = (items = []) =>
  items.map((p) => ({
    rank: p.rank,
    name: p.product_name,
    views: p.total_views,
    viewsIn48: p.total_views_48hr,
    isHot: Boolean(p.is_hot),
  }));

const ProductPopularity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebouncedValue(searchTerm, 450);
  const searchEnabled = !!debouncedTerm;
  const { data: listData, isFetching: isFetchingList } = useGetProductPopularityQuery(undefined, {
    skip: searchEnabled,
  });
  const { data: searchData, isFetching: isFetchingSearch } = useSearchProductPopularityQuery(
    { q: debouncedTerm },
    { skip: !searchEnabled },
  );
  const raw = searchEnabled ? searchData : listData;
  const isFetching = searchEnabled ? isFetchingSearch : isFetchingList;
  const products = mapPopularity(raw ?? []);

  const filteredProducts = products;

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
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
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
