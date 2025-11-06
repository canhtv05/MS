# README — Hướng dẫn cài đặt & chạy (MS microservices)

Tệp này thay thế hướng dẫn trước đó trong `docs/README.md`. Nội dung dưới đây hướng dẫn chi tiết từng bước 1 để bạn có thể cài đặt và khởi hệ thống microservices trên máy Windows (PowerShell). Nội dung cũng giải thích vai trò các service chính trong repo.

## Tổng quan ngắn

- Registry: `discovery-server` (Eureka) — port mặc định: 8761
- Authentication service: `auth` — đăng ký với Eureka (defaultZone -> http://localhost:8761/eureka)
- API Gateway: `gateway` — client của Eureka, route đến các service
- File service: `file` — xử lý upload/download file
- Shared models: `common-object` — proto / DTO dùng chung
- Frontend: `web-client` — Next.js (dev server: http://localhost:3000)
- Postman collection: `docs/postman/MS.postman_collection.json`

## Yêu cầu (Prerequisites)

- Java 17+ (hoặc phiên bản phù hợp với cấu hình project)
- Docker & Docker Compose (để khởi DB, repo có folder `.devcontainer` với `docker-compose.yml` và `init-db.sql` / `mongo-init.js`)
- Git
- Maven (dùng wrapper: `mvnw` / `mvnw.cmd` có sẵn)
- Node.js + npm (để chạy `web-client`)
- Postman (đã có collection trong `docs/postman`)

Ghi chú: hướng dẫn lệnh dưới dùng PowerShell (Windows). Dùng `.
mvnw.cmd` để gọi Maven wrapper trên Windows.

## File cấu hình Docker (DB) trong repo

Có một cấu hình Docker để khởi DB (được dùng cho development) nằm trong:

.devcontainer/docker-compose.yml

File `.devcontainer` còn chứa `init-db.sql` và `mongo-init.js` để khởi dữ liệu ban đầu — dùng khi bạn muốn chạy DB theo môi trường dev.

## Thứ tự khởi chạy chính (từng bước 1)

1. Khởi Discovery Server (Eureka)

   Mục đích: cung cấp service registry. Phải khởi trước để các service client (auth, gateway, ...) có thể đăng ký.

   PowerShell:

```powershell
cd d:\MY_PROJECT\MS\discovery-server
.\mvnw.cmd spring-boot:run
```

Sau khi chạy, kiểm tra Eureka UI: http://localhost:8761 (mặc định port cấu hình là 8761).

2. Khởi Docker DB (chạy container database cho `auth`)

   Nếu bạn muốn dùng docker-compose trong repo (tốt cho local dev):

```powershell
cd d:\MY_PROJECT\MS\.devcontainer
docker-compose up -d
docker ps
```

- Kiểm tra logs nếu cần:

```powershell
docker-compose logs -f
```

- Nếu Docker không bật, bật Docker Desktop trước khi chạy.

3. Khởi Auth service

   Khi DB đã sẵn sàng và `discovery-server` đang chạy, khởi `auth`:

```powershell
cd d:\MY_PROJECT\MS\auth
.\mvnw.cmd spring-boot:run
```

- `auth` đã cấu hình `eureka.client.serviceUrl.defaultZone: http://localhost:8761/eureka` (xem `auth/src/main/resources/application.yml`).
- Kiểm tra trong Eureka UI để thấy service `auth` đăng ký.

4. Khởi Gateway

```powershell
cd d:\MY_PROJECT\MS\gateway
.\mvnw.cmd spring-boot:run
```

- Gateway là điểm vào (entrypoint) cho client; nó dùng Eureka để discover các service backend.

5. Khởi File service và các service khác

```powershell
cd d:\MY_PROJECT\MS\file
.\mvnw.cmd spring-boot:run

# Hoặc build trước khi chạy (nếu cần):
.\mvnw.cmd clean package -DskipTests
java -jar target\*.jar
```

- Lặp lại cho các service khác nếu có (ví dụ service mới, hoặc `common-object` nếu có module service thực thi).

6. Chạy Frontend (web-client)

```powershell
cd d:\MY_PROJECT\MS\web-client
npm install
npm run dev
```

- Giao diện dev mặc định: http://localhost:3000

## Kiểm tra nhanh (smoke checks)

- Kiểm tra Eureka UI: http://localhost:8761 — các service đã đăng ký sẽ xuất hiện.
- Kiểm tra logs console của từng service để biết lỗi khởi động.
- Sử dụng Postman (collection trong `docs/postman`) để gửi request test, nhớ lấy token (nếu endpoint cần auth).

## Giải thích ngắn về các service trong repo

- discovery-server: Spring Boot app chạy Eureka server. Vai trò: service registry cho hệ thống.
- auth: Service xác thực, quản lý user/role, kết nối DB (migrations/liquibase có trong `auth/src/main/resources/liquibase`). Đăng ký với Eureka (xem `application.yml`).
- gateway: API Gateway (Spring Cloud / Netflix stack), route request đến các service dựa trên tên service đăng ký trong Eureka.
- file: Service xử lý upload/download file. Thường kèm config Cloudinary (xem `file/src/main/java/.../config/CloudinaryConfig.java`).
- common-object: chứa proto (`src/main/proto`) và DTO, enums, utils dùng chung giữa các service.
- web-client: Frontend (Next.js) giao tiếp tới gateway hoặc trực tiếp tới service tuỳ cấu hình.

## Postman

- Collection: `docs/postman/MS.postman_collection.json`
- Environment: `docs/postman/MS.postman_environment.json`

Hướng dẫn import: Postman > Import > chọn 2 file trên > chọn environment > chạy requests.

## Troubleshooting & Tips

- Nếu service không tự đăng ký Eureka: kiểm tra `spring.application.name`, `server.port` và `eureka.client.serviceUrl.defaultZone` trong `application.yml`.
- Nếu port trùng: đổi `server.port` trong `application.yml` tương ứng.
- Dùng `.
mvnw.cmd spring-boot:run` cho Windows (PowerShell) để đảm bảo wrapper được dùng.
- Nếu DB không kết nối: kiểm tra biến môi trường `.env` (nếu sử dụng) và config trong `application.yml` của service.

## Muốn tự động hóa (tùy chọn)

- Mình có thể thêm script PowerShell ở repo root để chạy theo thứ tự và chờ từng service sẵn sàng (ví dụ: chờ Eureka trả về danh sách instances của `auth` trước khi start gateway).
