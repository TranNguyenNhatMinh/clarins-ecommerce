# Giải thích chi tiết phần Frontend – Cho người mới bắt đầu

Tài liệu này giải thích toàn bộ phần **frontend** (giao diện web) của dự án, dùng ngôn ngữ đơn giản, không giả định bạn đã biết lập trình.

---

## 1. Phần Frontend dùng để làm gì trong toàn bộ hệ thống?

**Frontend** là phần **người dùng nhìn thấy và thao tác** trên trình duyệt: trang chủ, danh sách sản phẩm, form đăng nhập, nút bấm, menu…  

Có thể hình dung:
- **Backend** = nhà bếp (xử lý dữ liệu, lưu database, kiểm tra quyền).
- **Frontend** = sảnh khách (hiển thị món, nhận order từ khách, gửi order xuống bếp).

Frontend **không** lưu dữ liệu lâu dài hay kiểm tra mật khẩu. Nó chỉ:
- Hiển thị giao diện đẹp, dễ dùng.
- Thu thập thông tin người dùng nhập (email, mật khẩu, tên sản phẩm…).
- **Gửi** những thông tin đó lên Backend (qua **API**).
- **Nhận** kết quả từ Backend (danh sách sản phẩm, thông tin đăng nhập thành công hay thất bại…) rồi **hiển thị** lại cho người dùng.

**Tóm lại:** Frontend là “mặt tiền” của website: đón khách, hiển thị nội dung, gửi/nhận dữ liệu với Backend để hệ thống hoạt động.

---

## 2. Kiến thức nền cần biết trước khi đọc

Các khái niệm được dùng trong tài liệu (giải thích ngắn):

| Khái niệm | Ý nghĩa đơn giản |
|-----------|-------------------|
| **Trình duyệt** | Chrome, Edge, Firefox… – nơi bạn mở trang web. |
| **Giao diện (UI)** | Mọi thứ bạn thấy trên màn hình: chữ, nút, form, menu. |
| **API** | Cách Frontend “gọi điện” sang Backend để gửi/nhận dữ liệu (ví dụ: “cho tôi danh sách sản phẩm”, “đăng nhập với email này mật khẩu này”). |
| **Token** | Một “vé thông hành” dạng chuỗi ký tự. Sau khi đăng nhập, Backend cấp token; Frontend gửi kèm token mỗi khi gọi API để Backend biết “đây là ai”. |
| **Route (đường dẫn)** | URL trên trình duyệt, ví dụ `/products`, `/login`. Mỗi route thường tương ứng một “trang” (trang sản phẩm, trang đăng nhập…). |
| **Component (thành phần)** | Một “khối” giao diện tái sử dụng được, ví dụ: một nút, một form đăng nhập, một thanh menu. |
| **State (trạng thái)** | Dữ liệu thay đổi theo thời gian trong một component (ví dụ: danh sách sản phẩm đang tải, đã tải xong; user đã đăng nhập hay chưa). Khi state đổi, giao diện tự cập nhật. |
| **Responsive** | Giao diện tự chỉnh lại (bố cục, kích thước) cho đẹp trên cả máy tính và điện thoại. |

Không cần biết sâu về lập trình; chỉ cần hiểu: Frontend = phần người dùng thấy và dùng, và nó trao đổi dữ liệu với Backend qua API.

---

## 3. Cấu trúc thư mục và các file quan trọng

```
frontend/
├── public/              # File tĩnh (icon, ảnh dùng chung)
│   └── vite.svg
├── src/
│   ├── api/             # Cấu hình gọi API (axios)
│   │   └── axios.js
│   ├── components/      # Các khối giao diện dùng chung
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Toast.jsx
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       └── ProductForm.jsx
│   ├── context/         # “Kho” dữ liệu/trạng thái dùng chung (đăng nhập)
│   │   └── AuthContext.jsx
│   ├── pages/           # Từng trang (Trang chủ, Sản phẩm, Đăng nhập…)
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       └── AdminUsers.jsx
│   ├── App.jsx          # Định nghĩa route và bọc layout
│   ├── main.jsx         # Điểm khởi đầu: gắn app vào trang HTML
│   └── index.css        # CSS toàn cục (Tailwind)
├── index.html           # Trang HTML gốc (có thẻ <div id="root">)
├── package.json         # Khai báo thư viện và lệnh chạy (npm start, npm run build)
├── vite.config.js       # Cấu hình công cụ Vite (build, proxy API)
└── tailwind.config.js   # Cấu hình Tailwind CSS (màu, font…)
```

**File quan trọng nhất cần nắm:**
- **main.jsx** – nơi ứng dụng “bật” lên.
- **App.jsx** – quyết định URL nào hiển thị trang nào, trang nào cần đăng nhập/admin.
- **context/AuthContext.jsx** – lưu thông tin “ai đang đăng nhập”, cung cấp đăng nhập/đăng xuất cho toàn app.
- **api/axios.js** – mọi gọi API đều đi qua đây (gắn token, xử lý lỗi 401).
- **pages/** – mỗi file = một trang (Home, Products, Login, Admin…).
- **components/** – các khối dùng lại (Navbar, Footer, form, bảng…).

---

## 4. Vai trò của từng phần

### 4.1. main.jsx – Điểm khởi đầu

**Vai trò:** Là “công tắc” bật toàn bộ ứng dụng React vào trang HTML.

**Giải thích ngắn:** Trình duyệt tải `index.html`, trong đó có `<div id="root">`. Đoạn code trong `main.jsx` sẽ “render” (vẽ) toàn bộ giao diện React vào đúng div đó. Đồng thời nó bọc app trong:
- **BrowserRouter** – để React Router hiểu URL (route) và chuyển trang.
- **AuthProvider** – để mọi component có thể dùng thông tin đăng nhập (user, login, logout).

**Luồng thực tế:** Khi bạn mở `http://localhost:5173`, trình duyệt tải HTML → tải JS → `main.jsx` chạy → React vẽ App vào `#root` → App (trong App.jsx) đọc URL và hiển thị đúng trang (Home, Products, Login…).

---

### 4.2. App.jsx – Định tuyến và bảo vệ trang

**Vai trò:** Quyết định “URL nào → trang nào” và “trang nào cần đăng nhập / chỉ admin”.

**Các khái niệm trong file:**
- **Route** – mỗi `<Route path="..." element={...} />` nghĩa là: “khi URL khớp `path` thì hiển thị `element`”.
- **Layout** – “khung” chung (Navbar + Footer + vùng nội dung). Các trang con hiển thị trong “vùng nội dung” (Outlet).
- **ProtectedRoute** – chỉ cho vào nếu đã đăng nhập; chưa thì chuyển về `/login`.
- **AdminRoute** – chỉ cho vào nếu vừa đăng nhập vừa là admin; không thì chuyển về trang chủ.

**Luồng thực tế:**
- Bạn vào `/` → hiển thị Layout, bên trong là Home.
- Bạn vào `/products` → Layout + trang Products.
- Bạn vào `/profile` → nếu chưa đăng nhập thì bị chuyển sang `/login`; đã đăng nhập thì hiển thị Profile.
- Bạn vào `/admin/dashboard` → nếu không phải admin thì bị đẩy về `/`; là admin thì hiển thị AdminLayout và Dashboard.

**Tóm lại:** App.jsx là “bản đồ” và “bảo vệ”: nó map URL → trang và chặn người chưa đăng nhập / không phải admin khỏi những trang nhạy cảm.

---

### 4.3. AuthContext.jsx – Trung tâm đăng nhập/đăng xuất

**Vai trò:** Một “kho” chung lưu “ai đang đăng nhập” và cung cấp các hành động: đăng nhập, đăng ký, đăng xuất. Mọi component đều có thể “đọc” và “dùng” thông tin này.

**Vì sao cần:** Nếu không có Context, mỗi trang (Navbar, Profile, Admin…) sẽ phải tự lưu user; khi đăng xuất ở Navbar thì trang Profile không biết. Context giúp “một nơi khai báo, cả app dùng chung”.

**Cách hoạt động:**
- **AuthProvider** bọc toàn bộ app (trong main.jsx). Bên trong nó lưu:
  - `user` (thông tin user hiện tại hoặc null),
  - `loading` (đang kiểm tra token lần đầu),
  - các hàm: `login`, `register`, `logout`, `updateUser`.
- Khi app load, nó đọc `localStorage`: nếu có `token` và `user` thì coi như “đã đăng nhập” và set `user` vào state.
- **login(email, password):** gọi API `POST /api/auth/login` → Backend trả về `user` + `token` → lưu vào `localStorage` và `setUser` → cả app biết “đã đăng nhập”.
- **logout():** xóa token và user khỏi `localStorage`, `setUser(null)` → cả app biết “đã đăng xuất”.
- **useAuth()** – hook để mọi component “lấy” được `user`, `login`, `logout`, `isAdmin`, `isAuthenticated` từ Context.

**Luồng thực tế:** User bấm “Đăng nhập” trên trang Login → gọi `login(email, password)` từ Context → axios gửi request tới Backend → Backend trả token + user → Context lưu vào localStorage và state → Navbar đọc `user` từ Context nên hiển thị tên user và nút Đăng xuất; các route bảo vệ thấy `isAuthenticated === true` nên cho vào Profile/Admin.

**Tóm lại:** AuthContext là “trung tâm đăng nhập”: lưu user/token, cung cấp login/logout/register cho cả app, giúp Navbar và các route bảo vệ biết “đã đăng nhập chưa, có phải admin không”.

---

### 4.4. api/axios.js – Cấu hình gọi API

**Vai trò:** Tạo một “client” gọi API thống nhất: tự gắn token vào mọi request, tự xử lý khi Backend báo “token hết hạn” (401) bằng cách đăng xuất và chuyển về trang Login.

**Giải thích:**
- **baseURL:** Nếu có `VITE_API_URL` (khi deploy) thì dùng; không thì dùng `/api` (proxy Vite sẽ chuyển sang Backend khi dev).
- **Interceptor request:** Trước mỗi lần gửi request, lấy `token` từ `localStorage` và gắn vào header `Authorization: Bearer <token>` để Backend biết “đây là user nào”.
- **Interceptor response:** Nếu Backend trả 401 (chưa đăng nhập / token hết hạn), xóa token và user trong localStorage và chuyển hướng sang `/login`.

**Luồng thực tế:** Trang Products gọi `api.get('/products')` → axios tự thêm header Authorization (nếu có token) → gửi tới Backend → nhận response. Nếu 401 → axios interceptor bắt → xóa token, chuyển sang `/login`. Các trang khác (Profile, Admin CRUD) cũng dùng chung `api` nên đều được gắn token và xử lý 401 giống nhau.

**Tóm lại:** axios.js là “người đưa thư” chuẩn: mọi gọi API đều qua đây, tự gắn token và tự xử lý hết hạn đăng nhập.

---

### 4.5. Layout, Navbar, Footer

**Layout.jsx:** Khung chung cho trang “khách”: trên cùng là Navbar, dưới cùng là Footer, giữa là “nội dung trang” (Outlet – thay đổi theo route: Home, Products, Login…).

**Navbar.jsx:** Thanh menu trên cùng. Hiển thị khác nhau tùy trạng thái:
- Chưa đăng nhập: link Trang chủ, Sản phẩm, Đăng nhập, Đăng ký.
- Đã đăng nhập: thêm tên user, menu dropdown (Hồ sơ, Dashboard nếu admin, Đăng xuất). Chỉ admin mới thấy link “Admin”.

**Footer.jsx:** Phần chân trang (tên dự án, link, công nghệ). Không ảnh hưởng logic đăng nhập hay API.

**Luồng thực tế:** User mở bất kỳ trang nào (/, /products, /login…) → Layout luôn vẽ Navbar + Outlet + Footer → Outlet thay đổi theo URL; Navbar đọc `useAuth()` nên luôn phản ánh đúng “đã đăng nhập hay chưa, có phải admin không”.

---

### 4.6. Các trang (pages) – Chức năng từng trang

**Home.jsx:** Trang chủ – lời chào, nút “Xem sản phẩm”, “Đăng ký” (nếu chưa đăng nhập). Chỉ hiển thị, không gọi API phức tạp.

**Products.jsx:** Danh sách sản phẩm.
- Khi vào trang: `useEffect` chạy một lần, gọi `api.get('/products')` → nhận mảng sản phẩm → lưu vào state `products` → vẽ lưới thẻ sản phẩm (ảnh, tên, giá, danh mục). Mỗi thẻ là link tới `/products/:id`.
- Có loading (spinner) và xử lý lỗi (hiển thị message nếu API lỗi).

**ProductDetail.jsx:** Chi tiết một sản phẩm.
- Đọc `id` từ URL (`useParams()`) → gọi `api.get('/products/' + id)` → hiển thị tên, mô tả, giá, ảnh, ngày tạo.

**Login.jsx:** Trang đăng nhập.
- Form: email, mật khẩu. Khi submit → gọi `login(email, password)` từ AuthContext → Context gọi API `POST /api/auth/login` → thành công thì lưu token/user, hiển thị toast “Đăng nhập thành công”, chuyển sang Dashboard (nếu admin) hoặc Trang chủ (nếu user). Thất bại thì hiển thị toast lỗi (message từ Backend).
- Nếu đã đăng nhập (`user` có trong Context) thì không cho xem form, redirect luôn.

**Register.jsx:** Tương tự Login nhưng form có thêm “Họ tên”, gọi `register(name, email, password)` → API `POST /api/auth/register`. Thành công thì tự đăng nhập (lưu token/user) và chuyển về Trang chủ.

**Profile.jsx:** Trang hồ sơ (chỉ user đăng nhập mới vào được nhờ ProtectedRoute).
- Gọi `api.get('/users/profile')` để lấy thông tin mới nhất → hiển thị form (tên, email read-only). Sửa tên rồi submit → `api.put('/users/profile', { name })` → cập nhật xong gọi `updateUser` trong Context để Navbar và các chỗ khác hiển thị tên mới.

**AdminDashboard.jsx:** Trang tổng quan admin – gọi API lấy số user và số sản phẩm, hiển thị hai “thẻ” số liệu, có link sang trang quản lý user và quản lý sản phẩm.

**AdminProducts.jsx:** CRUD sản phẩm (Create, Read, Update, Delete).
- **Read:** Giống Products, gọi `api.get('/products')` nhưng hiển thị dạng bảng, có cột Thao tác.
- **Create:** Nút “Thêm sản phẩm” mở modal (ProductForm) → nhập tên, mô tả, giá, danh mục, URL ảnh → submit gọi `api.post('/products', payload)` → đóng modal, refresh danh sách, toast thành công.
- **Update:** Bấm “Sửa” trên một dòng → mở ProductForm với dữ liệu sản phẩm đó → sửa và submit → `api.put('/products/' + id, payload)` → đóng modal, refresh, toast.
- **Delete:** Bấm “Xóa” → confirm → `api.delete('/products/' + id)` → refresh, toast.

**AdminUsers.jsx:** Danh sách user (GET từ `/admin/users`), hiển thị bảng; có nút “Xóa” (trừ user đang đăng nhập). Xóa gọi `api.delete('/admin/users/' + id)`.

**Luồng dữ liệu chung:** User thao tác trên giao diện → event (click, submit) → gọi hàm (login, api.get, api.post…) → axios gửi request (kèm token nếu có) → Backend xử lý và trả response → Frontend nhận, cập nhật state (và/hoặc Context) → giao diện tự cập nhật (React re-render).

---

### 4.7. Component dùng chung

**LoadingSpinner:** Chỉ hiển thị icon quay tròn – dùng khi “đang tải dữ liệu” (danh sách sản phẩm, profile, admin…).

**Toast:** Popup nhỏ (xanh = thành công, đỏ = lỗi) hiển thị message và tự tắt sau vài giây. Dùng sau đăng nhập, đăng ký, thêm/sửa/xóa sản phẩm, cập nhật profile.

**AdminLayout:** Khung riêng cho khu admin: sidebar (Dashboard, Quản lý sản phẩm, Quản lý user, Đăng xuất) + vùng nội dung (Outlet). Chỉ hiển thị khi đã vào được route `/admin/*` (đã qua AdminRoute).

**ProductForm:** Form chung cho “Thêm sản phẩm” và “Sửa sản phẩm” (nhận `initial` khi sửa). Thu thập name, description, price, category, image → gọi `onSubmit(payload)` do AdminProducts truyền vào (handleCreate hoặc handleUpdate).

---

## 5. Cách các phần liên kết với nhau

- **main.jsx** bọc App bằng BrowserRouter và AuthProvider → App và mọi trang đều dùng được route và useAuth().
- **App.jsx** dùng useAuth() để kiểm tra isAuthenticated, isAdmin trong ProtectedRoute và AdminRoute; quyết định hiển thị Layout (Navbar+Footer) hay AdminLayout (sidebar).
- **Navbar** dùng useAuth() để hiển thị Đăng nhập/Đăng ký hay tên user + dropdown; link Admin chỉ khi isAdmin.
- **Trang Login/Register** gọi login/register từ useAuth() → AuthContext gọi api (axios) → Backend; response trả về thì Context cập nhật user/token → Navbar và App tự đổi theo.
- **Các trang cần dữ liệu** (Products, ProductDetail, Profile, Admin*) đều dùng `api` từ axios.js → request nào cần đăng nhập thì axios tự gắn token; Backend trả 401 thì axios tự đăng xuất và chuyển về /login.

**Sơ đồ đơn giản:**  
User → Trang (page) → useAuth() hoặc api → AuthContext / Backend → state hoặc Context cập nhật → giao diện đổi.

---

## 6. Luồng chạy thực tế của dữ liệu và chức năng

**Ví dụ 1 – Xem danh sách sản phẩm (không cần đăng nhập):**  
User mở `/products` → App hiển thị Layout + Products → Products trong useEffect gọi `api.get('/products')` → axios gửi GET (không cần token) → Backend trả JSON danh sách → setProducts(data) → React vẽ lưới thẻ.

**Ví dụ 2 – Đăng nhập:**  
User vào `/login`, nhập email/mật khẩu, bấm Đăng nhập → Login gọi `login(email, password)` từ useAuth() → AuthContext gọi `api.post('/auth/login', { email, password })` → Backend kiểm tra, trả { user, token } → Context lưu token và user vào localStorage và setUser → Login chuyển hướng (navigate) → Navbar thấy user nên hiển thị tên và Đăng xuất; nếu admin thì thấy thêm link Admin.

**Ví dụ 3 – Admin thêm sản phẩm:**  
Admin vào `/admin/products` → AdminProducts gọi GET /products hiển thị bảng → bấm “Thêm sản phẩm” → mở ProductForm → nhập và submit → handleCreate gọi `api.post('/products', payload)` (axios tự gắn token) → Backend kiểm tra token + role admin, tạo sản phẩm trong DB, trả 201 → Frontend đóng modal, fetchProducts() lại, toast “Tạo sản phẩm thành công”.

**Ví dụ 4 – Token hết hạn:**  
User đang xem Profile, token đã hết hạn → gọi `api.get('/users/profile')` → Backend trả 401 → axios interceptor bắt 401 → xóa token và user trong localStorage, window.location = '/login' → user bị chuyển về trang Đăng nhập.

---

## 7. Công dụng thực tế từng phần

| Phần | Công dụng thực tế |
|------|--------------------|
| main.jsx | Khởi động app, bật routing và auth cho toàn bộ trang. |
| App.jsx | Định nghĩa “trang nào ở đâu”, “trang nào cần đăng nhập/admin”. |
| AuthContext | Một nơi lưu “ai đang đăng nhập”, cung cấp đăng nhập/đăng xuất/đăng ký cho cả app. |
| axios.js | Gắn token vào mọi request, xử lý thống nhất khi token hết hạn. |
| Layout + Navbar + Footer | Giao diện chung: menu, chân trang, khung nội dung. |
| Các page (Home, Products, Login…) | Mỗi trang một nhiệm vụ: hiển thị nội dung, form, gọi API, cập nhật state/Context. |
| ProtectedRoute / AdminRoute | Chặn truy cập trái phép vào trang cần đăng nhập hoặc quyền admin. |
| LoadingSpinner, Toast | Trải nghiệm người dùng: biết đang tải, biết thao tác thành công hay lỗi. |

---

## 8. Tóm tắt bằng ngôn ngữ cực kỳ dễ hiểu

- **Frontend** = phần bạn thấy và bấm trên web: trang chủ, sản phẩm, đăng nhập, admin…
- **main.jsx** = nơi bật toàn bộ app và bọc bằng “bản đồ đường đi” (Router) và “kho đăng nhập” (AuthContext).
- **App.jsx** = bản đồ: URL nào mở trang nào, trang nào chỉ dành cho người đăng nhập hoặc admin.
- **AuthContext** = kho chung: lưu “ai đang đăng nhập”, cung cấp đăng nhập/đăng ký/đăng xuất; Navbar và các route bảo vệ đọc từ đây.
- **axios.js** = cách gọi Backend chuẩn: tự gắn token, tự xử lý khi hết phiên đăng nhập.
- **Layout/Navbar/Footer** = khung và menu chung; Navbar đổi theo đăng nhập/admin.
- **Pages** = từng trang cụ thể: mỗi trang lấy dữ liệu qua API (nếu cần), hiển thị form hoặc danh sách, và cập nhật giao diện khi dữ liệu đổi.
- **ProtectedRoute / AdminRoute** = cửa bảo vệ: không đăng nhập (hoặc không phải admin) thì không vào được trang tương ứng.

Sau khi đọc xong phần này, bạn sẽ hiểu: Frontend làm gì trong hệ thống, từng file/component đóng vai trò gì, dữ liệu và đăng nhập chạy qua đâu, và Frontend phối hợp với Backend (qua API và token) như thế nào.
