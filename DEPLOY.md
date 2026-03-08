# Hướng dẫn Deploy dự án MERN (Production)

Dự án có **Backend** (Node/Express) và **Frontend** (React/Vite). Deploy tách riêng: Backend lên Render, Frontend lên Vercel, Database dùng MongoDB Atlas.

---

## Tổng quan

| Thành phần   | Nơi deploy gợi ý | Ghi chú                    |
|-------------|-------------------|----------------------------|
| Database    | MongoDB Atlas     | Free tier, cloud           |
| Backend API | Render            | Free tier, sleep sau 15 ph  |
| Frontend    | Vercel            | Free, build từ Git hoặc zip |

Sau khi xong bạn sẽ có:
- Frontend: `https://ten-app.vercel.app`
- Backend: `https://ten-api.onrender.com`
- MongoDB: cluster trên Atlas

---

## Bước 1: MongoDB Atlas (database production)

1. Vào https://www.mongodb.com/cloud/atlas → Đăng ký / Đăng nhập.
2. Tạo **Project** mới (hoặc dùng project có sẵn).
3. Tạo **Cluster** (chọn free tier M0).
4. Trong cluster, bấm **Connect** → **Drivers** → copy **Connection String** (dạng `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/`).
5. Thay `<password>` trong chuỗi bằng mật khẩu user MongoDB (đã tạo khi add user).
6. Thêm tên database vào cuối: `?retryWrites=true&w=majority` → thành  
   `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/product_management?retryWrites=true&w=majority`  
   (giữ nguyên `product_management` hoặc đổi tên nếu bạn đặt tên khác trong code).
7. **Network Access**: Add IP `0.0.0.0/0` (Allow from anywhere) để Render có thể kết nối.

Chuỗi này sẽ dùng làm **MONGODB_URI** cho Backend.

---

## Bước 2: Deploy Backend lên Render

1. Đăng ký https://render.com (có thể dùng GitHub).
2. **New** → **Web Service**.
3. Kết nối repo GitHub chứa code (hoặc dùng **Build and deploy from a repository**). Chọn repo của bạn.
4. Cấu hình:
   - **Root Directory:** `backend` (vì backend nằm trong thư mục `backend`).
   - **Runtime:** Node.
   - **Build Command:** `npm install`.
   - **Start Command:** `npm start` (nếu dùng `node server.js` thì điền `node server.js`).
5. **Environment Variables** (bấm Add) thêm:

   | Key           | Value |
   |---------------|--------|
   | MONGODB_URI   | Chuỗi kết nối Atlas (bước 1) |
   | JWT_SECRET    | Một chuỗi bí mật dài, ngẫu nhiên (ví dụ: `mySuperSecretKey2024!@#`) |
   | JWT_EXPIRE    | `7d` |
   | FRONTEND_URL  | Để trống tạm, sau khi deploy frontend sẽ thêm URL Vercel vào đây |

6. Bấm **Create Web Service**. Đợi build và deploy xong.
7. Copy URL dịch vụ (ví dụ `https://your-api.onrender.com`) → dùng làm **VITE_API_URL** cho frontend và **FRONTEND_URL** cho backend (sửa sau).

**Cập nhật FRONTEND_URL sau khi có URL Vercel:**  
Vào **Environment** của Web Service trên Render → sửa **FRONTEND_URL** = `https://ten-app.vercel.app` (URL frontend thật của bạn) → Save. Render sẽ redeploy.

**Tạo admin và dữ liệu mẫu:**  
Render không chạy seed tự động. Có 2 cách:
- **Cách A:** Chạy seed trên máy local nhưng dùng **MONGODB_URI** của Atlas (trong `.env` tạm thời set `MONGODB_URI=...chuỗi Atlas...` rồi chạy `npm run seed` trong `backend`).
- **Cách B:** Tạo API tạm (ví dụ POST `/api/seed`) chỉ khi có biến môi trường `ALLOW_SEED=true`, gọi một lần rồi tắt. (Tùy chọn, có thể bỏ qua nếu dùng Cách A.)

---

## Bước 3: Deploy Frontend lên Vercel

1. Đăng ký https://vercel.com (có thể dùng GitHub).
2. **Add New** → **Project** → Import repo GitHub (repo chứa cả frontend).
3. Cấu hình:
   - **Root Directory:** chọn `frontend` (hoặc để root nếu repo chỉ có frontend).
   - **Framework Preset:** Vite.
   - **Build Command:** `npm run build` (mặc định Vite thường đã đúng).
   - **Output Directory:** `dist` (mặc định Vite).
4. **Environment Variables** (trước khi Deploy):

   | Name            | Value |
   |-----------------|--------|
   | VITE_API_URL    | URL backend (ví dụ `https://your-api.onrender.com`) **không** có dấu `/` cuối |

5. Bấm **Deploy**. Đợi build xong.
6. Copy URL (ví dụ `https://your-app.vercel.app`).
7. Quay lại **Render** → Backend → **Environment** → thêm/sửa **FRONTEND_URL** = `https://your-app.vercel.app` → Save.

---

## Bước 4: Kiểm tra sau khi deploy

1. Mở URL Vercel (frontend) → Đăng ký / Đăng nhập thử.
2. Nếu lỗi CORS hoặc “Failed to fetch”: kiểm tra **FRONTEND_URL** trên Render đúng URL Vercel (có https, không dấu `/` cuối).
3. Nếu không có admin: chạy seed với Atlas (Cách A ở bước 2).

---

## Lưu ý

- **Render free:** Service có thể “sleep” sau ~15 phút không có request; lần gọi đầu sau khi sleep sẽ chậm vài giây.
- **VITE_API_URL:** Chỉ có hiệu lực lúc **build**. Mỗi khi đổi URL backend, cần chỉnh **Environment** trên Vercel rồi **Redeploy**.
- **Bảo mật:** Không commit file `.env`; chỉ dùng biến môi trường trên Render / Vercel / Atlas.
- **HTTPS:** Vercel và Render mặc định dùng HTTPS, phù hợp cho production.

---

## Tóm tắt biến môi trường

**Backend (Render)**  
- `MONGODB_URI` = connection string Atlas  
- `JWT_SECRET` = chuỗi bí mật  
- `JWT_EXPIRE` = `7d`  
- `FRONTEND_URL` = URL Vercel (để CORS)

**Frontend (Vercel)**  
- `VITE_API_URL` = URL backend Render (ví dụ `https://your-api.onrender.com`)

Nếu làm đúng các bước trên, web sẽ chạy production với database Atlas và API trên Render.
