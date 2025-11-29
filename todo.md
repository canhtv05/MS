// TODO:

# Auth

- Tạo API khóa tài khoản(ok) + gỡ khóa tài khoản(ok) + tạo bảng lý do khóa tài khoản(admin)
- Tạo API quên mật khẩu
- Kiểm tra email ko được chứa dấu + (ok)

# Notification

- Tạo bảng mới: email_verification_logs gồm các trường: (done)
  - userId: string
  - emailVerified: boolean
  - lastVerifyTokenCreatedAt: Instant
  - verifiedAt: Instant
  - verificationStatus: enum (PENDING, VERIFIED, EXPIRED)
  - flow: tạo tài khoản sẽ lưu vào db và redis(cache 10p), khi user verify qua url fe sẽ call tới noti
    nếu token hợp lệ -> ok update email verify log và xóa redis
    nếu redis ko có token -> check nếu đã verify(db) -> ok (1)
    nếu redis ko có token -> check nếu chưa verify(db)(status:pending) -> token hết hạn (2)
    nếu redis ko có token -> ko phải (1) vả (2) -> expired or invalid token (3)
