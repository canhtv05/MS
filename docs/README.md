# Hướng dẫn cài đặt & chạy (MS microservices)

Tài liệu này mô tả cách chuẩn bị môi trường, thứ tự khởi chạy các service trong workspace và cách dùng file Postman có sẵn.

## Mục tiêu

- Cung cấp hướng dẫn nhanh để chạy hệ thống microservices local.
- Giải thích mục đích của từng service chính.

## Yêu cầu (Prerequisites)

- Java 21+ (hoặc phiên bản tương thích với project)
- Docker & Docker Compose (để khởi DB cho `auth`)
- Git
- Maven (repo có sẵn wrapper `mvnw` / `mvnw.cmd` - dùng ưu tiên)
- Node.js + npm (để chạy `web-client`)
- Postman (đã có collection trong `docs/postman`)

> Lưu ý: hướng dẫn các lệnh dưới dùng PowerShell trên Windows; thay `./mvnw` bằng `.\mvnw.cmd` khi chạy trên Windows.

## Cấu trúc thư mục quan trọng

- `discovery-server/` — Eureka / Service Registry (port config: 8761)
- `auth/` — Service xác thực (có cấu hình đăng ký Eureka tới `http://localhost:8761/eureka`)
- `gateway/` — API Gateway (Eureka client)
- `common-object/` — Shared proto / model
- `web-client/` — Frontend (Next.js)
- `docs/postman/` — Postman collection & environment (tệp: `MS.postman_collection.json`, `MS.postman_environment.json`)

## Mục đích các service (tóm tắt)

- discovery-server: registry (Eureka). Tất cả service sẽ đăng ký ở đây để gateway và các service khác có thể discover.
- auth: xử lý đăng nhập/đăng ký, cung cấp token/session, kết nối DB (cấu hình DB trong `auth/dev/docker-compose.yml`).
- gateway: tiếp nhận các request client, route đến service tương ứng (sử dụng Eureka để tìm instance).
- common-object: các đối tượng/Proto dùng chung giữa service và client.
- web-client: giao diện người dùng (Next.js).

## Thứ tự khởi chạy (recommended)

1. Start Discovery Server (Eureka)
   - Mục đích: làm service registry, bắt buộc khởi trước để các service client đăng ký.
   - Thực hiện (PowerShell):

```powershell
cd discovery-server
.\mvnw.cmd spring-boot:run
```

- Sau khi chạy, mở trình duyệt vào: http://localhost:8761 để kiểm tra Eureka UI (port cá biệt được cấu hình là 8761).

2. Start DB (docker) cho `auth`
   - File docker-compose nằm ở `auth/dev/docker-compose.yml`.
   - Thực hiện:

```powershell
cd auth/dev
docker-compose up -d
# Kiểm tra container
docker ps
```

- Đảm bảo Docker đang chạy trước khi thực hiện.

3. Start Auth service
   - Sau khi DB sẵn sàng, khởi service `auth`:

```powershell
cd ..\..\auth
.\mvnw.cmd spring-boot:run
```

- `auth` trong `application.yml` đã cấu hình đăng ký vào `http://localhost:8761/eureka` — kiểm tra trong Eureka UI để thấy `auth` đăng ký thành công.

4. Start Gateway
   - Khởi gateway để route đến service đã đăng ký:

```powershell
cd ..\gateway
.\mvnw.cmd spring-boot:run
```

5. Khởi các service khác
   - Lặp lại các bước build/run (cùng kiểu với `auth`/`gateway`) cho các service khác (ví dụ `common-object` nếu cần chạy service thực thi). Thường dùng:

```powershell
.\mvnw.cmd clean package -DskipTests
.\mvnw.cmd spring-boot:run
```

6. Chạy Frontend (`web-client`)
   - Vào folder `web-client` (Next.js). Tệp `package.json` có script `dev` -> `next dev`.

```powershell
cd ..\web-client
npm install
npm run dev
```

- Mở trang dev (mặc định Next.js): http://localhost:3000

## Build toàn bộ (tùy chọn)

- Nếu muốn build từng module thành jar trước khi chạy (ví dụ để chạy bằng `java -jar`):

```powershell
cd <service-folder>
.\mvnw.cmd clean package -DskipTests
# rồi chạy jar:
java -jar target\*.jar
```

## Postman

- Postman collection và environment đã có trong repo: `docs/postman/MS.postman_collection.json` và `docs/postman/MS.postman_environment.json`.
- Hướng dẫn import:
  1. Mở Postman > Import > chọn file `MS.postman_collection.json`.
  2. Import environment `MS.postman_environment.json` nếu cần, rồi chọn environment đó.
  3. Chạy collection hoặc từng request, kiểm tra header Authorization (nếu endpoint cần token).

## Kiểm tra & Troubleshooting nhanh

- Nếu service không đăng ký vào Eureka: kiểm tra application.yml của service (trường `eureka.client.serviceUrl.defaultZone`) — trong repo `auth` đã trỏ tới `http://localhost:8761/eureka`.
- Nếu Docker DB không khởi: kiểm tra logs: `docker-compose logs -f` trong `auth/dev`.
- Kiểm tra logs của app: Maven run sẽ in log; hoặc xem `target`/`logs` (nếu cấu hình logging riêng).
- Nếu cổng bị trùng: dừng process chiếm cổng hoặc thay port trong `application.yml` tương ứng.

## Ghi chú thêm

- Các lệnh ở trên dùng wrapper Maven (`mvnw.cmd`) cho Windows để đảm bảo version Maven chính xác.
- Nếu bạn muốn khởi nhiều service cùng lúc, có thể viết script PowerShell hoặc sử dụng một orchestrator, nhưng khuyến nghị khởi `discovery-server` & DB trước rồi mới khởi các service client.

---

Nếu bạn muốn, mình có thể:

- Thêm script PowerShell tự động khởi theo thứ tự (discovery->docker->auth->gateway->web-client).
- Thêm check tự động (health endpoint) để chờ service sẵn sàng trước khi chuyển bước.

File Postman nằm tại: `docs/postman/MS.postman_collection.json` và `docs/postman/MS.postman_environment.json`.

Chúc bạn khởi chạy thành công.
