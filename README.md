# Hệ thống quản lý sản phẩm - MERN Stack

Dự án fullstack production-ready: React (Vite) + Node.js (Express) + MongoDB (Mongoose). Có đăng ký/đăng nhập JWT, phân quyền user/admin, CRUD sản phẩm, dashboard admin.

## Cấu trúc thư mục

```
WEB_INTERN/
├── backend/                 # Node.js + Express API
│   ├── config/              # Biến môi trường
│   ├── controllers/         # auth, user, product, admin
│   ├── middleware/          # auth (JWT), admin, errorHandler, validateObjectId
│   ├── models/              # User, Product (Mongoose)
│   ├── routes/              # auth, user, product, admin
│   ├── utils/               # response helpers
│   ├── validators/          # express-validator
│   ├── scripts/seed.js
│   ├── app.js, server.js, package.json, .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # axios + services (productService, authService, userService, adminService)
│   │   ├── components/      # Layout, Navbar, Footer, Toast, admin/*
│   │   ├── constants/       # APP_NAME, ROUTES
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Home, Products, ProductDetail, Login, Register, Profile, admin/*
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, package.json, vite.config.js, tailwind.config.js, .env.example
├── docs/                    # frontend.md, backend.md, ARCHITECTURE.md
└── README.md
```

Chi tiết kiến trúc và lộ trình nâng cấp: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Yêu cầu

- Node.js 18+
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

## Kết nối MongoDB

### Cách 1: MongoDB local

1. Cài đặt MongoDB Community: https://www.mongodb.com/try/download/community  
2. Chạy MongoDB service (trên Windows: service MongoDB, trên Mac/Linux: `mongod`).  
3. Trong `backend/.env` đặt:

```env
MONGODB_URI=mongodb://localhost:27017/product_management
```

### Cách 2: MongoDB Atlas

1. Tạo tài khoản tại https://www.mongodb.com/cloud/atlas  
2. Tạo cluster (free tier), lấy **Connection String**.  
3. Thay `<password>` bằng mật khẩu user database, đặt trong `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/product_management?retryWrites=true&w=majority
```

## Cài đặt và chạy

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Chỉnh .env: PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE
npm run dev
```

Server chạy tại: **http://localhost:5000**

### 2. Tạo dữ liệu mẫu (admin + sản phẩm)

Sau khi backend đã chạy và kết nối MongoDB thành công, mở terminal mới:

```bash
cd backend
node scripts/seed.js
```

Sẽ tạo:

- **Admin:** email `admin@example.com`, mật khẩu `admin123`  
- **3 sản phẩm mẫu** (nếu collection products trống)

### 3. Frontend

```bash
cd frontend
npm install
# Nếu chạy API ở domain/port khác, tạo .env và set VITE_API_URL (hoặc dùng proxy trong vite.config.js)
npm run dev
```

Ứng dụng chạy tại: **http://localhost:5173**

## Biến môi trường

### Backend (`.env`)

| Biến          | Mô tả                          |
|---------------|---------------------------------|
| PORT          | Port server (mặc định 5000)     |
| MONGODB_URI   | Connection string MongoDB       |
| JWT_SECRET    | Secret ký JWT (nên đổi khi deploy) |
| JWT_EXPIRE    | Thời hạn token (vd: 7d)         |

### Frontend (`.env`)

| Biến           | Mô tả |
|----------------|--------|
| VITE_API_URL   | URL backend (vd: http://localhost:5000). Để trống nếu dùng proxy Vite. |

Vite đã cấu hình proxy `/api` → `http://localhost:5000`, nên khi chạy dev cùng máy có thể không cần `VITE_API_URL`.

## API chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST   | /api/auth/register | Đăng ký |
| POST   | /api/auth/login    | Đăng nhập |
| GET    | /api/users/profile | Xem profile (cần token) |
| PUT    | /api/users/profile | Cập nhật profile (cần token) |
| GET    | /api/products      | Danh sách sản phẩm |
| GET    | /api/products/:id  | Chi tiết sản phẩm |
| POST   | /api/products      | Tạo sản phẩm (admin) |
| PUT    | /api/products/:id  | Sửa sản phẩm (admin) |
| DELETE | /api/products/:id  | Xóa sản phẩm (admin) |
| GET    | /api/admin/users   | Danh sách user (admin) |
| DELETE | /api/admin/users/:id | Xóa user (admin) |

## Tài khoản mẫu (sau khi chạy seed)

- **Admin:** admin@example.com / admin123  
- User thường: đăng ký qua trang **Đăng ký**.

## Công nghệ

- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS  
- **Backend:** Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, express-validator, cors  

---

Nếu gặp lỗi kết nối MongoDB, kiểm tra lại `MONGODB_URI` và firewall/network (Atlas cần whitelist IP nếu có).
