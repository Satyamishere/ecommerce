import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const limit = 12;

  useEffect(() => {
    let mounted = true;
    const getNextProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/v1/users/getviewproduct?page=${page}&limit=${limit}`
        );
        if (!mounted) return;
        setProducts(res.data.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getNextProducts();
    return () => { mounted = false; };
  }, [page]);

  const toggleExpand = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const handleView = async (productId) => {
    try {
      await axios.get(`/api/v1/users/updateviewedproduct?productId=${productId}`);
    } catch (err) {
      console.error('Error updating viewed product', err);
    }
  };

  const hasMore = products.length === limit;

  const placeholderSVG =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20">No image</text></svg>';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Browse Products</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4 h-56" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => {
            const imgSrc = item.image || (item.images && item.images[0]);
            const desc = item.description || item.product?.description || '';
            return (
              <article
                key={item._id}
                onClick={() => handleView(item._id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col"
              >
                <div className="h-44 mb-4 rounded-md overflow-hidden bg-gray-50">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = placeholderSVG; }}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>

                <h2 className="text-lg font-medium text-gray-800 mb-1 truncate">{item.title}</h2>

                <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                  <div>
                    <div className="font-semibold">₹{item.price}</div>
                    <div className="text-xs text-gray-500">{(item.category && item.category.name) || item.category || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase text-gray-400 font-semibold mb-1">About</div>
                  <p className={`${expanded[item._id] ? 'text-sm text-gray-700 leading-relaxed' : 'text-sm text-gray-600 max-h-20 overflow-hidden'}`}>
                    {desc || 'No description provided.'}
                  </p>
                  {desc.length > 140 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(item._id); }}
                      className="mt-2 text-blue-600 text-sm focus:outline-none"
                    >
                      {expanded[item._id] ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page}</div>
        <div className="flex gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProducts;