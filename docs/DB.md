# Database Design — Online Bookstore

## Entities & Attributes

### 1. User

| Thuộc tính         | Kiểu             | Ghi chú                       |
| ------------------ | ---------------- | ----------------------------- |
| id                 | UUID (PK)        |                               |
| email              | VARCHAR (unique) |                               |
| password           | VARCHAR          | nullable (OAuth user)         |
| full_name          | VARCHAR          |                               |
| phone              | VARCHAR          | nullable                      |
| avatar_public_id   | VARCHAR          | nullable (Cloudinary)         |
| role               | ENUM             | `CUSTOMER`, `ADMIN`           |
| is_active          | BOOLEAN          | Mở/khóa tài khoản (ban)       |
| email_verified     | BOOLEAN          | Trạng thái xác thực email     |
| provider           | ENUM             | `LOCAL`, `GOOGLE`, `FACEBOOK` |
| provider_id        | VARCHAR          | nullable — ID từ OAuth        |
| hash_refresh_token | VARCHAR          | nullable — Token refresh      |
| last_login_at      | TIMESTAMP        | nullable                      |
| created_at         | TIMESTAMP        |                               |
| updated_at         | TIMESTAMP        |                               |

### 2. VerificationToken

| Thuộc tính | Kiểu      | Ghi chú                                |
| ---------- | --------- | -------------------------------------- |
| id         | UUID (PK) |                                        |
| email      | VARCHAR   | Email nhận mã                          |
| token      | VARCHAR   | Mã OTP                                 |
| type       | ENUM      | `EMAIL_VERIFICATION`, `PASSWORD_RESET` |
| expires_at | TIMESTAMP | Thời gian hết hạn                      |
| created_at | TIMESTAMP |                                        |

### 3. Address

| Thuộc tính     | Kiểu      | Ghi chú                          |
| -------------- | --------- | -------------------------------- |
| id             | UUID (PK) |                                  |
| user_id        | UUID (FK) |                                  |
| receiver_name  | VARCHAR   | Tên người nhận                   |
| phone          | VARCHAR   |                                  |
| province       | VARCHAR   |                                  |
| ward           | VARCHAR   | Phường                           |
| detail_address | VARCHAR   | Số nhà, đường...                 |
| is_default     | BOOLEAN   | Địa chỉ mặc định (fast checkout) |
| created_at     | TIMESTAMP |                                  |
| updated_at     | TIMESTAMP |                                  |

> **Note**: Mỗi user tối đa 3 địa chỉ. Không có district vì VN đã bỏ đơn vị hành chính này.

### 4. Category

| Thuộc tính      | Kiểu      | Ghi chú                                   |
| --------------- | --------- | ----------------------------------------- |
| id              | UUID (PK) |                                           |
| name            | VARCHAR   | Văn học, Khoa học, Thiếu nhi, Kinh tế,... |
| description     | TEXT      |                                           |
| image_public_id | VARCHAR   | nullable (Cloudinary)                     |
| parent_id       | UUID (FK) | nullable — danh mục cha-con               |
| is_active       | BOOLEAN   | Soft delete                               |
| created_at      | TIMESTAMP |                                           |
| updated_at      | TIMESTAMP |                                           |

### 5. Product (Book)

| Thuộc tính      | Kiểu      | Ghi chú                               |
| --------------- | --------- | ------------------------------------- |
| id              | UUID (PK) |                                       |
| name            | VARCHAR   | Tên sách                              |
| description     | TEXT      | Mô tả chi tiết                        |
| category_id     | UUID (FK) |                                       |
| author          | VARCHAR   | Tác giả                               |
| publisher       | VARCHAR   | Nhà xuất bản                          |
| isbn            | VARCHAR   | nullable — Mã ISBN                    |
| pages           | INT       | Số trang                              |
| language        | VARCHAR   | Ngôn ngữ (Tiếng Việt, English,...)    |
| price           | BIGINT    | Giá bán                               |
| discount_price  | BIGINT    | nullable — Giá khuyến mãi             |
| stock_quantity  | INT       | Tồn kho                               |
| cover_public_id | VARCHAR   | nullable — Ảnh bìa (Cloudinary)       |
| sold_count      | INT       | Denormalized — cập nhật sau mỗi order |
| is_active       | BOOLEAN   |                                       |
| created_at      | TIMESTAMP |                                       |
| updated_at      | TIMESTAMP |                                       |

> **Lưu ý**: Không cần bảng ProductVariant vì sách không có biến thể (màu, size). `sold_count` được cập nhật bất đồng bộ.

### 6. Cart

| Thuộc tính | Kiểu      | Ghi chú |
| ---------- | --------- | ------- |
| id         | UUID (PK) |         |
| user_id    | UUID (FK) |         |
| created_at | TIMESTAMP |         |
| updated_at | TIMESTAMP |         |

### 7. CartItem

| Thuộc tính | Kiểu      | Ghi chú                |
| ---------- | --------- | ---------------------- |
| id         | UUID (PK) |                        |
| cart_id    | UUID (FK) |                        |
| product_id | UUID (FK) | Sách được thêm vào giỏ |
| quantity   | INT       |                        |
| created_at | TIMESTAMP |                        |
| updated_at | TIMESTAMP |                        |

### 8. Order

| Thuộc tính        | Kiểu      | Ghi chú                                                                   |
| ----------------- | --------- | ------------------------------------------------------------------------- |
| id                | UUID (PK) |                                                                           |
| user_id           | UUID (FK) |                                                                           |
| receiver_name     | VARCHAR   | Snapshot địa chỉ lúc đặt                                                  |
| receiver_phone    | VARCHAR   |                                                                           |
| shipping_province | VARCHAR   |                                                                           |
| shipping_ward     | VARCHAR   |                                                                           |
| shipping_detail   | VARCHAR   |                                                                           |
| total_amount      | BIGINT    | Tổng tiền hàng                                                            |
| shipping_fee      | BIGINT    | Phí ship                                                                  |
| final_amount      | BIGINT    | Thành tiền cuối (total_amount + shipping_fee)                             |
| status            | ENUM      | `PENDING`, `CONFIRMED`, `SHIPPING`, `DELIVERED`, `COMPLETED`, `CANCELLED` |
| note              | TEXT      | nullable                                                                  |
| created_at        | TIMESTAMP |                                                                           |
| updated_at        | TIMESTAMP |                                                                           |

> **Lưu ý**: Địa chỉ giao hàng lưu trực tiếp trong Order (snapshot), KHÔNG reference tới bảng Address — vì user có thể sửa/xóa địa chỉ sau khi đặt hàng.

### 9. OrderItem

| Thuộc tính   | Kiểu      | Ghi chú                   |
| ------------ | --------- | ------------------------- |
| id           | UUID (PK) |                           |
| order_id     | UUID (FK) |                           |
| product_id   | UUID (FK) |                           |
| product_name | VARCHAR   | Snapshot tên sách lúc đặt |
| unit_price   | BIGINT    | Giá đơn vị lúc đặt        |
| quantity     | INT       |                           |
| subtotal     | BIGINT    | unit_price × quantity     |
| created_at   | TIMESTAMP |                           |

### 10. Payment

| Thuộc tính     | Kiểu      | Ghi chú                        |
| -------------- | --------- | ------------------------------ |
| id             | UUID (PK) |                                |
| order_id       | UUID (FK) |                                |
| method         | ENUM      | `COD`, `VNPAY`                 |
| status         | ENUM      | `PENDING`, `SUCCESS`, `FAILED` |
| transaction_id | VARCHAR   | nullable — ID từ VNPay         |
| amount         | BIGINT    |                                |
| paid_at        | TIMESTAMP | nullable                       |
| created_at     | TIMESTAMP |                                |

---

## Quan hệ (Relationships)

| Quan hệ                  | Kiểu           | Ghi chú                    |
| ------------------------ | -------------- | -------------------------- |
| User → Address           | **1-N**        | Tối đa 3 địa chỉ           |
| User → Cart              | **1-1**        | 1 user có 1 giỏ hàng       |
| User → Order             | **1-N**        | 1 user có nhiều đơn hàng   |
| User → VerificationToken | **1-N**        | Email verification tokens  |
| Category → Category      | **1-N** (self) | Danh mục cha-con           |
| Category → Product       | **1-N**        | 1 danh mục có nhiều sách   |
| Cart → CartItem          | **1-N**        | 1 giỏ có nhiều item        |
| Product → CartItem       | **1-N**        | 1 sách nằm trong nhiều giỏ |
| Product → OrderItem      | **1-N**        | 1 sách có trong nhiều đơn  |
| Order → OrderItem        | **1-N**        | 1 đơn có nhiều sách        |
| Order → Payment          | **1-N**        | 1 đơn có N giao dịch       |

---

## Trạng thái đơn hàng (Order Status)

```
PENDING → CONFIRMED → SHIPPING → DELIVERED → COMPLETED
                          ↘ CANCELLED
```

> **Lưu ý chuyển trạng thái**:
>
> - `CANCELLED`: Chỉ cho phép ở `PENDING` hoặc `CONFIRMED`. Sau khi `SHIPPING` thì không huỷ được.
> - `COMPLETED`: Tự động chuyển sau N ngày kể từ `DELIVERED` nếu user không có khiếu nại.
