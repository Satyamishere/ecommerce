import React, { useEffect, useState } from "react";
import axios from "axios";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d || "-";
  }
};

function UserProfile() {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [productsOnSell, setProductsOnSell] = useState([]);
  const [productsSold, setProductsSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchProfileData() {
      try {
        const [purchasedRes, onSellRes, soldRes] = await Promise.all([
          axios.get("/api/v1/users/getpurchasesproducts"),
          axios.get("/api/v1/users/getsellingproducts"),
          axios.get("/api/v1/users/gettotalproductssold"),
        ]);

        if (!mounted) return;
        setPurchasedProducts(purchasedRes.data.data || []);
        setProductsOnSell(onSellRes.data.data || []);
        setProductsSold(soldRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfileData();
    return () => { mounted = false; };
  }, []);

  const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const placeholderSVG =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14">No image</text></svg>';

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of purchases, listings, and sales.</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 bg-white rounded shadow p-4 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <main className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Purchased Products</h2>
            {purchasedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedProducts.map((item) => {
                  const imgSrc = item.image || item.product?.image || (item.product?.images && item.product.images[0]);
                  const desc = item.description || item.product?.description || '';
                  return (
                    <article key={item.orderId} className="bg-white rounded-lg shadow p-4 flex flex-col">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.title || item.product?.title} onError={(e) => { e.currentTarget.src = placeholderSVG; }} className="object-cover w-full h-full" />
                          ) : (
                            <div className="text-gray-400">No image</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800">{item.title || item.product?.title}</h3>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1 mb-1">Description</div>
                          <p className={`text-sm text-gray-600 ${expanded[item.orderId] ? 'leading-relaxed' : 'max-h-14 overflow-hidden'}`}>
                            {desc || 'No description.'}
                          </p>
                          {desc.length > 120 && (
                            <button onClick={() => toggle(item.orderId)} className="mt-2 text-blue-600 text-sm">{expanded[item.orderId] ? 'Show less' : 'Read more'}</button>
                          )}

                          <div className="mt-2 text-sm text-gray-700">
                            <span className="font-semibold">₹{item.price ?? item.amount ?? item.product?.price}</span>
                            <span className="ml-3 text-xs text-gray-500">Order: {item.orderId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                        <div>Paid: {formatDate(item.paidAt)}</div>
                        <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{item.orderStatus ?? 'completed'}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500">No purchased products</div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Products On Sell</h2>
            {productsOnSell.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsOnSell.map((item) => {
                  const imgSrc = item.image || (item.images && item.images[0]);
                  const desc = item.description || '';
                  return (
                    <article key={item._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.title} onError={(e) => { e.currentTarget.src = placeholderSVG; }} className="object-cover w-full h-full" />
                          ) : (
                            <div className="text-gray-400">No image</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1 mb-1">About</div>
                          <p className={`text-sm text-gray-600 ${expanded[item._id] ? 'leading-relaxed' : 'max-h-14 overflow-hidden'}`}>{desc || 'No description.'}</p>
                          {desc.length > 120 && (
                            <button onClick={() => toggle(item._id)} className="mt-2 text-blue-600 text-sm">{expanded[item._id] ? 'Show less' : 'Read more'}</button>
                          )}

                          <div className="mt-2 text-sm text-gray-700">
                            <span className="font-semibold">₹{item.price}</span>
                            <span className="ml-3 text-xs text-gray-500">{(item.category && item.category.name) || item.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                        <div>Status: <span className="font-medium">{item.status}</span></div>
                        <div className="text-xs text-gray-500">ID: {item._id}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500">No products currently on sale</div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Products Sold</h2>
            {productsSold.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsSold.map((item) => (
                  <article key={item._id} className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-800">{item.product?.title}</h3>
                    <p className="text-sm text-gray-500">{item.product?.description}</p>

                    <div className="mt-3 text-sm text-gray-700">
                      <div>Buyer: <span className="font-medium">{item.buyer?.username} ({item.buyer?.email})</span></div>
                      <div>Amount Paid: ₹{item.payment?.amount}</div>
                      <div>Paid At: {formatDate(item.payment?.paidAt)}</div>
                      <div>Order Status: <span className="font-medium">{item.status}</span></div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No products sold yet</div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default UserProfile;