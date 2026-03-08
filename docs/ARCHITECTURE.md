# Architecture & Upgrade Plan

## 1. Current Structure Overview

### Backend (`backend/`)

```
backend/
├── server.js          # Entry: dotenv, mongoose.connect, app.listen
├── app.js              # Express: CORS, json, routes, errorHandler
├── controllers/        # auth, user, product, admin (logic + DB calls)
├── middleware/         # auth (JWT protect), admin (adminOnly), errorHandler
├── models/             # User, Product (Mongoose schemas)
├── routes/             # Mount validators + controllers
├── validators/         # express-validator chains + validate()
└── scripts/seed.js     # Admin + sample products
```

- **No** `config/`, `services/`, `utils/`, `repositories/` — controllers call models directly.
- Response shape is ad-hoc (`res.json({ success, message?, data? })`).
- Validation and auth are well separated.

### Frontend (`frontend/src/`)

```
src/
├── main.jsx            # React root, BrowserRouter, AuthProvider
├── App.jsx             # Routes, ProtectedRoute, AdminRoute
├── api/axios.js        # Axios instance, token, 401 redirect
├── context/AuthContext.jsx  # user, login, register, logout, updateUser
├── components/         # Layout, Navbar, Footer, Toast, LoadingSpinner, admin/*
└── pages/              # Home, Products, ProductDetail, Login, Register, Profile, admin/*
```

- **No** `hooks/`, `services/`, `constants/`, `theme/` — pages call `api` (axios) directly.
- UI and API calls are coupled inside the same components.

---

## 2. Strengths

| Area | Detail |
|------|--------|
| **Backend** | Clear route → validator → controller flow; JWT + protect + adminOnly; express-validator; central errorHandler; ES modules. |
| **Frontend** | AuthContext centralizes auth; nested routes (Layout/AdminLayout); ProtectedRoute/AdminRoute; Tailwind + primary palette. |
| **Project** | README, .env.example both sides, seed script, Vietnamese copy; monorepo layout. |

---

## 3. Weaknesses

| Area | Issue |
|------|--------|
| **Backend** | Controllers contain business logic (no service layer). No shared response helper. Mongoose CastError leaks to client. Invalid ObjectId → 500. No config module. |
| **Frontend** | API calls inside pages/context (hard to reskin or test). ProductForm does not reset in create mode. Toast timer resets on re-render. AdminLayout uses `<a href="/">` (full reload). No loading/error cleanup on unmount in some pages. |
| **Ecommerce** | No categories, cart, orders, payments, coupons, reviews, wishlist, addresses, banners. |

---

## 4. What to Keep

- All existing **routes**, **models**, **middleware** (auth, admin, errorHandler), **validators**.
- **Auth flow**: JWT, protect, adminOnly, AuthContext (login, register, logout, updateUser).
- **Layouts**: Layout (Navbar + Outlet + Footer), AdminLayout (sidebar + Outlet).
- **Tailwind** setup and `primary` theme; existing components (Layout, Navbar, Footer, LoadingSpinner).
- **Seed** script (extend later for new entities).
- **Conventions**: `{ success, message?, data? }`, Vietnamese messages, ES modules.

---

## 5. What to Refactor (Incremental)

- **Backend**: Add `config`, shared **response helper**; handle **CastError** in errorHandler; **ObjectId** validation middleware; optionally **services** (start with auth/product) and thin controllers.
- **Frontend**: Extract **api services** (products, auth, users, admin) so pages use `productService.getList()` instead of `api.get('/products')`; fix **ProductForm** reset when `initial == null`; fix **Toast** (stable onClose); replace `<a href="/">` with **Link** in AdminLayout.
- **Pages**: Use services/hooks instead of raw `api`; add cleanup (AbortController or mounted flag) where needed.

---

## 6. What to Add (Phased)

- **Phase 1**: Config, response helper, errorHandler CastError, ObjectId validation. Frontend: api services, ProductForm/Toast/AdminLayout fixes.
- **Phase 2**: Backend services (auth, product), thin controllers. Frontend: hooks (e.g. useProducts), constants.
- **Phase 3**: Categories (model, routes, admin UI). Then Cart, Orders, Payments, Coupons, Reviews, Addresses, Banners, Wishlist, Reports — following the same patterns.

---

## 7. Proposed Folder Structure (Evolution of Current)

### Backend (additions only)

```
backend/
├── config/             # NEW: index.js (load env, export PORT, MONGODB_URI, JWT_*)
├── utils/              # NEW: response.js (success, error helpers)
├── middleware/         # EXISTING + validateObjectId.js
├── services/           # NEW (optional Phase 2): authService.js, productService.js
├── controllers/        # EXISTING; later call services instead of models
├── ...
```

### Frontend (additions only)

```
frontend/src/
├── api/
│   ├── axios.js        # EXISTING
│   └── services/       # NEW: productService.js, authService.js, userService.js, adminService.js
├── constants/          # NEW: index.js (routes, messages, etc.)
├── hooks/              # NEW (Phase 2): useProducts.js, useProfile.js, etc.
├── components/
├── context/
├── pages/
└── ...
```

- **No** renaming of existing folders; only new files and minimal edits to existing ones.

---

## 8. Phased Upgrade Plan (Minimal Breakage)

### Phase 1 — Foundation (current focus)

1. **Backend**
   - Add `config/index.js`: load env, export config; use in `server.js` and where needed.
   - Add `utils/response.js`: `success(res, data, message, status)`, `error(res, message, status)`.
   - Update `errorHandler.js`: handle `err.name === 'CastError'` → 400, generic message.
   - Add `middleware/validateObjectId.js`: validate `req.params.id` (and optional param name); use in product and admin routes.
   - Optionally use response helper in one controller (e.g. productController) to establish pattern; keep others unchanged for now.

2. **Frontend**
   - Add `api/services/productService.js`, `authService.js`, `userService.js`, `adminService.js`: wrap axios calls, same response shape.
   - Add `constants/index.js`: app name, routes, common messages.
   - Fix `ProductForm.jsx`: when `initial` is null/undefined, reset form state in useEffect.
   - Fix `Toast.jsx`: use ref for onClose so 4s timer does not reset on parent re-render.
   - Fix `AdminLayout.jsx`: use `<Link to="/">` instead of `<a href="/">`.

3. **Compatibility**: All existing API contracts and routes unchanged. Frontend still works if we keep calling `api` from pages until next step.

### Phase 2 — Services & Hooks

- Backend: Introduce `services/authService.js`, `productService.js`; controllers call services; models only in services/repos.
- Frontend: Pages and AuthContext use `authService`, `productService`, etc. instead of `api` directly. Add `useProducts`, `useProfile` hooks that use services.

### Phase 3 — Ecommerce Modules

- Categories → then Cart, Orders, Order Items, Payments, Coupons, Reviews, Addresses, Banners, Wishlist.
- Each: model (if needed), routes, validators, controller (→ service in Phase 2 style), then frontend services + pages.

---

## 9. Design Principles

- **Backend**: Controllers stay thin; business logic in services; shared response format; validation and auth in middleware.
- **Frontend**: UI components receive data and callbacks; API/business logic in services and hooks; theme in Tailwind/config so reskinning touches mainly JSX/CSS.
- **Compatibility**: Prefer additive changes; preserve existing endpoints and response shapes; refactor call sites gradually.
