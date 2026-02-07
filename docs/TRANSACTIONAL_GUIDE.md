# Hướng Dẫn @Transactional trong Spring

## 1. @Transactional dùng để làm gì?

`@Transactional` đảm bảo các thao tác database trong một method được thực hiện trong **một transaction duy nhất**:

- ✅ **Atomicity**: Tất cả hoặc không có gì (all or nothing)
- ✅ **Rollback tự động**: Nếu có exception, tất cả thay đổi sẽ bị rollback
- ✅ **Quản lý connection**: Spring tự động quản lý database connection

### Ví dụ:

```java
@Transactional
public void updateUserPermission(Long userId, List<UserPermissionDTO> request) {
    // Thao tác 1: Xóa permissions cũ
    userPermissionRepository.deleteAllByUserId(userId);

    // Thao tác 2: Lưu permissions mới
    userPermissionRepository.saveAll(request.stream()...);

    // Nếu thao tác 2 lỗi → thao tác 1 cũng bị rollback
}
```

---

## 2. Các Loại Propagation (Transaction Type)

Propagation quyết định **cách transaction hoạt động** khi method được gọi từ method khác đã có transaction.

### 2.1. REQUIRED (Mặc định) ⭐ **Dùng nhiều nhất**

```java
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
  // Nếu đã có transaction → dùng transaction đó
  // Nếu chưa có → tạo transaction mới
}
```

**Hành vi:**

- Nếu method được gọi từ transaction khác → **dùng chung transaction**
- Nếu không có transaction → **tạo transaction mới**

**Ví dụ:**

```java
@Transactional
public void createUser(UserDTO userDTO) {
  userRepository.save(user); // Transaction 1

  updateUserProfile(user); // Dùng chung Transaction 1
  sendEmail(user); // Dùng chung Transaction 1
}

@Transactional(propagation = Propagation.REQUIRED)
public void updateUserProfile(User user) {
  // Dùng chung transaction từ createUser()
}
```

**Khi nào dùng:** Hầu hết các trường hợp (mặc định)

---

### 2.2. REQUIRES_NEW

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void methodB() {
  // Luôn tạo transaction MỚI, bất kể có transaction hay không
}
```

**Hành vi:**

- **Luôn tạo transaction mới**, bất kể có transaction hay không
- Transaction mới **độc lập** với transaction cũ

**Ví dụ:**

```java
@Transactional
public void processOrder(Order order) {
  orderRepository.save(order); // Transaction 1

  logOrder(order); // Transaction 2 (MỚI, độc lập)

  // Nếu logOrder() lỗi → chỉ rollback Transaction 2
  // Transaction 1 vẫn commit thành công
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logOrder(Order order) {
  // Luôn tạo transaction mới, độc lập
  auditLogRepository.save(new AuditLog(order));
}
```

**Khi nào dùng:**

- Logging/Audit (không muốn ảnh hưởng transaction chính)
- Gửi email/notification (không muốn rollback khi email lỗi)

---

### 2.3. SUPPORTS

```java
@Transactional(propagation = Propagation.SUPPORTS)
public void methodC() {
  // Nếu có transaction → dùng
  // Nếu không có → chạy không transaction
}
```

**Hành vi:**

- Có transaction → dùng
- Không có transaction → chạy bình thường (không transaction)

**Ví dụ:**

```java
@Transactional
public void updateUser(User user) {
  userRepository.save(user);
  logActivity(user); // Dùng transaction
}

public void readUser(Long id) {
  logActivity(id); // Chạy không transaction
}

@Transactional(propagation = Propagation.SUPPORTS)
public void logActivity(Object data) {
  // Có transaction thì dùng, không có thì thôi
  activityLogRepository.save(new ActivityLog(data));
}
```

**Khi nào dùng:** Method có thể chạy với hoặc không có transaction

---

### 2.4. MANDATORY

```java
@Transactional(propagation = Propagation.MANDATORY)
public void methodD() {
  // BẮT BUỘC phải có transaction
  // Nếu không có → throw Exception
}
```

**Hành vi:**

- **Bắt buộc** phải có transaction từ bên ngoài
- Nếu không có → throw `IllegalTransactionStateException`

**Ví dụ:**

```java
@Transactional
public void processPayment(Payment payment) {
  paymentRepository.save(payment);
  updateBalance(payment); // OK - có transaction
}

public void readPayment(Long id) {
  updateBalance(id); // ❌ LỖI - không có transaction
}

@Transactional(propagation = Propagation.MANDATORY)
public void updateBalance(Payment payment) {
  // Bắt buộc phải có transaction
  balanceRepository.update(payment.getAmount());
}
```

**Khi nào dùng:** Method **bắt buộc** phải chạy trong transaction

---

### 2.5. NOT_SUPPORTED

```java
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void methodE() {
  // Tạm dừng transaction hiện tại
  // Chạy method này KHÔNG có transaction
}
```

**Hành vi:**

- **Tạm dừng** transaction hiện tại
- Chạy method **không có transaction**
- Sau khi method xong → tiếp tục transaction cũ

**Ví dụ:**

```java
@Transactional
public void processOrder(Order order) {
  orderRepository.save(order); // Transaction 1

  sendEmail(order); // Tạm dừng Transaction 1, chạy không transaction

  // Tiếp tục Transaction 1
  orderRepository.updateStatus(order, "PROCESSED");
}

@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void sendEmail(Order order) {
  // Chạy không transaction (tạm dừng transaction từ processOrder)
  emailService.send(order);
}
```

**Khi nào dùng:** Method không cần transaction (như gọi external API)

---

### 2.6. NEVER

```java
@Transactional(propagation = Propagation.NEVER)
public void methodF() {
  // KHÔNG được gọi từ transaction
  // Nếu có transaction → throw Exception
}
```

**Hành vi:**

- **Không được** gọi từ transaction
- Nếu có transaction → throw `IllegalTransactionStateException`

**Ví dụ:**

```java
@Transactional
public void updateUser(User user) {
  userRepository.save(user);
  validateUser(user); // ❌ LỖI - không được gọi từ transaction
}

@Transactional(propagation = Propagation.NEVER)
public void validateUser(User user) {
  // Không được gọi từ transaction
  if (user.getEmail() == null) {
    throw new ValidationException();
  }
}
```

**Khi nào dùng:** Method **không được** chạy trong transaction (hiếm dùng)

---

### 2.7. NESTED

```java
@Transactional(propagation = Propagation.NESTED)
public void methodG() {
  // Tạo "nested transaction" (savepoint)
  // Nếu lỗi → chỉ rollback nested transaction
  // Transaction cha vẫn tiếp tục
}
```

**Hành vi:**

- Tạo **savepoint** (nested transaction)
- Nếu lỗi → chỉ rollback đến savepoint
- Transaction cha vẫn tiếp tục

**Lưu ý:** Chỉ hoạt động với **JDBC**, không hoạt động với **JPA/Hibernate**

**Ví dụ:**

```java
@Transactional
public void processOrder(Order order) {
  orderRepository.save(order); // Transaction cha

  try {
    processPayment(order); // Nested transaction
  } catch (Exception e) {
    // Chỉ rollback processPayment()
    // orderRepository.save() vẫn commit
  }
}

@Transactional(propagation = Propagation.NESTED)
public void processPayment(Order order) {
  // Tạo savepoint
  paymentRepository.save(new Payment(order));
  // Nếu lỗi → chỉ rollback đến đây
}
```

**Khi nào dùng:** Khi muốn rollback một phần (chỉ với JDBC)

---

## 3. Các Thuộc Tính Khác

### 3.1. readOnly

```java
@Transactional(readOnly = true) // ⭐ Dùng cho read operations
public User getUser(Long id) {
  return userRepository.findById(id);
}
```

**Lợi ích:**

- Tối ưu performance (không cần flush)
- Rõ ràng intent (method chỉ đọc)
- Một số DB có thể tối ưu query

---

### 3.2. rollbackFor

```java
@Transactional(rollbackFor = Exception.class) // Rollback cho TẤT CẢ exception
public void updateUser(User user) {
  // Mặc định chỉ rollback cho RuntimeException
  // Với rollbackFor = Exception.class → rollback cho cả checked exception
}
```

**Mặc định:** Chỉ rollback cho `RuntimeException` và `Error`

**Với `rollbackFor = Exception.class`:** Rollback cho **tất cả** exception

---

### 3.3. timeout

```java
@Transactional(timeout = 30) // Timeout sau 30 giây
public void processLargeData() {
  // Nếu chạy quá 30 giây → rollback
}
```

---

### 3.4. isolation

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void updateUser(User user) {
  // Kiểm soát isolation level
}
```

**Các level:**

- `READ_UNCOMMITTED` - Đọc được dữ liệu chưa commit (dirty read)
- `READ_COMMITTED` - Chỉ đọc dữ liệu đã commit (mặc định)
- `REPEATABLE_READ` - Đảm bảo đọc lại cùng kết quả
- `SERIALIZABLE` - Đảm bảo tuần tự hóa hoàn toàn

---

## 4. Best Practices

### ✅ Nên làm:

1. **Dùng `@Transactional` cho write operations:**

```java
@Transactional
public void createUser(User user) {
  userRepository.save(user);
}
```

2. **Dùng `@Transactional(readOnly = true)` cho read operations:**

```java
@Transactional(readOnly = true)
public User getUser(Long id) {
  return userRepository.findById(id);
}
```

3. **Đặt ở Service layer, không phải Repository:**

```java
@Service
@Transactional // ✅ Đúng
public class UserService {
  // ...
}

@Repository
@Transactional // ❌ Không nên
public class UserRepository {
  // ...
}
```

4. **Dùng `rollbackFor = Exception.class` khi cần:**

```java
@Transactional(rollbackFor = Exception.class)
public void importUsers(List<User> users) {
  // Rollback cả khi có checked exception
}
```

### ❌ Không nên:

1. **Không đặt `@Transactional` ở Controller:**

```java
@RestController
@Transactional // ❌ Không nên
public class UserController {
  // ...
}
```

2. **Không dùng `@Transactional` cho private methods:**

```java
@Transactional // ❌ Không hoạt động (Spring proxy)
private void helperMethod() {
  // ...
}
```

3. **Không dùng `@Transactional` cho async methods:**

```java
@Transactional // ❌ Không hoạt động
@Async
public void sendEmail() {
  // ...
}
```

---

## 5. Ví Dụ Thực Tế Trong Codebase

### Ví dụ 1: UserService (Class level)

```java
@Service
@Transactional(rollbackFor = Exception.class) // Tất cả methods đều có transaction
public class UserService {

  public UserDTO findById(Long id) {
    // Tự động có transaction
  }

  @Transactional(readOnly = true) // Override cho read-only
  public SearchResponse<UserDTO> searchDatatable(SearchRequest request) {
    // Read-only transaction
  }
}
```

### Ví dụ 2: AuthService (Method level)

```java
@Service
public class AuthService {

  @Transactional // Chỉ method này có transaction
  public AuthenticateResponse authenticate(LoginRequest request) {
    // ...
  }

  @Transactional(readOnly = true) // Read-only
  public UserProfileDTO getProfile(String username) {
    // ...
  }
}
```

---

## 6. Tóm Tắt

| Propagation             | Khi nào dùng                            |
| ----------------------- | --------------------------------------- |
| **REQUIRED** (mặc định) | ⭐ Hầu hết các trường hợp               |
| **REQUIRES_NEW**        | Logging, email, audit (độc lập)         |
| **SUPPORTS**            | Method có thể có hoặc không transaction |
| **MANDATORY**           | Method bắt buộc phải có transaction     |
| **NOT_SUPPORTED**       | Method không cần transaction            |
| **NEVER**               | Method không được gọi từ transaction    |
| **NESTED**              | Rollback một phần (chỉ JDBC)            |

**Quy tắc vàng:**

- ✅ Write operations → `@Transactional`
- ✅ Read operations → `@Transactional(readOnly = true)`
- ✅ Đặt ở Service layer
- ✅ Dùng `REQUIRED` (mặc định) cho hầu hết trường hợp
