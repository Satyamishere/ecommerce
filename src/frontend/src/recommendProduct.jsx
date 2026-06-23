import React, { useEffect, useState } from "react";
import axios from "axios";

function RecommendProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("/api/v1/users/getRecommendedProduct");
        setProducts(response.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const placeholderSVG =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20">No image</text></svg>';

  if (loading) {
    return <div className="p-4">Loading recommendations...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>

      {products.length === 0 ? (
        <div className="text-gray-600">No recommendations available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="h-44 mb-4 rounded-md overflow-hidden bg-gray-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.src = placeholderSVG;
                    }}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-800 truncate">{product.title}</h3>

              <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                <div>
                  <div className="font-semibold">₹{product.price}</div>
                  <div className="text-xs text-gray-500">{product.categoryDetails?.name || product.category?.name || "N/A"}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3 max-h-16 overflow-hidden">{product.description || ""}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendProduct;