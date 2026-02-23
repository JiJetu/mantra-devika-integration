
const ViewSizes = ({ product }) => {
  const rows = (product?.variants ?? []).map((v) => ({
    size: v.size,
    colorHex: String(v.color_hex || v.color || "#000000").trim(),
    currentStock: v.current_stock ?? 0,
    purchases: v.number_of_purches ?? 0,
    addToCart: v.total_number_of_add_to_cart ?? 0,
  }));
  return (
    <div className="bg-white rounded-xl w-full lora">
      {/* Section Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Stock by Size
      </h3>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500">
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Color</th>
              <th className="px-4 py-2 text-left">Current Stock</th>
              <th className="px-4 py-2 text-left">Purchases</th>
              <th className="px-4 py-2 text-left">Add to Cart</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                {/* Size */}
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-medium">
                    {row.size}
                  </span>
                </td>

                {/* Color */}
                <td className="px-4 py-3">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: row.colorHex }}
                  />
                </td>

                {/* Numbers */}
                <td className="px-4 py-3 font-semibold text-green-600">
                  {row.currentStock}
                </td>
                <td className="px-4 py-3">{row.purchases}</td>
                <td className="px-4 py-3">{row.addToCart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSizes;
