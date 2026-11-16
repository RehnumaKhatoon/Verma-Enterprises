# Verma Enterprises

A responsive aquarium storefront and admin panel backed by an Express API and MongoDB. The customer shop reads product data from MongoDB; the included fallback cards are only used on the home page while the API is unreachable, and catalogue/admin pages always reflect the API.

## Requirements

- Node.js 20 or newer and npm
- MongoDB Community running locally, or a MongoDB Atlas connection string
- Cloudinary account for product image uploads (optional; product image URLs can be used without it)

## Install and run locally

From the project root:

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`. Set `MONGODB_URI`, a random `JWT_SECRET` (for example, generate 32+ random bytes), your private one-time `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 12 characters), and `CLIENT_URL=http://localhost:5173`. For MongoDB Atlas, create a database user, allow the development machine's IP in Network Access, and paste the provided `mongodb+srv://...` URI as `MONGODB_URI`. For local MongoDB, the example URI is ready to use.

To enable uploads, fill `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` using the Cloudinary dashboard. Keep these values only in `server/.env`. The frontend's `client/.env` may set `VITE_API_URL=http://localhost:5000/api` and `VITE_WHATSAPP_NUMBER` to a WhatsApp number in international format, digits only. The example number is a placeholder; set a real number before launch.

Create or update the admin record for `ADMIN_EMAIL`. The script reads `ADMIN_PASSWORD` from `server/.env`, requires at least 8 characters (maximum 72 UTF-8 bytes), hashes it with bcrypt before saving, and does not print the credential:

```bash
npm --workspace server run create-admin
```

After the command succeeds, remove `ADMIN_PASSWORD` from `server/.env`. Keep `.env` files private; they are ignored by git. Then start the client and API together:

```bash
npm run dev
```

- Storefront: <http://localhost:5173>
- Admin sign-in: <http://localhost:5173/admin/login>
- API: <http://localhost:5000>
- Health check: <http://localhost:5000/api/health>

Use the admin email and password supplied to the provisioning command. Admin sessions expire after 12 hours. Change the password by setting a new `ADMIN_PASSWORD` temporarily and rerunning the provisioning command.

## Production build

```bash
npm run build
npm --workspace server run start
```

Serve `client/dist` from a static host that supports SPA history fallback, run the server separately, set `VITE_API_URL` to the deployed API base URL at build time, and set the server's `CLIENT_URL` to the deployed storefront origin. Use HTTPS and a strong private JWT secret in production.

## API

- `GET /api/health`
- `POST /api/auth/login` — email/password; rate limited
- `GET /api/products?category=fish|plants|aquarium&featured=true&available=true`
- `GET /api/products/:id` — Mongo id or slug
- `POST /api/products` — admin JWT
- `PUT /api/products/:id` — admin JWT
- `DELETE /api/products/:id` — admin JWT
- `POST /api/upload` — admin JWT, multipart field `image`
- `POST /api/enquiries` — customer enquiry submission
- `GET /api/enquiries` — admin JWT
- `PATCH /api/enquiries/:id` and `DELETE /api/enquiries/:id` — admin JWT

Product categories are `fish`, `plants`, and `aquarium`; products may also have an optional subcategory. Product images accept up to five URL/public ID records. Cloudinary uploads are limited to JPG, PNG, or WebP up to 5 MB.
