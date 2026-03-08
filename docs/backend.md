# Giải thích chi tiết phần Backend – Cho người mới bắt đầu

Tài liệu này giải thích toàn bộ phần **backend** (máy chủ API) của dự án bằng ngôn ngữ đơn giản, không giả định bạn đã biết lập trình.

---

## 1. Phần Backend dùng để làm gì trong toàn bộ hệ thống?

**Backend** là phần **chạy trên máy chủ**, người dùng **không trực tiếp thấy**. Nó có nhiệm vụ:

- **Nhận yêu cầu** từ Frontend (ví dụ: “đăng nhập với email A và mật khẩu B”, “cho tôi danh sách sản phẩm”, “thêm sản phẩm mới”).
- **Xử lý logic:** kiểm tra mật khẩu đúng hay sai, kiểm tra quyền (user thường hay admin), kiểm tra dữ liệu hợp lệ hay không.
- **Nói chuyện với Database (MongoDB):** lưu user, sản phẩm, đọc danh sách, sửa, xóa.
- **Trả kết quả** về cho Frontend dưới dạng JSON (dữ liệu có cấu trúc để Frontend hiển thị hoặc báo lỗi).

Có thể hình dung:
- **Frontend** = quầy phục vụ (nhận order từ khách, hiển thị menu).
- **Backend** = nhà bếp + kho (nhận order, kiểm tra nguyên liệu, nấu, lưu/cập nhật kho).
- **Database** = kho chứa nguyên liệu và hồ sơ (user, sản phẩm).

Backend **không** vẽ giao diện; nó chỉ nhận request (HTTP), xử lý, và trả response (JSON). Frontend mới dùng response đó để vẽ trang và hiển thị thông báo.

**Tóm lại:** Backend là “bộ não” và “kho dữ liệu” của hệ thống: xác thực người dùng, phân quyền, validate dữ liệu, đọc/ghi database, và trả kết quả cho Frontend.

---

## 2. Kiến thức nền cần biết trước khi đọc

Các khái niệm dùng trong tài liệu (giải thích ngắn):

| Khái niệm | Ý nghĩa đơn giản |
|-----------|-------------------|
| **API** | Cách Frontend “gọi” Backend: gửi một request (URL + method + body), Backend trả response (thường là JSON). Ví dụ: “POST /api/auth/login” = yêu cầu đăng nhập. |
| **Request / Response** | Request = yêu cầu từ client (Frontend); Response = câu trả lời từ server (Backend). |
| **Route** | Một “đường dẫn” trên API, ví dụ GET /api/products = “lấy danh sách sản phẩm”. Route thường gắn với một hoặc vài hàm xử lý (controller). |
| **Controller** | Hàm xử lý một loại request cụ thể: nhận dữ liệu từ request, gọi Model (database), rồi trả response. |
| **Model** | Mô tả “cấu trúc” và “cách làm việc” với một loại dữ liệu trong database (User, Product). Model dùng để tạo, đọc, sửa, xóa bản ghi. |
| **Middleware** | Đoạn code chạy “giữa đường”: sau khi nhận request nhưng trước khi tới controller. Dùng để kiểm tra token (đã đăng nhập chưa), kiểm tra quyền admin, validate body, hoặc xử lý lỗi chung. |
| **Token (JWT)** | Chuỗi ký tự do Backend tạo sau khi đăng nhập thành công. Frontend lưu token và gửi kèm mỗi request “cần đăng nhập”. Backend dùng token để biết “đây là user nào” mà không cần gửi lại mật khẩu. |
| **Authentication** | Xác thực “bạn là ai” – thường qua đăng nhập (email + mật khẩu) và token. |
| **Authorization** | Phân quyền “bạn được làm gì” – ví dụ chỉ admin mới được thêm/sửa/xóa sản phẩm. |
| **Database** | Nơi lưu dữ liệu lâu dài (user, sản phẩm). Dự án dùng MongoDB (database dạng document, lưu dạng JSON). |
| **CRUD** | Create (tạo), Read (đọc), Update (sửa), Delete (xóa) – bốn thao tác cơ bản với dữ liệu. |
| **Validate** | Kiểm tra dữ liệu đầu vào (email đúng format chưa, mật khẩu đủ dài chưa, giá có âm không…) trước khi xử lý hoặc lưu. |

---

## 3. Cấu trúc thư mục và các file quan trọng

```
backend/
├── controllers/         # Hàm xử lý từng loại request (auth, user, product, admin)
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   └── adminController.js
├── middleware/          # Code chạy “giữa đường” (auth, admin, lỗi)
│   ├── auth.js          # Kiểm tra token (đã đăng nhập chưa)
│   ├── admin.js         # Kiểm tra có phải admin không
│   └── errorHandler.js  # Xử lý lỗi chung, trả JSON thống nhất
├── models/              # Mô tả cấu trúc dữ liệu và thao tác với MongoDB
│   ├── User.js
│   └── Product.js
├── routes/              # Gắn URL + method với controller (và middleware)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── adminRoutes.js
├── validators/           # Quy tắc kiểm tra dữ liệu đầu vào
│   ├── authValidator.js
│   ├── userValidator.js
│   └── productValidator.js
├── scripts/
│   └── seed.js          # Script tạo admin và sản phẩm mẫu (chạy tay)
├── app.js               # Cấu hình Express: CORS, JSON, mount routes, errorHandler
├── server.js            # Điểm vào: kết nối MongoDB, khởi động app
├── package.json         # Thư viện và lệnh (npm run dev, npm run seed)
└── .env.example         # Mẫu biến môi trường (PORT, MONGODB_URI, JWT_SECRET…)
```

**File quan trọng nhất:**
- **server.js** – Khởi động: đọc .env, kết nối MongoDB, lắng nghe cổng (PORT).
- **app.js** – Cấu hình ứng dụng Express: CORS, parse JSON, gắn từng nhóm route (auth, users, products, admin), và middleware xử lý lỗi.
- **models/** – Định nghĩa User và Product (trường nào, bắt buộc không, hash mật khẩu thế nào).
- **routes/** – Định nghĩa “URL nào + method nào” gọi “controller nào”, và chạy “middleware nào” trước (protect, adminOnly, validate).
- **controllers/** – Logic thật: đọc/ghi database, trả JSON thành công hay lỗi.
- **middleware/** – Bảo vệ route (token, admin) và trả lỗi thống nhất (errorHandler).
- **validators/** – Kiểm tra body/query trước khi vào controller.

---

## 4. Vai trò của từng phần

### 4.1. server.js – Điểm vào, kết nối DB và khởi động app

**Vai trò:** File chạy đầu tiên khi bạn gõ `npm run dev` hoặc `npm start`. Nó:
1. Đọc file `.env` (dotenv) để lấy biến như `MONGODB_URI`, `PORT`, `JWT_SECRET`.
2. Kết nối tới MongoDB. Nếu không kết nối được thì in lỗi và thoát (process.exit(1)).
3. Nếu kết nối thành công thì mới gọi `app.listen(PORT)` – tức là mở “cổng” để nhận request HTTP (ví dụ cổng 5000).

**Vì sao cần:** Ứng dụng phải có database trước khi xử lý đăng ký, đăng nhập hay CRUD sản phẩm. Nếu DB chưa kết nối mà vẫn mở cổng thì mọi request đọc/ghi DB sẽ lỗi. Thứ tự “kết nối DB xong → mới listen” đảm bảo an toàn.

**Luồng thực tế:** Bạn chạy `npm run dev` → Node chạy server.js → load .env → mongoose.connect(MONGODB_URI) → khi connect xong → app.listen(5000) → console in “Server chạy tại http://localhost:5000”. Từ lúc đó, mọi request từ Frontend (hoặc Postman) tới http://localhost:5000 sẽ vào app.js.

---

### 4.2. app.js – Cấu hình Express và gắn routes

**Vai trò:** Tạo ứng dụng Express và cấu hình:
- **CORS** – Cho phép domain Frontend (localhost:5173 hoặc domain deploy) gọi API mà không bị trình duyệt chặn.
- **express.json() / urlencoded** – Đọc body request dạng JSON hoặc form (để đọc email, password, tên sản phẩm…).
- **Mount routes** – Gắn từng nhóm route:
  - `/api/auth` → authRoutes (đăng ký, đăng nhập)
  - `/api/users` → userRoutes (profile: xem, sửa)
  - `/api/products` → productRoutes (CRUD sản phẩm)
  - `/api/admin` → adminRoutes (danh sách user, xóa user)
- **errorHandler** – Middleware cuối: bắt mọi lỗi từ controller (hoặc middleware) và trả JSON thống nhất { success: false, message: "..." }, không để lộ stack trace ra ngoài (trừ môi trường development).

**Luồng thực tế:** Một request tới POST http://localhost:5000/api/auth/login → Express nhận → CORS và body parser đã xử lý → đi vào app.use('/api/auth', authRoutes) → authRoutes so khớp POST '/login' → chạy validation → chạy controller login → controller trả res.json(...). Nếu có lỗi (throw hoặc next(err)) → đi tới errorHandler → trả res.status(...).json({ success: false, message: ... }).

**Tóm lại:** app.js là “trung tâm điều phối”: cấu hình chung và phân request theo đường dẫn vào đúng route → controller.

---

### 4.3. Models – User và Product

**Model** trong dự án dùng **Mongoose**: vừa mô tả “cấu trúc” dữ liệu (schema), vừa cung cấp hàm để thao tác với MongoDB (create, find, findByIdAndUpdate, findByIdAndDelete…).

**User.js:**
- **Schema** – Định nghĩa mỗi user có: name (string, bắt buộc), email (string, bắt buộc, unique, lowercase), password (string, bắt buộc, min 6 ký tự, select: false để mặc định không trả về khi query), role (user hoặc admin, mặc định user), createdAt (ngày tạo).
- **pre('save')** – Trước khi lưu user mới (hoặc khi đổi password), tự động hash password bằng bcrypt. Nhờ đó database không bao giờ lưu mật khẩu dạng chữ thường.
- **comparePassword(candidatePassword)** – Hàm so sánh mật khẩu người dùng nhập với bản hash trong DB (dùng khi đăng nhập).

**Vì sao cần:** Database cần biết “user có những trường gì, ràng buộc gì”; và bảo mật yêu cầu không lưu mật khẩu plain text. Model User đảm nhiệm cả hai: định nghĩa cấu trúc và quy tắc hash/so sánh mật khẩu.

**Product.js:**
- **Schema** – name, description, price (number, min 0), category, image (string URL), createdAt. Không có logic đặc biệt như hash; chỉ cần đúng kiểu và ràng buộc.

**Luồng thực tế:** Khi authController gọi `User.create({ name, email, password })`, Mongoose kiểm tra schema, chạy pre('save') hash password, rồi ghi document vào collection `users` trong MongoDB. Khi login, controller gọi `User.findOne({ email }).select('+password')` rồi `user.comparePassword(password)` để kiểm tra mật khẩu.

**Tóm lại:** Model = “bản thiết kế” + “công cụ” cho một loại dữ liệu: định nghĩa trường và ràng buộc, đồng thời cung cấp cách tạo/đọc/sửa/xóa an toàn (kèm hash mật khẩu cho User).

---

### 4.4. Middleware – auth.js, admin.js, errorHandler.js

**auth.js (protect):**
- Đọc header `Authorization`, lấy token (bỏ chữ “Bearer ” phía trước).
- Nếu không có token → trả 401, message “Chưa đăng nhập”.
- Nếu có token: dùng JWT verify với JWT_SECRET. Nếu token sai hoặc hết hạn → trả 401. Nếu đúng → lấy id trong token, tìm User trong DB, gắn user vào `req.user` và gọi `next()` để request đi tiếp tới controller.
- **Vai trò:** Bảo vệ route “chỉ dành cho người đã đăng nhập” (profile, thêm/sửa/xóa sản phẩm, admin). Controller sau đó có thể dùng `req.user` mà không cần tự kiểm tra token.

**admin.js (adminOnly):**
- Kiểm tra `req.user.role === 'admin'`. Chỉ khi đã qua middleware auth (nên req.user đã có). Nếu không phải admin → trả 403 “Bạn không có quyền truy cập”. Nếu là admin → next().
- **Vai trò:** Phân quyền: route chỉ admin mới được gọi (POST/PUT/DELETE products, GET/DELETE admin/users). User thường không thể gọi những API này dù đã có token.

**errorHandler.js:**
- Nhận lỗi từ bất kỳ middleware hoặc controller nào (khi họ gọi next(err)). Đặt status code (mặc định 500), message (mặc định “Lỗi máy chủ”), trả JSON { success: false, message }. Ở môi trường development có thể thêm stack trace để debug; production không thêm để không lộ thông tin nội bộ.
- **Vai trò:** Một nơi xử lý lỗi thống nhất, Frontend luôn nhận cùng format lỗi và không thấy lỗi “vỡ” từ server.

**Luồng thực tế:** Request GET /api/users/profile kèm header Authorization: Bearer &lt;token&gt; → vào userRoutes → chạy protect → auth middleware lấy token, verify, tìm user, gắn req.user → next() → getProfile chạy, dùng req.user.id để lấy profile. Nếu token sai → protect trả 401, không tới getProfile. Request DELETE /api/products/123 (token của user thường) → productRoutes chạy protect (OK) → adminOnly (403 vì không phải admin) → trả 403, không tới deleteProduct.

**Tóm lại:** Middleware auth = “cổng kiểm tra vé” (đã đăng nhập chưa); admin = “cổng kiểm tra vai” (có phải admin không); errorHandler = “phòng xử lý sự cố” chung cho toàn bộ API.

---

### 4.5. Validators – Kiểm tra dữ liệu đầu vào

**Vì sao cần:** Dữ liệu từ Frontend (hoặc từ bên ngoài) có thể sai: email không đúng format, mật khẩu quá ngắn, giá âm, tên để trống… Nếu không kiểm tra, có thể lưu dữ liệu hỏng vào DB hoặc gây lỗi không rõ ràng. Validator chạy **trước** controller, chỉ khi dữ liệu hợp lệ mới cho vào controller.

**Cách hoạt động:** Dùng thư viện **express-validator**. Mỗi route cần validate sẽ có một mảng rule (ví dụ body('email').isEmail(), body('password').isLength({ min: 6 })) và một hàm validate: đọc validationResult(req), nếu có lỗi thì trả 400 với message lỗi đầu tiên; không lỗi thì next().

**authValidator.js:** register (name, email, password – tên không rỗng, email đúng format, mật khẩu tối thiểu 6 ký tự); login (email, password – email đúng format, password không rỗng).

**userValidator.js:** updateProfile (name – không bắt buộc nhưng nếu có thì không rỗng, độ dài tối đa).

**productValidator.js:** create (name, description, price, category, image – theo schema); update (các trường tương tự nhưng optional).

**Luồng thực tế:** POST /api/auth/register với body { name: '', email: 'abc', password: '123' } → authRoutes chạy registerValidation → validate → validationResult có lỗi (tên rỗng hoặc email không hợp lệ hoặc mật khẩu ngắn) → res.status(400).json({ success: false, message: "Vui lòng nhập tên" } hoặc tương tự), không gọi controller register. Chỉ khi body đúng hết mới tới register.

**Tóm lại:** Validators = “bộ lọc” trước cửa controller: chỉ dữ liệu đúng quy tắc mới được xử lý; sai thì trả lỗi rõ ràng cho Frontend.

---

### 4.6. Routes – Gắn URL + method với middleware và controller

**authRoutes.js:**  
- POST /register → registerValidation → validate → register (controller).  
- POST /login → loginValidation → validate → login (controller).  
(Không cần protect vì đăng ký/đăng nhập là cho người chưa có token.)

**userRoutes.js:**  
- GET /profile → protect → getProfile.  
- PUT /profile → protect → updateProfileValidation → validate → updateProfile.  
(Mọi route đều cần đăng nhập nên có protect.)

**productRoutes.js:**  
- GET / → getProducts (công khai).  
- GET /:id → getProductById (công khai).  
- POST / → protect → adminOnly → createProductValidation → productValidate → createProduct.  
- PUT /:id → protect → adminOnly → updateProductValidation → productValidate → updateProduct.  
- DELETE /:id → protect → adminOnly → deleteProduct.  
(Đọc công khai; tạo/sửa/xóa chỉ admin.)

**adminRoutes.js:**  
- router.use(protect, adminOnly) – mọi route bên dưới đều phải qua protect và adminOnly.  
- GET /users → getUsers.  
- DELETE /users/:id → deleteUser.  

**Luồng thực tế:** Request tới app: /api/products → app gửi vào productRoutes; /api/products/123 với GET → getProductById; cùng /api/products/123 với DELETE và header Authorization (admin) → protect → adminOnly → deleteProduct. Request tới /api/admin/users → app gửi vào adminRoutes → protect → adminOnly → getUsers.

**Tóm lại:** Routes = “bảng chỉ đường”: URL + method nào sẽ chạy middleware nào và controller nào, đảm bảo đúng thứ tự (validate → auth → admin → controller).

---

### 4.7. Controllers – Logic xử lý và trả response

**authController.js:**  
- **register:** Kiểm tra email đã tồn tại chưa (User.findOne). Nếu có → 400 “Email đã được sử dụng”. Nếu chưa → User.create (model tự hash password) → tạo JWT token từ user._id → trả 201 với { user (không có password), token }.  
- **login:** Tìm user theo email (select +password). Không có user → 401 “Email hoặc mật khẩu không đúng”. Có user → so sánh mật khẩu bằng user.comparePassword(password). Sai → 401. Đúng → tạo token, trả { user, token }.  
- **generateToken(id):** Dùng thư viện jsonwebtoken, ký với JWT_SECRET, thời hạn JWT_EXPIRE (vd 7d). Token này Frontend lưu và gửi kèm mọi request cần đăng nhập.

**userController.js:**  
- **getProfile:** req.user đã có (từ middleware protect). Lấy User.findById(req.user.id).select('-password') → trả JSON user.  
- **updateProfile:** Nhận name từ req.body, User.findByIdAndUpdate(req.user.id, { name }) → trả user đã cập nhật (không trả password).

**productController.js:**  
- **getProducts:** Product.find().sort({ createdAt: -1 }) → trả mảng products.  
- **getProductById:** Product.findById(req.params.id). Không tìm thấy → 404. Có → trả product.  
- **createProduct:** Product.create(req.body) (body đã qua validator) → trả 201 và product vừa tạo.  
- **updateProduct:** Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }) → 404 nếu không có, không thì trả product mới.  
- **deleteProduct:** Product.findByIdAndDelete(id) → 404 nếu không có, không thì trả message thành công.

**adminController.js:**  
- **getUsers:** User.find().select('-password').sort({ createdAt: -1 }) → trả mảng users.  
- **deleteUser:** Kiểm tra targetId !== req.user.id (không cho xóa chính mình) → 400 nếu bằng. User.findByIdAndDelete(targetId) → 404 nếu không có, không thì trả message thành công.

**Luồng thực tế:** Mỗi request sau khi qua middleware sẽ tới đúng một controller. Controller đọc req.body, req.params, req.user; gọi Model (User/Product); trả res.json(...) hoặc res.status(...).json(...). Nếu có lỗi (throw hoặc next(err)) thì errorHandler bắt và trả JSON lỗi.

**Tóm lại:** Controllers = “công nhân xử lý”: nhận dữ liệu đã được validate và (nếu cần) đã biết danh tính/quyền qua req.user, thao tác database qua Model, và trả kết quả chuẩn JSON cho Frontend.

---

## 5. Đăng ký, đăng nhập, token và phân quyền – Luồng chi tiết

**Đăng ký (POST /api/auth/register):**  
1. Frontend gửi { name, email, password }.  
2. Backend: authValidator kiểm tra format → validate → authController.register.  
3. register: User.findOne({ email }) → nếu có → 400 “Email đã được sử dụng”.  
4. User.create({ name, email, password }) → Model User pre('save') hash password → lưu vào MongoDB.  
5. generateToken(user._id) → chuỗi JWT.  
6. Trả { user: { id, name, email, role }, token }. Frontend lưu token và user (vd localStorage), coi như “đã đăng nhập”.

**Đăng nhập (POST /api/auth/login):**  
1. Frontend gửi { email, password }.  
2. Backend: loginValidation → login controller.  
3. User.findOne({ email }).select('+password') → không có → 401.  
4. user.comparePassword(password) → so sánh với bcrypt → sai → 401.  
5. Đúng → generateToken(user._id), trả { user, token }. Frontend lưu và dùng token cho các request sau.

**Dùng token (request cần đăng nhập):**  
1. Frontend gửi header Authorization: Bearer &lt;token&gt;.  
2. Backend: middleware protect lấy token → jwt.verify(token, JWT_SECRET) → lấy decoded.id → User.findById(decoded.id) → gắn req.user → next().  
3. Controller dùng req.user.id hoặc req.user.role. Nếu route cần admin thì adminOnly kiểm tra req.user.role === 'admin'.

**Phân quyền:**  
- Route chỉ “đăng nhập” (vd profile, xem/sửa profile): protect là đủ.  
- Route “chỉ admin” (thêm/sửa/xóa sản phẩm, danh sách user, xóa user): protect rồi adminOnly. User thường có token nhưng role !== 'admin' nên bị adminOnly trả 403.

**Tóm lại:** Đăng ký/đăng nhập tạo user và token; token được gửi kèm mọi request “cần đăng nhập”; middleware protect xác định “là ai”, adminOnly xác định “có phải admin không”. Validate đảm bảo dữ liệu đầu vào đúng trước khi vào controller.

---

## 6. CRUD sản phẩm – Luồng và vai trò từng lớp

- **Create (POST /api/products):** Frontend gửi body (name, description, price, category, image). productRoutes: protect → adminOnly → createProductValidation → productValidate → createProduct. Controller: Product.create(req.body) → trả 201 và product.  
- **Read – danh sách (GET /api/products):** Không middleware. getProducts: Product.find().sort({ createdAt: -1 }) → trả mảng.  
- **Read – chi tiết (GET /api/products/:id):** getProductById: Product.findById(req.params.id) → 404 hoặc trả product.  
- **Update (PUT /api/products/:id):** Chỉ admin. updateProductValidation → productValidate → updateProduct: Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).  
- **Delete (DELETE /api/products/:id):** Chỉ admin. deleteProduct: Product.findByIdAndDelete(id).

Mỗi thao tác: Route → (middleware) → Validator (nếu có) → Controller → Model → MongoDB → Response. Error có thể từ validator (400), protect (401), adminOnly (403), controller (404 hoặc next(err)) → errorHandler trả JSON thống nhất.

**Tóm lại:** CRUD sản phẩm đi qua route → middleware (bảo vệ) → validator (kiểm tra dữ liệu) → controller (gọi Model) → Model (Mongoose) → MongoDB. Đọc công khai; tạo/sửa/xóa chỉ admin.

---

## 7. Kết nối Database (MongoDB) và script seed

**Kết nối:** Trong server.js, mongoose.connect(process.env.MONGODB_URI). MONGODB_URI có thể là local (mongodb://localhost:27017/product_management) hoặc Atlas (mongodb+srv://...). Khi connect thành công, mọi Model (User, Product) đều dùng cùng kết nối đó để đọc/ghi.

**Seed (scripts/seed.js):** Script chạy tay (npm run seed). Kết nối DB, kiểm tra đã có user admin@example.com chưa; chưa thì User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' }) (password sẽ được hash bởi Model). Sau đó nếu collection products rỗng thì insertMany 3 sản phẩm mẫu. Dùng để có sẵn tài khoản admin và dữ liệu test.

**Tóm lại:** Database được kết nối một lần khi khởi động server; Model dùng kết nối đó. Seed chỉ là công cụ tạo dữ liệu mẫu, không chạy trong luồng API bình thường.

---

## 8. Xử lý lỗi tập trung (errorHandler)

Mọi middleware hoặc controller có thể gọi next(err) khi gặp lỗi. Express sẽ bỏ qua các handler còn lại và đưa request tới middleware có 4 tham số (err, req, res, next). errorHandler đọc err.statusCode (vd 400, 401, 404) và err.message; trả res.status(statusCode).json({ success: false, message }). Nhờ đó Frontend luôn nhận cùng cấu trúc lỗi và không bị “vỡ” trang khi backend throw.

**Tóm lại:** Một cửa thoát cho mọi lỗi, trả JSON lỗi thống nhất, an toàn cho production (không lộ stack nếu không phải development).

---

## 9. Cách các phần liên kết với nhau

- **server.js** load .env, kết nối MongoDB, rồi app.listen.  
- **app.js** mount routes: /api/auth → authRoutes, /api/users → userRoutes, /api/products → productRoutes, /api/admin → adminRoutes; cuối cùng là errorHandler.  
- Mỗi **route** gắn method + path với chuỗi: [validator (nếu có)] → [protect] → [adminOnly (nếu cần)] → controller.  
- **Controller** dùng Model (User/Product) để đọc/ghi DB và trả res.json.  
- **Model** nói chuyện với MongoDB qua Mongoose; User model thêm hash password và comparePassword.  
- **Middleware** protect/admin chỉ “mở cửa” hoặc trả 401/403; không xử lý nghiệp vụ.  
- **Validator** chỉ “cho qua” hoặc trả 400; không gọi DB.  

Luồng điển hình: Request → app → đúng route → (validation) → (protect) → (adminOnly) → controller → Model → DB → response. Bất kỳ bước nào gọi next(err) → errorHandler → response lỗi.

---

## 10. Tóm tắt bằng ngôn ngữ cực kỳ dễ hiểu

- **Backend** = máy chủ không hiển thị giao diện; nhận yêu cầu từ Frontend, kiểm tra quyền, đọc/ghi database, trả kết quả JSON.  
- **server.js** = khởi động: đọc cấu hình, nối DB, mở cổng cho request.  
- **app.js** = cấu hình chung và “bảng chỉ đường” gửi request vào đúng route.  
- **Model** = mô tả cấu trúc và cách lưu/đọc User, Product; User có hash mật khẩu và so sánh mật khẩu.  
- **Route** = quy định URL + method nào chạy middleware nào và controller nào.  
- **Middleware** = protect (kiểm tra token, biết “ai đang gọi”), adminOnly (chỉ admin mới qua), errorHandler (bắt mọi lỗi, trả JSON lỗi chung).  
- **Validator** = kiểm tra dữ liệu đầu vào trước khi vào controller.  
- **Controller** = nơi xử lý thật: gọi Model, trả JSON thành công hay lỗi.  
- **Đăng ký/đăng nhập** = tạo/user + token; token dùng cho mọi request “cần đăng nhập”; protect và adminOnly dùng token và role để phân quyền.  
- **CRUD** = tạo/đọc/sửa/xóa; đọc sản phẩm công khai, tạo/sửa/xóa chỉ admin; mỗi bước đi qua route → middleware → validator (nếu có) → controller → Model → DB.

Sau khi đọc xong, bạn sẽ hiểu Backend dùng để làm gì, từng file/ thư mục đóng vai trò gì, request đi qua đâu và xử lý thế nào, và Frontend với Backend phối hợp qua API (request/response, token) như thế nào.
