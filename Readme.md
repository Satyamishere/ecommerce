marketPlace — Frontend

Live frontend: https://ecommerce-frontend-bdhf.onrender.com

Note: This frontend is deployed on Render. Render may put the site to sleep when idle; the site can take a short time (usually a few seconds up to a minute) to start after that. If the page doesn't load immediately, wait a moment and refresh.

API (backend) base path
- Base: <BACKEND_URL>/api/v1

Endpoints
- Users (/api/v1/users)
	- POST /register — create a new user
	- POST /login — login (sets `accessToken` and `refreshToken` cookies)
	- POST /sell — upload a product (requires auth)
	- POST /searchproduct — search products (requires auth)
	- POST /createchat — create a chat (requires auth)
	- GET /seller/:sellerId — get seller chats (requires auth)
	- GET /currentuser — get current user (requires auth)
	- GET /getviewproduct?page=&limit= — paginated product listing
	- GET /getpurchasesproducts — buyer purchases (requires auth)
	- GET /getsellingproducts — seller's products (requires auth)
	- GET /gettotalproductssold — products sold (requires auth)
	- GET /updateProductReview?productid=&description=&rating= — add product review (requires auth)
	- GET /getRecommendedProduct — recommended products (requires auth)

- Payment (/api/v1/payment)
	- POST /createorder — create Razorpay order (body: `amount`, `productId`)
	- POST /verifypayment — verify payment (body: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `productId`, `amount`)
	- GET /getsales — sales over time

- Admin (/api/v1/admin) — admin only
	- GET /dashboard-stats — overall orders & revenue
	- GET /sales-category — revenue by category
	- GET /sales-product — sales by product
	- GET /recent-orders — recent orders
	- GET /sales-over-time — sales aggregated by week/year

Key features
- User registration and login (JWT; access & refresh cookies)
- Post products and become a seller
- Product search with filters and sorting
- Paginated product listing
- Payment flow via Razorpay (order + verification)
- Chat between buyer and seller
- Product reviews and simple recommendation based on views/orders
- Seller and admin reporting (sales, recent orders, charts)

Quick notes
- Server mounts routes at `/api/v1/users`, `/api/v1/payment`, and `/api/v1/admin`.
- CORS is configured for `http://localhost:5173` and `https://ecommerce-frontend-bdhf.onrender.com` by default.
- For payments, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend env.
- Protected routes require the `accessToken` cookie or valid JWT.

See the project files for implementation details.