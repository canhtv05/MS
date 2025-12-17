# 🚀 Hướng dẫn sử dụng Ngrok

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Cài đặt Ngrok](#-cài-đặt-ngrok)
- [Cấu hình Ngrok](#-cấu-hình-ngrok)
- [Chạy Ngrok](#-chạy-ngrok)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Giới thiệu

Ngrok cho phép bạn expose local server ra internet thông qua một URL public. Điều này rất hữu ích khi:

- Test webhook từ third-party services
- Demo ứng dụng cho client/team
- Test trên mobile device
- Integrate với external APIs yêu cầu public URL

### Kiến trúc hiện tại

```
Internet (Ngrok URL)
    ↓
https://xyz.ngrok.io
    ↓
    ├─→ / (Frontend) → Next.js (localhost:3000)
    └─→ /api/proxy/* → Next.js Rewrite → Spring Gateway (localhost:1000/api/v1/*)
```

**Lợi ích:**
✅ Chỉ cần 1 ngrok tunnel (port 3000)  
✅ Frontend và Backend cùng domain → Không cần CORS  
✅ Next.js tự động proxy API requests  
✅ SSL/HTTPS tự động (ngrok cung cấp)

---

## 📦 Cài đặt Ngrok

### 1. Download Ngrok

**Windows:**

```bash
# Sử dụng Chocolatey
choco install ngrok

# Hoặc download trực tiếp từ
# https://ngrok.com/download
```

**macOS:**

```bash
# Sử dụng Homebrew
brew install ngrok/ngrok/ngrok
```

**Linux:**

```bash
# Using snap
snap install ngrok
```

### 2. Tạo tài khoản Ngrok (miễn phí)

1. Truy cập: https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản (miễn phí)
3. Copy authtoken từ dashboard

### 3. Xác thực Ngrok

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

Thay `YOUR_AUTHTOKEN_HERE` bằng authtoken từ ngrok dashboard.

---

## ⚙️ Cấu hình Ngrok

### Cấu hình cơ bản (không cần file config)

Chỉ cần chạy lệnh ngrok trực tiếp - không cần config file!

### Cấu hình nâng cao (tùy chọn)

Nếu muốn custom domain hoặc nhiều tunnel, tạo file `ngrok.yml`:

**Location:**

- Windows: `C:\Users\{username}\.ngrok2\ngrok.yml`
- macOS/Linux: `~/.ngrok2/ngrok.yml`

**Nội dung:**

```yaml
version: '2'
authtoken: YOUR_AUTHTOKEN_HERE

tunnels:
  web-app:
    proto: http
    addr: 3000
    inspect: true
    # Uncomment nếu có custom domain (ngrok paid plan)
    # hostname: your-custom-domain.ngrok.io
```

---

## 🚀 Chạy Ngrok

### Bước 1: Start Backend Services

```bash
# Terminal 1: Start Gateway
cd d:\MY_PROJECT\MS\gateway
.\mvnw spring-boot:run

# Terminal 2: Start Auth Service
cd d:\MY_PROJECT\MS\auth
$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run

# Terminal 3: Start Profile Service
cd d:\MY_PROJECT\MS\profile
$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run

# Terminal 4: Start File Service
cd d:\MY_PROJECT\MS\file
$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run

# Terminal 5: Start Notification Service
cd d:\MY_PROJECT\MS\notification
.\mvnw spring-boot:run
```

### Bước 2: Start Frontend

```bash
# Terminal 6: Start Next.js
cd d:\MY_PROJECT\MS\web-client
npm run dev
```

✅ Đợi đến khi thấy: `✓ Ready in xxxms` và `- Local: http://localhost:3000`

### Bước 3: Start Ngrok

```bash
# Terminal 7: Start Ngrok
ngrok http 3000
```

### Bước 4: Sử dụng Ngrok URL

Sau khi chạy, bạn sẽ thấy output như sau:

```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       20ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc-xyz-123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**URL của bạn:**

- Public URL: `https://abc-xyz-123.ngrok-free.app`
- Ngrok Inspector (xem requests): `http://127.0.0.1:4040`

### Bước 5: Test

**Frontend:**

```bash
# Truy cập
https://abc-xyz-123.ngrok-free.app
```

**Backend API:**

```bash
# Test auth endpoint
curl https://abc-xyz-123.ngrok-free.app/api/proxy/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test profile endpoint
curl https://abc-xyz-123.ngrok-free.app/api/proxy/user-profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💡 Best Practices

### 1. Sử dụng Ngrok Inspector

Truy cập `http://127.0.0.1:4040` để xem:

- Tất cả HTTP requests/responses
- Request headers, body
- Response status, timing
- Replay requests

### 2. Bảo mật

```bash
# Thêm basic auth (ngrok paid plan)
ngrok http 3000 --basic-auth="username:password"

# Chỉ cho phép IP cụ thể (ngrok paid plan)
ngrok http 3000 --cidr-allow="1.2.3.4/32"
```

### 3. Custom subdomain (ngrok paid plan)

```bash
ngrok http 3000 --subdomain=my-awesome-app
# Sẽ tạo URL: https://my-awesome-app.ngrok.io
```

### 4. Chạy ngrok ở background

**Windows (PowerShell):**

```powershell
Start-Process -NoNewWindow ngrok -ArgumentList "http 3000"
```

**Linux/macOS:**

```bash
ngrok http 3000 > /dev/null &
```

### 5. Environment Variables (Production)

Khi deploy production, update `.env`:

```env
# web-client/.env
NEXT_PUBLIC_API_BACKEND_URL=https://abc-xyz-123.ngrok-free.app/api/proxy
NEXT_PUBLIC_API_FRONTEND_URL=/api/proxy
```

---

## 🔧 Troubleshooting

### ❌ Lỗi: "Tunnel not found"

**Nguyên nhân:** Ngrok chưa được authenticate

**Giải pháp:**

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### ❌ Lỗi: "Port already in use"

**Nguyên nhân:** Port 4040 (ngrok web interface) đã được sử dụng

**Giải pháp:**

```bash
# Sử dụng port khác cho web interface
ngrok http 3000 --web-addr=localhost:4041
```

### ❌ Lỗi: "ERR_NGROK_108"

**Nguyên nhân:** Free plan chỉ cho phép 1 tunnel cùng lúc

**Giải pháp:**

- Kill tất cả ngrok processes đang chạy
- Chỉ chạy 1 tunnel

```bash
# Windows
taskkill /F /IM ngrok.exe

# Linux/macOS
pkill ngrok
```

### ❌ API calls fail với 502 Bad Gateway

**Nguyên nhân:** Backend services chưa chạy hoặc Next.js rewrite config sai

**Giải pháp:**

1. Kiểm tra tất cả backend services đang chạy:

   ```bash
   # Gateway phải chạy ở port 1000
   curl http://localhost:1000/api/v1/auth/me
   ```

2. Kiểm tra Next.js config:
   ```typescript
   // next.config.ts
   async rewrites() {
     return [
       {
         source: '/api/proxy/:path*',
         destination: 'http://localhost:1000/api/v1/:path*',
       },
     ];
   }
   ```

### ❌ CORS errors

**Nguyên nhân:** Đang gọi trực tiếp backend URL thay vì qua Next.js rewrite

**Giải pháp:**
Kiểm tra axios baseURL:

```typescript
// utils/api.ts
export const api = axios.create({
  baseURL: '/api/proxy', // ✅ Đúng
  // baseURL: 'http://localhost:1000/api/v1', // ❌ Sai
});
```

### ❌ Ngrok URL không accessible từ mobile

**Kiểm tra:**

1. Firewall không block ngrok
2. Sử dụng HTTPS URL (không phải HTTP)
3. Mobile và laptop cùng network (nếu test local)

---

## 📚 Resources

- **Ngrok Documentation:** https://ngrok.com/docs
- **Ngrok Dashboard:** https://dashboard.ngrok.com
- **Ngrok Pricing:** https://ngrok.com/pricing
- **Next.js Rewrites:** https://nextjs.org/docs/app/api-reference/next-config-js/rewrites

---

## 🎯 Quick Reference

### Lệnh thường dùng

```bash
# Start ngrok on port 3000
ngrok http 3000

# Start ngrok với custom region
ngrok http 3000 --region=ap  # Asia Pacific

# Start ngrok và xem log
ngrok http 3000 --log=stdout

# Start ngrok với custom host header
ngrok http 3000 --host-header="localhost:3000"

# Stop ngrok
Ctrl + C
```

### Ports sử dụng

| Service          | Port | URL                   |
| ---------------- | ---- | --------------------- |
| Next.js          | 3000 | http://localhost:3000 |
| Gateway          | 1000 | http://localhost:1000 |
| Auth Service     | 8081 | http://localhost:8081 |
| Profile Service  | 8082 | http://localhost:8082 |
| File Service     | 8083 | http://localhost:8083 |
| Notification     | 8084 | http://localhost:8084 |
| Discovery Server | 8761 | http://localhost:8761 |
| Ngrok Inspector  | 4040 | http://localhost:4040 |

---

## ✅ Checklist khi chạy production

- [ ] Tất cả backend services đang chạy
- [ ] Next.js dev server đang chạy trên port 3000
- [ ] Ngrok authenticated với authtoken
- [ ] Ngrok tunnel đang active
- [ ] Test frontend URL (https://xyz.ngrok.io)
- [ ] Test backend API (https://xyz.ngrok.io/api/proxy/...)
- [ ] Check Ngrok Inspector (http://localhost:4040)
- [ ] Update environment variables nếu cần

---

**Happy coding! 🚀**
