# Hướng dẫn chi tiết Source Code – Project E-commerce Full-Stack

Tài liệu này giải thích toàn bộ project như đang dạy cho người mới học full-stack: từ tổng quan đến từng phần Frontend, Backend, Database, API, và luồng kết nối.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Frontend](#2-frontend)
3. [Backend](#3-backend)
4. [Database](#4-database)
5. [API](#5-api)
6. [Luồng kết nối Frontend – Backend](#6-luồng-kết-nối-frontend--backend)
7. [Luồng hoạt động từng bước (use cases)](#7-luồng-hoạt-động-từng-bước-use-cases)
8. [Tổng kết và gợi ý học](#8-tổng-kết-và-gợi-ý-học)

---

## 1. Tổng quan kiến trúc

Project là **ứng dụng web e-commerce** (bán mỹ phẩm / beauty): khách xem sản phẩm, đăng ký/đăng nhập, admin quản lý sản phẩm và user.

- **Frontend**: React (Vite), React Router, Tailwind CSS. Chạy riêng (ví dụ `http://localhost:5173`).
- **Backend**: Node.js + Express. Chạy riêng (ví dụ `http://localhost:5000`).
- **Database**: MongoDB. Backend kết nối qua Mongoose.
- **Giao tiếp**: Frontend gọi Backend qua **HTTP API** (JSON). Đăng nhập dùng **JWT** (token trong header).

```
[Trình duyệt]  ←→  [Frontend React]  ←→ HTTP/JSON  ←→  [Backend Express]  ←→  [MongoDB]
```

---

## 2. Frontend

### 2.1. Cấu trúc thư mục

```
frontend/
├── public/                 # File tĩnh (logo, v.v.)
├── src/
│   ├── api/                # Gọi API
│   │   ├── axios.js        # Instance axios (baseURL, token, xử lý 401)
│   │   ├── navigateRef.js  # Ref để axios interceptor gọi logout + redirect
│   │   └── services/       # Mỗi domain một file
│   │       ├── authService.js
│   │       ├── userService.js
│   │       ├── productService.js
│   │       └── adminService.js
│   ├── components/         # Component dùng lại
│   │   ├── Layout.jsx      # Bọc trang: Header + Outlet + Footer
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Toast.jsx, LoadingSpinner.jsx
│   │   ├── home/           # Section trang chủ
│   │   │   ├── HeroSection.jsx
│   │   │   ├── CategoryShowcase.jsx
│   │   │   ├── RelatedProductsSection.jsx  # Beauty Must Have
│   │   │   └── ...
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       └── ProductForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Trạng thái đăng nhập toàn app
│   ├── constants/
│   │   ├── index.js        # ROUTES, PRODUCT_CATEGORIES, header/footer config
│   │   └── homeConfig.js   # Nội dung trang chủ (hero, categories, v.v.)
│   ├── pages/              # Mỗi route = một page
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Login.jsx, Register.jsx, Profile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       └── AdminUsers.jsx
│   ├── App.jsx              # Định nghĩa Routes + Protected/Admin route
│   ├── main.jsx             # Entry: BrowserRouter, AuthProvider, App
│   └── index.css            # Tailwind + custom
├── index.html
├── vite.config.js
└── tailwind.config.js
```

**Ý nghĩa cách tổ chức:**

- **api/**: Tách hết gọi HTTP ra đây. UI chỉ gọi `productService.getList()`, không biết URL hay axios. Dễ đổi API sau này.
- **components/**: Thành phần dùng lại (Layout, Form, Section).
- **pages/**: Mỗi trang tương ứng một URL; trang thường gọi service rồi set state và render.
- **context/**: AuthContext cung cấp `user`, `login`, `logout` cho toàn app.
- **constants/**: Đường dẫn, label, config gom một chỗ, tránh hardcode.

---

### 2.2. Các file quan trọng – chạy theo thứ tự nào

**Entry:**

1. **`index.html`**  
   Có thẻ `<div id="root">`. Toàn bộ React render vào đây.

2. **`main.jsx`**  
   - Import React, ReactDOM, BrowserRouter, App, AuthProvider, CSS.  
   - `ReactDOM.createRoot(document.getElementById('root')).render(...)`.  
   - Bọc cây: `BrowserRouter` → `AuthProvider` → `App`.  
   - **Thứ tự**: Router bọc ngoài để `useNavigate`, `Route` hoạt động; AuthProvider bọc App để mọi component có thể `useAuth()`.

3. **`App.jsx`**  
   - Dùng `useNavigate()` và gán vào `navigateRef.current` (để axios interceptor có thể redirect khi 401).  
   - Định nghĩa `<Routes>` và `<Route>`.  
   - Một số route bọc bởi `ProtectedRoute` (cần đăng nhập) hoặc `AdminRoute` (cần admin).  
   - **Luồng**: URL thay đổi → Router so khớp Route → render component tương ứng (ví dụ `Products`, `Login`).

**Luồng dữ liệu điển hình:**

- User mở `/products` → Router render `Products` → `Products` gọi `productService.getList()` → axios gửi `GET /api/products` → Backend trả JSON → `setProducts(data)` → component render lại với danh sách sản phẩm.

---

### 2.3. Component chính – làm gì

| Component | Vai trò |
|-----------|--------|
| **Layout** | Bọc các trang công khai: render Header, `<Outlet />` (nội dung con), Footer. |
| **Header** | Logo, search, nav links, menu user (Login/Profile/Admin/Logout). Dùng `useAuth()` để hiển thị đúng trạng thái. |
| **Footer** | Link footer lấy từ `FOOTER_COLUMNS`, `FOOTER_LEGAL_LINKS`, `SOCIAL_LINKS`. |
| **Home** | Trang chủ: chỉ compose các section (Hero, USP, Category, Highlight, RelatedProducts, Services). |
| **HeroSection** | Banner lớn + CTA “Shop now”, config từ `homeConfig.js`. |
| **CategoryShowcase** | Grid 4 category (Face, Makeup, Body, Men), mỗi card link tới `/products?category=face` (v.v.). |
| **RelatedProductsSection** | Section “Beauty Must Have”: gọi `productService.getList({ beautyMustHave: true })`, render grid sản phẩm. |
| **Products** | Trang danh sách: đọc `?category` từ URL, gọi `getList({ category })` hoặc `getList()`, hiển thị tab category + grid. |
| **ProductDetail** | Trang chi tiết một sản phẩm: `getById(id)` từ `useParams()`, hiển thị ảnh, tên, giá, mô tả. |
| **Login / Register** | Form email/password (và name với Register); submit gọi `login`/`register` từ AuthContext; sau khi thành công redirect. |
| **Profile** | Form sửa tên; gọi `userService.getProfile()` khi vào trang, `userService.updateProfile({ name })` khi submit; cập nhật AuthContext qua `updateUser`. |
| **AdminLayout** | Layout admin: sidebar (Dashboard, Products, Users, Logout), `<Outlet />` cho nội dung con. |
| **AdminProducts** | Bảng sản phẩm; nút Add mở ProductForm (create), Edit mở ProductForm (update); gọi `productService.getList()`, `create`, `update`, `delete`. |
| **ProductForm** | Modal form: name, description, price, category (select), image, isBeautyMustHave (checkbox). Nhận `initial` khi edit, `onSubmit(payload)` để parent gọi API. |

---

### 2.4. State, props, hooks

- **State (useState)**: Dữ liệu thay đổi theo thời gian trong một component (ví dụ `products`, `loading`, `email` trong form). Set state → React render lại.
- **Props**: Dữ liệu cha truyền xuống con (ví dụ `ProductForm` nhận `initial`, `onSubmit`, `onClose`). Con không sửa props; muốn thay đổi thì gọi callback (ví dụ `onSubmit(payload)`).
- **useEffect**: “Làm gì đó khi dependency đổi” (ví dụ khi mount hoặc khi `category` đổi). Dùng để fetch API: trong effect gọi service, trong `.then()` gọi `setState`; cleanup `cancelled = true` để tránh setState sau khi component đã unmount.
- **useContext (useAuth)**: Đọc `user`, `login`, `logout` từ AuthProvider mà không cần truyền props qua từng tầng.
- **useNavigate, useSearchParams, useParams**: Lấy thông tin từ URL (điều hướng, query `?category=`, param `:id`).

**Ví dụ ngắn – form submit:**

- User nhập email/password và bấm “Log in”.
- `handleSubmit` gọi `e.preventDefault()` (tránh reload trang).
- Gọi `login(email, password)` từ AuthContext.
- AuthContext bên trong gọi `authService.login(email, password)` → axios `POST /api/auth/login`.
- Backend trả `{ data: { user, token } }`; AuthContext lưu token + user vào localStorage và `setUser(u)`.
- Component Login dùng `navigate(...)` để chuyển trang. Dữ liệu “đã đăng nhập” đi qua context, không qua props.

---

### 2.5. Routing

- **React Router** (BrowserRouter trong `main.jsx`): Khớp URL với `<Route path="..." element={...} />`.
- **Cấu trúc trong App.jsx**:
  - `/` dùng Layout, bên trong có index (Home), `products`, `products/:id`, `login`, `register`, `profile` (bọc ProtectedRoute).
  - `/admin` bọc AdminRoute; bên trong AdminLayout có `dashboard`, `products`, `users`.
  - `*` → Navigate to `/`.
- **ProtectedRoute**: Nếu chưa đăng nhập → `<Navigate to="/login" />`. Nếu đã đăng nhập → render `children`.
- **AdminRoute**: Nếu chưa đăng nhập → redirect login; nếu không phải admin → redirect `/`. Chỉ admin mới thấy nội dung admin.

---

### 2.6. Form submit và gọi API

- **Form submit**: Trong form, `onSubmit={handleSubmit}`. Trong `handleSubmit`: `e.preventDefault()`, lấy giá trị từ state (hoặc ref), gọi API hoặc context (login/register/updateProfile/create/update product), xử lý lỗi và success (Toast, redirect, đóng modal).
- **Gọi API ở đâu**: Trong **service** (`authService`, `userService`, `productService`, `adminService`). Page hoặc component gọi service (ví dụ `productService.getList({ category })`). Service dùng `api` (axios instance) để gửi request.
- **Dữ liệu từ backend lên UI**: Service trả về Promise; component dùng `.then((data) => setProducts(data))` (hoặc tương tự). Khi state đổi, component render lại và hiển thị list/chi tiết (map products ra thẻ, hiển thị product.name, product.price, v.v.).

---

## 3. Backend

### 3.1. Cấu trúc thư mục

```
backend/
├── config/
│   └── index.js          # Đọc .env (port, MONGODB_URI, JWT_SECRET, ...)
├── constants/
│   └── product.js        # PRODUCT_CATEGORIES ['face','makeup','body','men']
├── controllers/          # Xử lý từng loại request (auth, user, product, admin)
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   └── adminController.js
├── middleware/           # Chạy trước hoặc sau controller
│   ├── auth.js           # protect: kiểm tra JWT, gán req.user
│   ├── admin.js          # adminOnly: kiểm tra req.user.role === 'admin'
│   ├── errorHandler.js   # Bắt lỗi, trả JSON thống nhất
│   └── validateObjectId.js  # Kiểm tra req.params.id là ObjectId hợp lệ
├── models/               # Mongoose schema (User, Product)
│   ├── User.js
│   └── Product.js
├── routes/               # Gắn URL với controller
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── adminRoutes.js
├── validators/           # express-validator: kiểm tra body/query
│   ├── authValidator.js
│   ├── userValidator.js
│   └── productValidator.js
├── utils/
│   └── response.js       # success(), error() format JSON
├── app.js                # Express app: cors, json, mount routes, errorHandler
└── server.js             # Kết nối MongoDB, listen(port)
```

Project này **không** tách lớp Service hay Repository riêng. Controller gọi trực tiếp Model (Mongoose). Validator là middleware dùng express-validator.

**Khái niệm nhanh:**

- **Controller**: Hàm nhận `(req, res, next)`. Đọc `req.body`, `req.params`, `req.user`; gọi Model; gửi `res.json(...)` hoặc `next(err)`.
- **Model**: Định nghĩa cấu trúc và hành vi dữ liệu (schema Mongoose); `User.create()`, `Product.find()`, v.v.
- **Entity**: Trong project này chính là document MongoDB (user, product) – được map từ schema Mongoose.
- **DTO**: Không có lớp DTO tách riêng; dữ liệu vào/ra là object thường (req.body, res.json(data)). Validator đảm bảo body đúng format.

---

### 3.2. Luồng xử lý một request

Ví dụ: **POST /api/products** (admin thêm sản phẩm).

1. **Express nhận request**  
   app.js đã mount `app.use('/api/products', productRoutes)`.

2. **productRoutes.js**  
   Route: `router.post('/', protect, adminOnly, createProductValidation, productValidate, createProduct)`.

3. **Thứ tự chạy**:
   - **protect**: Đọc header `Authorization: Bearer <token>`, verify JWT, tìm User theo `decoded.id`, gán `req.user`. Nếu không token hoặc sai → 401, dừng.
   - **adminOnly**: Nếu `req.user.role !== 'admin'` → 403, dừng.
   - **createProductValidation**: Middleware express-validator thêm các rule vào request (chưa trả response).
   - **productValidate**: Đọc `validationResult(req)`; nếu có lỗi → 400 với message đầu tiên, dừng.
   - **createProduct**: Controller: `const body = { ...req.body }`, chuẩn hóa `isBeautyMustHave`, `Product.create(body)`, trả `res.status(201).json({ success: true, message, data: product })`.

4. **Nếu có lỗi** (từ `next(err)` trong controller): **errorHandler** bắt: CastError → 400, ValidationError → 400, duplicate key → 400, còn lại → 500; trả JSON `{ success: false, message }`.

---

### 3.3. Validation và exception

- **Validation**: Dùng **express-validator** trong `validators/*.js`. Ví dụ `body('email').isEmail()`, `body('category').isIn(PRODUCT_CATEGORIES)`. Sau khi chạy hết rule, middleware `validate` gọi `validationResult(req)`; nếu không empty thì trả 400 và không gọi controller.
- **Exception**: Controller dùng `try/catch`; khi lỗi gọi `next(err)`. errorHandler xử lý:
  - Mongoose CastError (id sai) → 400.
  - Mongoose ValidationError (schema/unique) → 400.
  - Code 11000 (trùng unique) → 400.
  - Còn lại: statusCode từ err hoặc 500, message từ err hoặc "Server error"; development có thể gửi kèm stack.

---

### 3.4. Auth (JWT)

- **Đăng ký / Đăng nhập**: authController tạo user hoặc kiểm tra password, rồi gọi `jwt.sign({ id: user._id }, secret, { expiresIn })` → trả token + user (không trả password).
- **Bảo vệ route**: Middleware `protect` đọc `Authorization: Bearer <token>`, `jwt.verify(token, secret)`, lấy `decoded.id`, `User.findById(decoded.id)` → gán `req.user`. Request sau đó có thể dùng `req.user.id`, `req.user.role`.
- **Phân quyền**: Middleware `adminOnly` kiểm tra `req.user.role === 'admin'`; không phải admin thì 403.

---

### 3.5. Dữ liệu lưu xuống database

- Controller gọi Mongoose: `User.create(...)`, `Product.findByIdAndUpdate(...)`, `Product.find(filter)`, v.v.
- Mongoose map schema (models/User.js, Product.js) sang collection MongoDB: `users`, `products`. Schema quy định field, type, required, enum; pre-save (ví dụ hash password) chạy trước khi lưu. Dữ liệu từ `req.body` được validate bởi validator và (với create) có thể chuẩn hóa trong controller (ví dụ Boolean(isBeautyMustHave)) rồi đưa vào Model.

---

## 4. Database

### 4.1. MongoDB và Mongoose

- **MongoDB**: NoSQL, lưu document (JSON-like). Mỗi “bảng” gọi là **collection**.
- **Mongoose**: Thư viện Node.js để nói chuyện với MongoDB: định nghĩa **schema** (field, type, required, default), tạo **model** (tên collection thường là số nhiều, chữ thường: User → `users`, Product → `products`).

### 4.2. Các collection chính

**users**

- `_id`: ObjectId (MongoDB tạo).
- `name`: String, required, max 50.
- `email`: String, required, unique, lowercase.
- `password`: String, required, min 6; **select: false** (mặc định không trả về khi query).
- `role`: String, enum ['user','admin'], default 'user'.
- `createdAt`: Date, default Date.now.

Quan hệ: Project không có bảng “order” hay “cart”; không có quan hệ khóa ngoại với collection khác. Admin và user đều nằm chung collection `users`, phân biệt bằng `role`.

**products**

- `_id`: ObjectId.
- `name`, `description`, `price` (Number, min 0).
- `category`: String, enum ['face','makeup','body','men'], required, lowercase.
- `image`: String (URL hoặc path).
- `isBeautyMustHave`: Boolean, default false (hiển thị ở section Beauty Must Have trên homepage).
- `createdAt`: Date.

Không có quan hệ tham chiếu tới users (không lưu “user tạo sản phẩm” trong schema hiện tại). Dữ liệu từ backend map xuống: khi gọi `Product.create(body)`, Mongoose validate theo schema rồi insert một document vào collection `products`.

---

### 4.3. Quan hệ giữa các bảng

- Chỉ có hai collection chính: **users** và **products**.
- Không có foreign key; quan hệ “ai tạo sản phẩm” không lưu trong DB. Phân quyền (admin mới tạo/sửa/xóa sản phẩm) chỉ dựa trên JWT và `req.user.role`.

---

## 5. API

### 5.1. Base URL và CORS

- Backend chạy ví dụ tại `http://localhost:5000`. Frontend (Vite) dùng `VITE_API_URL` hoặc proxy; axios baseURL = `${VITE_API_URL}/api` hoặc `/api`.
- CORS trong app.js cho phép origin frontend (ví dụ `http://localhost:5173`) và `credentials: true` để gửi cookie/header (token thường gửi trong header).

### 5.2. Các endpoint chính

| Method | Endpoint | Mô tả | Request | Response | Frontend dùng ở đâu |
|--------|----------|--------|---------|----------|---------------------|
| POST   | /api/auth/register | Đăng ký | body: name, email, password | { success, message, data: { user, token } } | Register.jsx → AuthContext → authService.register |
| POST   | /api/auth/login    | Đăng nhập | body: email, password | { success, message, data: { user, token } } | Login.jsx → AuthContext → authService.login |
| GET    | /api/users/profile | Xem profile (cần token) | header Authorization | { success, data: user } | Profile.jsx → userService.getProfile() |
| PUT    | /api/users/profile | Cập nhật profile (cần token) | body: name | { success, message, data: user } | Profile.jsx → userService.updateProfile() |
| GET    | /api/products      | Danh sách sản phẩm (public) | query: category, beautyMustHave | { success, data: products[] } | Products.jsx, RelatedProductsSection, AdminProducts, AdminDashboard → productService.getList(params) |
| GET    | /api/products/:id  | Chi tiết sản phẩm (public) | params: id | { success, data: product } | ProductDetail.jsx → productService.getById(id) |
| POST   | /api/products      | Tạo sản phẩm (admin, token) | body: name, description, price, category, image?, isBeautyMustHave? | { success, message, data: product } | AdminProducts → ProductForm onSubmit → productService.create(payload) |
| PUT    | /api/products/:id  | Sửa sản phẩm (admin, token) | body: một phần field cho phép | { success, message, data: product } | AdminProducts → ProductForm onSubmit → productService.update(id, payload) |
| DELETE | /api/products/:id  | Xóa sản phẩm (admin, token) | params: id | { success, message } | AdminProducts → productService.delete(id) |
| GET    | /api/admin/users   | Danh sách user (admin, token) | - | { success, data: users[] } | AdminDashboard, AdminUsers → adminService.getUsers() |
| DELETE | /api/admin/users/:id | Xóa user (admin, token) | params: id | { success, message } | AdminUsers → adminService.deleteUser(id) |

Request: body là JSON (Content-Type: application/json). Token gửi trong header: `Authorization: Bearer <token>`.

Response: Thống nhất dạng `{ success: true|false, message?: string, data?: any }`. Lỗi validation/4xx/5xx đều trả JSON, không trả HTML.

---

## 6. Luồng kết nối Frontend – Backend

1. **User thao tác** (click, submit form) → component gọi context hoặc service (ví dụ `login(email, password)`, `productService.getList({ category })`).
2. **Service** dùng axios instance trong `api/axios.js`: baseURL = `/api`, mỗi request tự gắn header `Authorization: Bearer <token>` nếu có trong localStorage.
3. **Request HTTP** (GET/POST/PUT/DELETE) tới backend (cùng host hoặc VITE_API_URL), backend xử lý (middleware → controller → model) rồi trả JSON.
4. **Axios** trả response; service thường trả `res.data` (đã parse JSON). Component trong `.then(data => ...)` set state (ví dụ setProducts(data)).
5. **React** render lại với state mới → UI cập nhật (danh sách sản phẩm, form đóng, redirect, v.v.).
6. **401**: Axios response interceptor bắt 401 → gọi `authRef.current.logout()` (xóa token + user) và `navigateRef.current('/login')` để chuyển về trang đăng nhập mà không reload trang.

---

## 7. Luồng hoạt động từng bước (use cases)

### 7.1. Admin thêm sản phẩm (từ frontend → backend → database → lại UI)

1. Admin đăng nhập (role admin), vào `/admin/products`.
2. Bấm “Add product” → mở modal **ProductForm** (initial = null).
3. Nhập name, description, price, chọn category (face/makeup/body/men), image, tick “Beauty Must Have” nếu cần → bấm Save.
4. ProductForm `handleSubmit` gọi `onSubmit({ name, description, price, category, image, isBeautyMustHave })`. AdminProducts truyền `onSubmit={handleCreate}`.
5. **handleCreate** gọi `productService.create(payload)` → axios **POST /api/products** với body JSON và header Authorization.
6. Backend: protect → adminOnly → createProductValidation → productValidate → **createProduct**. createProduct: chuẩn hóa isBeautyMustHave, `Product.create(body)` → Mongoose validate schema rồi **insert một document vào collection products**.
7. Backend trả `201` và `{ success: true, message, data: product }`.
8. Frontend: trong `.then()` của create, AdminProducts gọi `setModal(null)` (đóng form), `fetchProducts()` (gọi lại getList để cập nhật bảng). Danh sách products trong state đổi → bảng render lại với sản phẩm mới. Toast “Product created successfully.” (tùy code).

---

### 7.2. Homepage lấy sản phẩm “Beauty Must Have” hiển thị thế nào

1. User mở `/` → Router render Layout, bên trong index = **Home**.
2. Home render **RelatedProductsSection**.
3. RelatedProductsSection trong **useEffect** (dependency []) gọi `productService.getList({ beautyMustHave: true })`.
4. productService tạo query `?beautyMustHave=true`, gửi **GET /api/products?beautyMustHave=true**.
5. Backend **getProducts**: đọc `req.query.beautyMustHave === 'true'` → `filter.isBeautyMustHave = true`, `Product.find(filter)`, trả JSON.
6. Frontend trong `.then(data => setProducts(data))`; data là mảng sản phẩm có `isBeautyMustHave: true`.
7. Component render lại, map products thành các thẻ (ảnh, tên, giá, link đến product detail). Section “Beauty Must Have” chỉ hiển thị sản phẩm được admin bật trong form.

---

### 7.3. Trang category (ví dụ Face) lọc sản phẩm ra sao

1. User click category “Face” trên homepage (CategoryShowcase) hoặc tab trên trang Products → link tới **/products?category=face**.
2. **Products** page: `useSearchParams().get('category')` → `category = 'face'` (đã validate nằm trong PRODUCT_CATEGORIES).
3. **useEffect** phụ thuộc `category`: gọi `productService.getList({ category: 'face' })` → **GET /api/products?category=face**.
4. Backend **getProducts**: `req.query.category` nằm trong ['face','makeup','body','men'] → `filter.category = 'face'`, `Product.find(filter)`, trả danh sách.
5. Frontend set state products → render grid chỉ gồm sản phẩm category face. Title và mô tả trang có thể hiển thị “Face” / “Products in Face category.”

---

### 7.4. Luồng đăng nhập (login)

1. User vào `/login`, nhập email/password, bấm “Log in”.
2. **handleSubmit** gọi `login(email, password)` từ **useAuth()** (AuthContext).
3. AuthContext **login** gọi `authService.login(email, password)` → axios **POST /api/auth/login** với body `{ email, password }`.
4. Backend **authController.login**: tìm user theo email (select password), so sánh password bằng `user.comparePassword(password)` (bcrypt), tạo JWT bằng `jwt.sign({ id: user._id }, secret, { expiresIn })`, trả `{ user: { id, name, email, role }, token }`.
5. Frontend AuthContext nhận response: lưu token vào localStorage, lưu user (JSON) vào localStorage, `setUser(u)`.
6. Login page có useEffect: khi `user` có giá trị, gọi `navigate(isAdmin ? ROUTES.admin.dashboard : ROUTES.home)`.
7. UI chuyển sang trang chủ hoặc admin dashboard; Header (và mọi component dùng useAuth) nhận user mới nên hiển thị menu đăng nhập (Profile, Admin, Logout).

---

### 7.5. Tóm tắt file/đoạn code quan trọng theo luồng

| Bước | File | Vai trò | Dữ liệu vào / ra |
|------|------|--------|-------------------|
| User submit form Login | `Login.jsx` | handleSubmit gọi useAuth().login(email, password) | Vào: email, password từ state. Ra: (không return trực tiếp) AuthContext lưu token + user. |
| Gửi request login | `authService.js` | api.post('/auth/login', { email, password }) | Vào: email, password. Ra: Promise → res.data { success, data: { user, token } }. |
| Gắn token mọi request | `axios.js` | interceptor request: config.headers.Authorization = `Bearer ${token}` | Vào: config. Ra: config đã có header. |
| Backend nhận login | `authRoutes.js` → `authController.js` | loginValidation, validate, login | Vào: req.body { email, password }. Ra: res.json({ success, data: { user, token } }). |
| Lấy danh sách sản phẩm | `Products.jsx` | useEffect → productService.getList({ category }) | Vào: category từ useSearchParams. Ra: setProducts(data) → UI render grid. |
| Service getList | `productService.js` | api.get(`/products?category=...`) | Vào: params { category?, beautyMustHave? }. Ra: res.data.data (mảng products). |
| Backend getProducts | `productController.js` | getProducts: build filter từ query, Product.find(filter) | Vào: req.query.category, req.query.beautyMustHave. Ra: res.json({ success, data: products }). |
| Admin tạo sản phẩm | `ProductForm.jsx` | handleSubmit → onSubmit({ name, description, price, category, image, isBeautyMustHave }) | Vào: state (form). Ra: parent nhận payload và gọi productService.create(payload). |
| Backend create product | `productController.js` | createProduct: Product.create(body) | Vào: req.body (đã qua validator). Ra: res.status(201).json({ success, data: product }). DB: insert 1 document vào collection products. |

---

## 8. Tổng kết và gợi ý học

### 8.1. Frontend hoạt động thế nào

- **Entry**: main.jsx mount App vào #root, bọc BrowserRouter và AuthProvider.
- **Routing**: App.jsx định nghĩa Routes; URL quyết định component nào được render (Home, Products, Login, AdminProducts, ...).
- **Trang**: Mỗi page thường gọi service (productService, authService, ...) để lấy/cập nhật dữ liệu, lưu vào state, render UI. Form submit → gọi service hoặc context → cập nhật state hoặc redirect.
- **Auth**: AuthContext lưu user + token (và đồng bộ localStorage); ProtectedRoute/AdminRoute dựa vào context để chặn hoặc cho phép route. Axios tự gắn token; interceptor 401 logout và redirect login.

### 8.2. Backend hoạt động thế nào

- **server.js**: Kết nối MongoDB, sau đó listen(port). Mọi request vào Express app (app.js).
- **app.js**: CORS, parse JSON, mount từng nhóm route (/api/auth, /api/users, /api/products, /api/admin), cuối cùng errorHandler.
- **Mỗi request**: Đi qua route → middleware (protect, adminOnly, validator) → controller. Controller đọc req, gọi Model (Mongoose), trả res.json(). Lỗi đưa cho errorHandler trả JSON lỗi.

### 8.3. Frontend và Backend kết nối thế nào

- **HTTP + JSON**: Frontend gửi GET/POST/PUT/DELETE tới baseURL + path (ví dụ POST /api/products), body là JSON. Backend trả JSON `{ success, message?, data? }`.
- **Token**: Sau login/register, frontend lưu token; mỗi request (trừ login/register) gửi header `Authorization: Bearer <token>`. Backend middleware protect verify token và gán req.user.
- **Luồng dữ liệu**: User thao tác → component gọi service → axios gửi request → backend xử lý và có thể đọc/ghi MongoDB → response JSON → component set state → UI cập nhật.

### 8.4. Người mới học nên nắm trước những gì

1. **Frontend**: Cấu trúc React (component, state, props), useEffect (fetch khi mount hoặc khi dependency đổi), form controlled (value + onChange), React Router (Route, Link, useNavigate, useParams, useSearchParams), Context (AuthContext, useAuth). Biết service layer chỉ là hàm gọi axios và trả Promise.
2. **Backend**: Express (app.use, router, middleware, req/res/next), thứ tự middleware (auth → validate → controller), JWT (tạo token khi login, verify trong protect), Mongoose (schema, model, find/create/update/delete). Hiểu validator dùng để từ chối request sai format trước khi vào controller.
3. **Chung**: REST API (method + path + body/query), JSON request/response, CORS, cách frontend gắn token và backend đọc token từ header.

File này có thể đặt trong repo (ví dụ `docs/PROJECT_GUIDE.md`) và dùng làm tài liệu onboarding hoặc ôn tập cho người mới học full-stack.
