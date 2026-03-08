# ProductHub – Website quản lý & giới thiệu sản phẩm

## 1. Tên project

**ProductHub** – Ứng dụng web full-stack để giới thiệu sản phẩm, đăng ký/đăng nhập người dùng và quản trị nội dung (sản phẩm, user) dành cho admin.

---

## 2. Giới thiệu ngắn về website

ProductHub là một **website bán hàng / giới thiệu sản phẩm** (theo phong cách mỹ phẩm – beauty). Khách truy cập có thể xem trang chủ, danh sách sản phẩm, chi tiết sản phẩm; đăng ký và đăng nhập để quản lý hồ sơ. Admin có thể đăng nhập vào khu vực quản trị để thêm/sửa/xóa sản phẩm, xem và quản lý người dùng, cũng như xem danh sách đăng ký newsletter.

Website gồm hai phần chạy tách biệt: **Frontend** (React, giao diện người dùng) và **Backend** (Node.js + Express, API và kết nối database MongoDB).

---

## 3. Mục tiêu của website

- **Trình bày sản phẩm:** Trang chủ bắt mắt, danh sách sản phẩm có tìm kiếm/lọc, trang chi tiết từng sản phẩm.
- **Quản lý tài khoản:** Người dùng đăng ký, đăng nhập, xem và chỉnh sửa hồ sơ cá nhân.
- **Quản trị nội dung:** Admin quản lý sản phẩm (CRUD), quản lý user và xem subscribers (newsletter).
- **Mở rộng sau này:** Dễ thêm giỏ hàng, thanh toán, đơn hàng khi bạn học thêm.

---

## 4. Các tính năng chính

- **Trang chủ:** Hero, danh mục (Face, Makeup, Body, Men), sản phẩm nổi bật, khối dịch vụ, banner khuyến mãi.
- **Sản phẩm:** Xem danh sách (có tìm kiếm, lọc theo danh mục), xem chi tiết từng sản phẩm.
- **Xác thực:** Đăng ký, đăng nhập, đăng xuất; bảo vệ route (trang cá nhân, admin) bằng JWT.
- **Hồ sơ:** Trang profile – xem và cập nhật thông tin cá nhân (đã đăng nhập).
- **Khu vực Admin:** Dashboard, quản lý sản phẩm (thêm/sửa/xóa), quản lý user, xem danh sách đăng ký newsletter.
- **Newsletter:** Form đăng ký nhận tin (footer) – lưu vào database qua API.
- **Giao diện:** Header (logo, search, menu), footer nhiều cột, responsive, dùng Tailwind CSS.

---

## 5. Công nghệ sử dụng

| Thành phần   | Công nghệ |
|-------------|-----------|
| **Frontend** | React 18, React Router, Vite, Tailwind CSS, Axios |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Xác thực** | JWT (jsonwebtoken), bcryptjs |
| **Kiểm tra dữ liệu** | express-validator (backend) |

- **Frontend:** JavaScript (ES modules), JSX, CSS.
- **Backend:** JavaScript (ES modules), REST API (JSON).
- **Deploy (gợi ý):** MongoDB Atlas, Render (backend), Vercel (frontend) – chi tiết trong [Cách deploy](#10-cách-deploy-website).

---

## 6. Cấu trúc thư mục project

```
WEB_INTERN/
├── backend/                    # API Node.js + Express
│   ├── config/                 # Cấu hình (port, MongoDB, JWT)
│   ├── controllers/           # Xử lý logic (auth, user, product, admin, newsletter)
│   ├── middleware/             # auth, admin, errorHandler, validateObjectId
│   ├── models/                 # Mongoose (User, Product, Subscriber)
│   ├── routes/                 # Định nghĩa API (auth, user, product, admin, newsletter)
│   ├── scripts/                # seed.js – tạo dữ liệu mẫu
│   ├── utils/                  # Hàm trả response chuẩn
│   ├── validators/             # express-validator (auth, user, product, subscriber)
│   ├── app.js                  # Express app (cors, routes, error handler)
│   ├── server.js               # Khởi chạy server + kết nối MongoDB
│   ├── .env.example            # Mẫu biến môi trường
│   └── package.json
│
├── frontend/                   # Ứng dụng React (Vite)
│   ├── public/                 # File tĩnh (favicon, v.v.)
│   ├── src/
│   │   ├── api/                # Axios instance + services (auth, user, product, admin, newsletter)
│   │   ├── components/         # Header, Footer, Layout, Toast, LoadingSpinner, sections trang chủ, admin
│   │   ├── context/            # AuthContext (user, login, logout)
│   │   ├── constants/          # ROUTES, APP_NAME, menu, footer, homeConfig (nội dung trang chủ)
│   │   ├── pages/              # Home, Products, ProductDetail, Login, Register, Profile, admin/*
│   │   ├── App.jsx             # Định nghĩa Routes
│   │   ├── main.jsx            # Entry: Router, AuthProvider, App
│   │   └── index.css           # Tailwind + custom
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js      # Màu brand, primary
│   ├── .env.example            # VITE_API_URL
│   └── package.json
│
├── docs/                       # Tài liệu (backend, frontend, kiến trúc, hướng dẫn)
├── DEPLOY.md                   # Hướng dẫn deploy chi tiết (Atlas, Render, Vercel)
└── README.md                   # File này
```

---

## 7. Cách chạy project ở local

### Yêu cầu

- **Node.js** (khuyến nghị phiên bản LTS, ví dụ 18 hoặc 20).
- **MongoDB** chạy trên máy (hoặc dùng MongoDB Atlas và điền connection string vào `.env`).

### Bước 1: Cài đặt và chạy Backend

```bash
cd backend
cp .env.example .env
```

Mở file `.env` và chỉnh:

- `MONGODB_URI`: Nếu dùng MongoDB local: `mongodb://localhost:27017/product_management`. Nếu dùng Atlas: dán connection string (có tên database, ví dụ `product_management`).
- `JWT_SECRET`: Đặt một chuỗi bí mật bất kỳ (ví dụ: `mySecretKey123`).
- `PORT`: Mặc định `5000`. Nếu port 5000 bị chiếm, đổi thành `5001` (và nhớ đổi `VITE_API_URL` ở frontend cho đúng).
- `FRONTEND_URL`: Giữ `http://localhost:5173` khi chạy local.

Sau đó:

```bash
npm install
npm start
```

Nếu chạy thành công, terminal sẽ hiện: `✓ Đã kết nối MongoDB` và `✓ Server chạy tại http://localhost:5000`.

*(Tùy chọn)* Tạo dữ liệu mẫu (admin + sản phẩm):

```bash
npm run seed
```

### Bước 2: Cài đặt và chạy Frontend

Mở terminal mới:

```bash
cd frontend
cp .env.example .env
```

Trong `.env` đặt:

- `VITE_API_URL=http://localhost:5000` (hoặc port bạn dùng cho backend).

Rồi chạy:

```bash
npm install
npm run dev
```

Trình duyệt mở `http://localhost:5173`. Bạn có thể đăng ký tài khoản mới hoặc dùng tài khoản admin từ seed (xem trong `backend/scripts/seed.js`) để vào khu vực Admin.

### Lưu ý khi chạy local

- **Port 5000 đã bị dùng:** Đổi `PORT` trong `backend/.env` (ví dụ `5001`) và `VITE_API_URL` trong `frontend/.env` tương ứng. Hoặc tắt process đang chiếm port 5000 (trên Windows: `netstat -ano | findstr :5000` để tìm PID, rồi `taskkill /PID <PID> /F`).
- **Lỗi CORS:** Đảm bảo `FRONTEND_URL` trong backend đúng với địa chỉ frontend (ví dụ `http://localhost:5173`).

---

## 8. Cách sử dụng website

- **Khách:** Vào trang chủ, xem sản phẩm, bấm vào từng sản phẩm để xem chi tiết. Có thể đăng ký newsletter ở footer.
- **Người dùng:** Đăng ký → Đăng nhập. Sau khi đăng nhập có thể vào **Hồ sơ** (icon user trên header) để xem và sửa thông tin.
- **Admin:** Đăng nhập bằng tài khoản có quyền admin (sau khi chạy `npm run seed` sẽ có sẵn). Vào menu user → chọn **Admin** → vào Dashboard, **Quản lý sản phẩm**, **Quản lý user**, **Quản lý subscribers** (newsletter).
- **Tìm kiếm:** Dùng ô tìm kiếm trên header, nhập từ khóa rồi Enter sẽ chuyển sang trang sản phẩm với bộ lọc tìm kiếm.
- **Logo:** Bấm logo trên header để về trang chủ.

---

## 9. Cách chỉnh sửa nội dung, hình ảnh, màu sắc, bố cục

### Nội dung và đường dẫn (menu, footer, trang chủ)

- **Tên website, logo, menu header/footer, đường dẫn:** Sửa trong `frontend/src/constants/index.js`:
  - `APP_NAME`: Tên hiển thị khi không dùng logo.
  - `HEADER_LOGO`: Đường dẫn logo (file trong `frontend/public/`, ví dụ `'/img/header_img/logo.svg'`). Để `''` thì header hiển thị chữ `APP_NAME`.
  - `HEADER_NAV_LEFT`, `HEADER_NAV_RIGHT`: Các mục menu (label, link `to`).
  - `FOOTER_COLUMNS`, `FOOTER_LEGAL_LINKS`, `SOCIAL_LINKS`: Nội dung footer.
- **Trang chủ (hero, danh mục, khuyến mãi, dịch vụ):** Sửa trong `frontend/src/constants/homeConfig.js`:
  - `ANNOUNCEMENT`, `HERO` (title, subtitle, nút, ảnh), `USP_ITEMS`, `CATEGORIES`, `HIGHLIGHT_PROMO`, `SERVICES`. Ảnh có thể dùng URL ngoài hoặc file trong `public/`.

### Hình ảnh

- **Logo header:** Đặt file trong `frontend/public/` (ví dụ `public/img/header_img/logo.svg`) rồi trong `constants/index.js` set `HEADER_LOGO = '/img/header_img/logo.svg'`.
- **Ảnh trang chủ:** Trong `homeConfig.js` có thể đổi `image` của từng block (URL hoặc đường dẫn trong `public/`).

### Màu sắc

- Màu chủ đạo (brand, primary) nằm trong `frontend/tailwind.config.js`, mục `theme.extend.colors`:
  - `brand`: Màu đỏ chủ đạo (mặc định `#C00021`). Dùng trong class Tailwind: `bg-brand`, `text-brand`, `hover:bg-brand-600`, v.v.
  - `primary`: Dải màu xanh (dùng cho nút, link admin, v.v.).
- Có thể thêm màu mới trong `colors` rồi dùng trong component bằng class như `bg-tênMàu-500`.

### Bố cục (layout)

- **Header:** `frontend/src/components/Header.jsx` – sắp xếp search, logo, menu, icon user/wishlist/cart.
- **Footer:** `frontend/src/components/Footer.jsx` – số cột và nội dung lấy từ `constants/index.js`.
- **Trang chủ:** Các section nằm trong `frontend/src/components/home/` (HeroSection, CategoryShowcase, RelatedProductsSection, v.v.) và được gọi trong `frontend/src/pages/Home.jsx`. Có thể ẩn/hiện hoặc đổi thứ tự section trong `Home.jsx`.

---

## 10. Cách deploy website

Project được thiết kế để deploy tách phần: **Database** (MongoDB Atlas), **Backend** (Render), **Frontend** (Vercel). Hướng dẫn chi tiết từng bước nằm trong file **`DEPLOY.md`** trong thư mục gốc project.

**Tóm tắt:**

1. **MongoDB Atlas:** Tạo cluster, lấy connection string, cấu hình Network Access (cho phép từ mọi nơi hoặc IP Render).
2. **Backend (Render):** Tạo Web Service, root directory `backend`, Build: `npm install`, Start: `npm start`. Thêm biến môi trường: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `FRONTEND_URL` (sẽ điền sau khi có URL Vercel).
3. **Frontend (Vercel):** Import repo, root directory `frontend`, Framework: Vite. Thêm biến `VITE_API_URL` = URL backend Render (không dấu `/` cuối). Deploy xong lấy URL.
4. **Cập nhật Backend:** Vào Render → Environment → đặt `FRONTEND_URL` = URL Vercel (để CORS đúng).
5. **Dữ liệu mẫu / admin:** Chạy seed từ máy local với `MONGODB_URI` trỏ tới Atlas (trong `.env` tạm), hoặc tạo admin thủ công qua API/register rồi set role admin trong database.

Sau khi xong, người dùng truy cập qua URL Vercel; frontend gọi API qua URL Render; backend kết nối MongoDB Atlas.

---

## 11. Hướng phát triển thêm trong tương lai

- **Giỏ hàng:** Lưu sản phẩm vào giỏ (localStorage hoặc API), trang giỏ hàng, cập nhật số lượng.
- **Đơn hàng:** Tạo đơn hàng, lưu vào MongoDB, trang “Đơn hàng của tôi” và trang admin quản lý đơn.
- **Thanh toán:** Tích hợp cổng thanh toán (VNPay, Stripe, v.v.) hoặc đơn giản: “Đặt hàng” → lưu trạng thái chờ xử lý.
- **Phân quyền rõ hơn:** Phân role (user, admin, moderator), bảo vệ API theo role.
- **Tìm kiếm & lọc nâng cao:** Lọc theo giá, danh mục con, sắp xếp (mới nhất, giá tăng/giảm).
- **Upload ảnh sản phẩm:** Thay ảnh URL bằng upload file (Cloudinary, S3, hoặc lưu trên server).
- **Email:** Gửi email xác nhận đăng ký, đặt hàng, hoặc newsletter (Nodemailer, SendGrid, v.v.).
- **SEO & hiệu năng:** Meta tags động, lazy load ảnh, tối ưu build (Vite đã hỗ trợ tốt).

---

## 12. Lưu ý cho người mới học

- **Đọc code theo luồng:** Bắt đầu từ `frontend/src/main.jsx` → `App.jsx` (routes) → một trang đơn giản (ví dụ `Login.jsx`) và service tương ứng (`authService.js`). Backend: `server.js` → `app.js` → `routes` → `controllers` → `models`.
- **Đừng commit file `.env`:** File `.env` chứa mật khẩu và bí mật, đã được thêm vào `.gitignore`. Chỉ copy `.env.example` sang `.env` trên máy mình hoặc cấu hình biến môi trường trên Render/Vercel.
- **Lỗi “address already in use”:** Port (ví dụ 5000) đang bị process khác dùng. Đổi port trong `.env` hoặc tắt process đó (xem mục [Cách chạy project](#7-cách-chạy-project-ở-local)).
- **Sửa constants trước khi sửa nhiều file:** Tên app, menu, footer, nội dung trang chủ đều gom trong `constants/` và `homeConfig.js` – sửa một chỗ là áp dụng toàn site.
- **Tailwind:** Class như `bg-brand`, `text-gray-600` được Tailwind sinh ra từ `tailwind.config.js` và `index.css`. Nếu thêm màu mới thì cấu hình trong `tailwind.config.js`.
- **API và CORS:** Frontend (domain/port khác backend) gọi API nên backend cần cấu hình CORS (`FRONTEND_URL`). Khi deploy, nhớ đặt đúng URL frontend thật trong biến môi trường backend.
- **Tài liệu thêm:** Thư mục `docs/` có các file như `PROJECT_GUIDE.md`, `ARCHITECTURE.md`, `frontend.md`, `backend.md` – nên đọc để hiểu sâu hơn về cấu trúc và luồng dữ liệu.


