
const stockData = [
  {
    size: "S",
    color: "#000000",
    stock: 45,
    sold: 55,
    transit: 52,
    return: 3,
    view: 3,
    purchase: 3,
    cart: 3,
  },

  {
    size: "S",
    color: "#4B5563",
    stock: 65,
    sold: 85,
    transit: 84,
    return: 1,
    view: 1,
    purchase: 1,
    cart: 1,
  },

  {
    size: "S",
    color: "#7C2D12",
    stock: 92,
    sold: 58,
    transit: 50,
    return: 8,
    view: 8,
    purchase: 8,
    cart: 8,
  },

  {
    size: "L",
    color: "#4B5563",
    stock: 64,
    sold: 36,
    transit: 32,
    return: 4,
    view: 4,
    purchase: 4,
    cart: 4,
  },

  {
    size: "L",
    color: "#7C2D12",
    stock: 92,
    sold: 58,
    transit: 50,
    return: 8,
    view: 8,
    purchase: 8,
    cart: 8,
  },

  {
    size: "L",
    color: "#111827",
    stock: 92,
    sold: 58,
    transit: 50,
    return: 8,
    view: 8,
    purchase: 8,
    cart: 8,
  },
];

const ViewSizes = () => {
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
              <th className="px-4 py-2 text-left">Sold</th>
              <th className="px-4 py-2 text-left">Transit</th>
              <th className="px-4 py-2 text-left">Return</th>
              <th className="px-4 py-2 text-left">View</th>
              <th className="px-4 py-2 text-left">Purchase</th>
              <th className="px-4 py-2 text-left">Cart</th>
            </tr>
          </thead>

          <tbody>
            {stockData.map((row, idx) => (
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
                    style={{ backgroundColor: row.color }}
                  />
                </td>

                {/* Numbers */}
                <td className="px-4 py-3 font-semibold text-green-600">
                  {row.stock}
                </td>
                <td className="px-4 py-3">{row.sold}</td>
                <td className="px-4 py-3">{row.transit}</td>
                <td className="px-4 py-3">{row.return}</td>
                <td className="px-4 py-3">{row.view}</td>
                <td className="px-4 py-3">{row.purchase}</td>
                <td className="px-4 py-3">{row.cart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSizes;
