# Database Design

## Entities & Attributes

### 1. User

| Thuộc tính         | Kiểu             | Ghi chú                            |
| ------------------ | ---------------- | ---------------------------------- |
| id                 | UUID (PK)        |                                    |
| email              | VARCHAR (unique) |                                    |
| password           | VARCHAR          | nullable (OAuth user)              |
| full_name          | VARCHAR          |                                    |
| phone              | VARCHAR          | nullable (OAuth user)              |
| avatar_public_id   | VARCHAR          | nullable (set khi upload ảnh)      |
| role               | ENUM             | `CUSTOMER`, `ADMIN`, `SUPER_ADMIN` |
| is_active          | BOOLEAN          | Mở/khóa tài khoản (ban)            |
| email_verified     | BOOLEAN          | Trạng thái xác thực email          |
| provider           | ENUM             | `LOCAL`, `GOOGLE`, `FACEBOOK`      |
| provider_id        | VARCHAR          | ID từ OAuth provider               |
| hash_refresh_token | VARCHAR          | Token để refresh session           |
| last_login_at      | TIMESTAMP        | Lần đăng nhập cuối                 |
| created_at         | TIMESTAMP        |                                    |
| updated_at         | TIMESTAMP        |                                    |

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

| Thuộc tính     | Kiểu             | Ghi chú                          |
| -------------- | ---------------- | -------------------------------- |
| id             | UUID (PK)        |                                  |
| user_id        | UUID (FK → User) |                                  |
| receiver_name  | VARCHAR          | Tên người nhận                   |
| phone          | VARCHAR          |                                  |
| province       | VARCHAR          |                                  |
| ward           | VARCHAR          | Phường                           |
| detail_address | VARCHAR          | Số nhà, đường...                 |
| is_default     | BOOLEAN          | Địa chỉ mặc định (fast checkout) |
| created_at     | TIMESTAMP        |                                  |
| updated_at     | TIMESTAMP        |                                  |

> **Note**: Sở dĩ không có district vì Việt Nam đã bỏ đơn vị hành chính này rồi nhá

### 4. Category

| Thuộc tính      | Kiểu                 | Ghi chú                    |
| --------------- | -------------------- | -------------------------- |
| id              | UUID (PK)            |                            |
| name            | VARCHAR              | Máy tính, Điện thoại...    |
| description     | TEXT                 |                            |
| image_public_id | VARCHAR              |                            |
| parent_id       | UUID (FK → Category) | nullable, danh mục cha-con |
| is_active       | BOOLEAN              | soft delete                |
| created_at      | TIMESTAMP            |                            |
| updated_at      | TIMESTAMP            |                            |

### 5. Product

| Thuộc tính     | Kiểu                 | Ghi chú                         |
| -------------- | -------------------- | ------------------------------- |
| id             | UUID (PK)            |                                 |
| name           | VARCHAR              |                                 |
| description    | TEXT                 |                                 |
| category_id    | UUID (FK → Category) |                                 |
| sold_count     | INT                  |                                 |
| review_count   | INT                  |                                 |
| average_rating | DECIMAL              |                                 |
| brand          | VARCHAR              |                                 |
| specifications | JSONB                | Thông số kỹ thuật (RAM, CPU...) |
| is_active      | BOOLEAN              |                                 |
| created_at     | TIMESTAMP            |                                 |
| updated_at     | TIMESTAMP            |                                 |

> **Lưu ý**: `sold_count`, `review_count`, `average_rating` là các trường **denormalized** — được cập nhật bất đồng bộ (sau mỗi order/review), không tính real-time. Ưu tiên read performance.

### 6. ProductMedia

| Thuộc tính   | Kiểu                | Ghi chú               |
| ------------ | ------------------- | --------------------- |
| id           | UUID (PK)           |                       |
| product_id   | UUID (FK → Product) |                       |
| public_id    | VARCHAR             | Cloudinary URL        |
| type         | ENUM                | `IMAGE`, `VIDEO`      |
| is_thumbnail | BOOLEAN             | Ảnh đại diện sản phẩm |
| sort_order   | INT                 | Thứ tự hiển thị       |
| created_at   | TIMESTAMP           |                       |

### 7. Cart

| Thuộc tính | Kiểu             | Ghi chú |
| ---------- | ---------------- | ------- |
| id         | UUID (PK)        |         |
| user_id    | UUID (FK → User) |         |
| created_at | TIMESTAMP        |         |
| updated_at | TIMESTAMP        |         |

### 8. CartItem

| Thuộc tính | Kiểu                       | Ghi chú                        |
| ---------- | -------------------------- | ------------------------------ |
| id         | UUID (PK)                  |                                |
| cart_id    | UUID (FK → Cart)           |                                |
| variant_id | UUID (FK → ProductVariant) | Variant cụ thể người dùng chọn |
| quantity   | INT                        |                                |
| created_at | TIMESTAMP                  |                                |
| updated_at | TIMESTAMP                  |                                |

### 9. Wishlist

| Thuộc tính | Kiểu                | Ghi chú |
| ---------- | ------------------- | ------- |
| id         | UUID (PK)           |         |
| user_id    | UUID (FK → User)    |         |
| product_id | UUID (FK → Product) |         |
| created_at | TIMESTAMP           |         |

> Bảng trung gian thể hiện quan hệ **N-N** giữa User và Product

### 10. Voucher

| Thuộc tính           | Kiểu             | Ghi chú                        |
| -------------------- | ---------------- | ------------------------------ |
| id                   | UUID (PK)        |                                |
| code                 | VARCHAR (unique) | Mã voucher                     |
| description          | TEXT             |                                |
| discount_type        | ENUM             | `PERCENTAGE`, `FIXED_AMOUNT`   |
| discount_value       | BIGINT           | Giá trị giảm                   |
| min_order_amount     | BIGINT           | Đơn tối thiểu để áp dụng       |
| max_discount_amount  | BIGINT           | Giảm tối đa (cho %)            |
| usage_limit          | INT              | Tổng số lần dùng toàn hệ thống |
| usage_limit_per_user | INT              | Số lần 1 user được dùng        |
| used_count           | INT              | Đã dùng bao nhiêu lần          |
| start_date           | TIMESTAMP        |                                |
| end_date             | TIMESTAMP        |                                |
| is_active            | BOOLEAN          |                                |
| created_at           | TIMESTAMP        |                                |
| updated_at           | TIMESTAMP        |                                |

### 11. Order

| Thuộc tính        | Kiểu                | Ghi chú                                                                                                                                                      |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                | UUID (PK)           |                                                                                                                                                              |
| user_id           | UUID (FK → User)    |                                                                                                                                                              |
| voucher_id        | UUID (FK → Voucher) | nullable                                                                                                                                                     |
| receiver_name     | VARCHAR             | Snapshot địa chỉ lúc đặt                                                                                                                                     |
| receiver_phone    | VARCHAR             |                                                                                                                                                              |
| shipping_province | VARCHAR             |                                                                                                                                                              |
| shipping_ward     | VARCHAR             |                                                                                                                                                              |
| shipping_detail   | VARCHAR             |                                                                                                                                                              |
| total_amount      | BIGINT              | Tổng tiền hàng                                                                                                                                               |
| discount_amount   | BIGINT              | Tiền giảm (voucher)                                                                                                                                          |
| shipping_provider | VARCHAR             | Đơn vị vận chuyển: Grab,...                                                                                                                                  |
| shipping_fee      | BIGINT              | Phí ship                                                                                                                                                     |
| final_amount      | BIGINT              | Thành tiền cuối                                                                                                                                              |
| status            | ENUM                | `PENDING`, `CONFIRMED`, `PREPARING`, `SHIPPING`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURN_APPROVED`, `RETURN_REJECTED`, `REFUNDED` |
| note              | TEXT                |                                                                                                                                                              |
| created_at        | TIMESTAMP           |                                                                                                                                                              |
| updated_at        | TIMESTAMP           |                                                                                                                                                              |

> **Lưu ý**: Địa chỉ giao hàng lưu trực tiếp trong Order (snapshot), KHÔNG reference tới bảng Address — vì user có thể sửa/xóa địa chỉ sau khi đặt hàng.

### 12. OrderItem

| Thuộc tính      | Kiểu                       | Ghi chú                                  |
| --------------- | -------------------------- | ---------------------------------------- |
| id              | UUID (PK)                  |                                          |
| order_id        | UUID (FK → Order)          |                                          |
| variant_id      | UUID (FK → ProductVariant) | Variant cụ thể lúc đặt hàng              |
| product_name    | VARCHAR                    | Snapshot tên SP lúc đặt                  |
| variant_info    | VARCHAR                    | Snapshot thông tin variant (256GB - Đen) |
| unit_price      | BIGINT                     | Giá đơn vị gốc lúc đặt                   |
| quantity        | INT                        |                                          |
| subtotal        | BIGINT                     | unit_price × quantity                    |
| discount_amount | BIGINT                     | Voucher phân bổ cho item này             |
| total_price     | BIGINT                     | subtotal - discount_amount               |
| created_at      | TIMESTAMP                  |                                          |

> **Lưu ý**:
>
> - `discount_amount` được tính theo tỷ lệ item / tổng đơn × voucher giảm
> - `total_price` là số tiền user thực trả cho item này → dùng để hoàn tiền chính xác
> - Ví dụ: Đơn 500k, voucher 50k, item A 200k → discount = 50k × (200k/500k) = 20k → total_price = 180k

### 13. OrderStatusHistory

| Thuộc tính | Kiểu              | Ghi chú             |
| ---------- | ----------------- | ------------------- |
| id         | UUID (PK)         |                     |
| order_id   | UUID (FK → Order) |                     |
| status     | ENUM              | Trạng thái mới      |
| note       | TEXT              |                     |
| changed_by | UUID (FK → User)  | Admin hoặc hệ thống |
| created_at | TIMESTAMP         |                     |

### 14. Review

| Thuộc tính    | Kiểu                  | Ghi chú                         |
| ------------- | --------------------- | ------------------------------- |
| id            | UUID (PK)             |                                 |
| user_id       | UUID (FK → User)      |                                 |
| order_item_id | UUID (FK → OrderItem) | Review cho sản phẩm cụ thể      |
| rating        | INT                   | 1-5 sao                         |
| comment       | TEXT                  |                                 |
| status        | ENUM                  | `PENDING`, `APPROVED`, `HIDDEN` |
| created_at    | TIMESTAMP             |                                 |
| updated_at    | TIMESTAMP             |                                 |

### 15. Notification

| Thuộc tính | Kiểu             | Ghi chú                               |
| ---------- | ---------------- | ------------------------------------- |
| id         | UUID (PK)        |                                       |
| user_id    | UUID (FK → User) |                                       |
| title      | VARCHAR          |                                       |
| content    | TEXT             |                                       |
| target_url | VARCHAR          | URL dẫn đến trang đích                |
| type       | ENUM             | `ORDER_STATUS`, `PROMOTION`, `SYSTEM` |
| is_read    | BOOLEAN          |                                       |
| created_at | TIMESTAMP        |                                       |

### 16. Payment

| Thuộc tính     | Kiểu              | Ghi chú                        |
| -------------- | ----------------- | ------------------------------ |
| id             | UUID (PK)         |                                |
| order_id       | UUID (FK → Order) |                                |
| method         | ENUM              | `COD`, `VNPAY`                 |
| status         | ENUM              | `PENDING`, `SUCCESS`, `FAILED` |
| transaction_id | VARCHAR           | ID từ VNPay                    |
| amount         | BIGINT            |                                |
| paid_at        | TIMESTAMP         | nullable                       |
| created_at     | TIMESTAMP         |                                |

### 17. ReturnRequest

| Thuộc tính      | Kiểu                  | Ghi chú                                        |
| --------------- | --------------------- | ---------------------------------------------- |
| id              | UUID (PK)             |                                                |
| order_item_id   | UUID (FK → OrderItem) | Trả item cụ thể trong đơn                      |
| user_id         | UUID (FK → User)      |                                                |
| quantity        | INT                   | Số lượng muốn trả (≤ quantity trong OrderItem) |
| reason          | TEXT                  |                                                |
| status          | ENUM                  | `PENDING`, `APPROVED`, `REJECTED`, `REFUNDED`  |
| refund_amount   | BIGINT                | Số tiền hoàn lại (đã tính truy thu voucher)    |
| voucher_penalty | BIGINT                | Số tiền truy thu do không còn đủ ĐK voucher    |
| admin_note      | TEXT                  |                                                |
| created_at      | TIMESTAMP             |                                                |
| updated_at      | TIMESTAMP             |                                                |

> **Logic hoàn tiền nghiêm ngặt**:
>
> 1. `refund_amount` = (order_item.total_price / quantity) × return_quantity
> 2. Nếu voucher có `min_order_amount`:
>    - Tính tổng tiền còn lại sau khi trả = tổng đơn - subtotal của item trả
>    - Nếu còn lại < `min_order_amount` → truy thu phần voucher đã phân bổ cho item còn lại
>    - `voucher_penalty` = tổng discount_amount của các item còn lại
>    - `refund_amount` = refund_amount - voucher_penalty

### 18. ReturnRequestMedia

| Thuộc tính        | Kiểu                      | Ghi chú          |
| ----------------- | ------------------------- | ---------------- |
| id                | UUID (PK)                 |                  |
| return_request_id | UUID (FK → ReturnRequest) |                  |
| public_id         | VARCHAR                   | Cloudinary URL   |
| type              | ENUM                      | `IMAGE`, `VIDEO` |
| created_at        | TIMESTAMP                 |                  |

### 19. VoucherUsage

| Thuộc tính | Kiểu                | Ghi chú |
| ---------- | ------------------- | ------- |
| id         | UUID (PK)           |         |
| voucher_id | UUID (FK → Voucher) |         |
| user_id    | UUID (FK → User)    |         |
| order_id   | UUID (FK → Order)   |         |
| created_at | TIMESTAMP           |         |

---

### 20. ProductVariant

| Thuộc tính     | Kiểu                | Ghi chú                           |
| -------------- | ------------------- | --------------------------------- |
| id             | UUID (PK)           |                                   |
| product_id     | UUID (FK → Product) |                                   |
| sku            | VARCHAR (unique)    | Mã riêng, e.g. `IP15-256GB-BLACK` |
| price          | BIGINT              | Giá riêng cho variant             |
| discount_price | BIGINT              | nullable                          |
| stock_quantity | INT                 | Tồn kho riêng                     |
| is_active      | BOOLEAN             |                                   |
| created_at     | TIMESTAMP           |                                   |
| updated_at     | TIMESTAMP           |                                   |

### 21. VariantAttribute

| Thuộc tính | Kiểu                       | Ghi chú                |
| ---------- | -------------------------- | ---------------------- |
| id         | UUID (PK)                  |                        |
| variant_id | UUID (FK → ProductVariant) |                        |
| name       | VARCHAR                    | `Bộ nhớ`, `Màu`, `RAM` |
| value      | VARCHAR                    | `256GB`, `Đen`, `8GB`  |
| created_at | TIMESTAMP                  |                        |

---

## Quan hệ (Relationships)

| Quan hệ                            | Kiểu           | Ghi chú                                                                                           |
| ---------------------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| User → Address                     | **1-N**        | 1 user có nhiều địa chỉ                                                                           |
| User → Cart                        | **1-1**        | 1 user có 1 giỏ hàng                                                                              |
| User → Order                       | **1-N**        | 1 user có nhiều đơn hàng                                                                          |
| User → Review                      | **1-N**        | 1 user viết nhiều review                                                                          |
| User → Notification                | **1-N**        | 1 user nhận nhiều thông báo                                                                       |
| User → ReturnRequest               | **1-N**        | 1 user tạo nhiều yêu cầu trả                                                                      |
| User ↔ Product (qua Wishlist)      | **N-N**        | Nhiều user thích nhiều SP                                                                         |
| Category → Category                | **1-N** (self) | Danh mục cha-con                                                                                  |
| Category → Product                 | **1-N**        | 1 danh mục có nhiều SP                                                                            |
| Product → ProductMedia             | **1-N**        | 1 SP có nhiều ảnh/video                                                                           |
| Product → ProductVariant           | **1-N**        | 1 SP có nhiều variant                                                                             |
| ProductVariant → VariantAttribute  | **1-N**        | 1 variant có nhiều thuộc tính                                                                     |
| ProductVariant → CartItem          | **1-N**        | 1 variant nằm trong nhiều giỏ                                                                     |
| ProductVariant → OrderItem         | **1-N**        | 1 variant có trong nhiều đơn                                                                      |
| OrderItem → Review                 | **1-1**        | 1 item có tối đa 1 review                                                                         |
| Cart → CartItem                    | **1-N**        | 1 giỏ có nhiều item                                                                               |
| Order → OrderItem                  | **1-N**        | 1 đơn có nhiều SP                                                                                 |
| Order → OrderStatusHistory         | **1-N**        | 1 đơn có nhiều lần đổi trạng thái                                                                 |
| Order → Payment                    | **1-N**        | 1 đơn có N giao dịch thanh toán                                                                   |
| OrderItem → ReturnRequest          | **1-N**        | 1 item có thể có nhiều yêu cầu trả (partial return nhiều lần, tổng quantity ≤ OrderItem.quantity) |
| ReturnRequest → ReturnRequestMedia | **1-N**        | 1 yêu cầu có nhiều ảnh/video                                                                      |
| Voucher → Order                    | **1-N**        | 1 voucher dùng cho nhiều đơn                                                                      |
| Voucher → VoucherUsage             | **1-N**        | Tracking lịch sử dùng voucher                                                                     |
| User → VoucherUsage                | **1-N**        | Tracking user dùng voucher                                                                        |
| User → VerificationToken           | **1-N**        | Email verification tokens                                                                         |

---

## Trạng thái đơn hàng (Order Status)

```
                    ┌─────────────┐
                    │   PENDING   │ ← Vừa đặt hàng
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
         ┌────┤        CONFIRMED        │ ← Admin xác nhận
         │    └────────────┬────────────┘
         │                 │
         │    ┌────────────▼────────────┐
         ├────┤        PREPARING        │ ← Đang chuẩn bị hàng
         │    └────────────┬────────────┘
         │                 │
         │    ┌────────────▼────────────┐
         │    │         SHIPPING        │ ← Đang giao
         │    └────────────┬────────────┘
         │                 │
         │    ┌────────────▼────────────┐
         │    │         DELIVERED       │ ← Đã giao thành công
         │    └────────────┬────────────┘
         │                 │
         │    ┌────────────▼────────────┐
         │    │         COMPLETED       │ ← User xác nhận / tự động sau N ngày
         │    └─────────────────────────┘
         │
         └──────────► CANCELLED ← Có thể huỷ ở PENDING / CONFIRMED / PREPARING

Sau DELIVERED, user có thể mở yêu cầu trả hàng:

DELIVERED → RETURN_REQUESTED → RETURN_APPROVED → REFUNDED
                             ↘ RETURN_REJECTED
```

> **Lưu ý chuyển trạng thái**:
>
> - `CANCELLED`: Chỉ cho phép ở 3 trạng thái đầu (`PENDING`, `CONFIRMED`, `PREPARING`). Sau khi `SHIPPING` thì không huỷ được.
> - `COMPLETED`: Tự động chuyển sau N ngày kể từ `DELIVERED` nếu user không có khiếu nại.
> - `RETURN_REQUESTED`: Chỉ mở được khi đơn đang ở `DELIVERED` (chưa `COMPLETED`).

---

## Ví dụ hoàn tiền (Refund Example)

### Dữ liệu đơn hàng

```
Voucher: Giảm 50k, điều kiện đơn tối thiểu 400k

Order:
| total_amount    | 500k |
| discount_amount | 50k  |
| final_amount    | 450k |

OrderItem A:
| unit_price      | 200k |
| quantity        | 1    |
| subtotal        | 200k |
| discount_amount | 20k  | ← 50k × (200k/500k)
| total_price     | 180k |

OrderItem B:
| unit_price      | 300k |
| quantity        | 1    |
| subtotal        | 300k |
| discount_amount | 30k  | ← 50k × (300k/500k)
| total_price     | 270k |
```

### User yêu cầu trả OrderItem A

**Bước 1: Tính refund_amount ban đầu**

```
refund_amount = total_price / quantity × return_quantity
              = 180k / 1 × 1 = 180k
```

**Bước 2: Kiểm tra điều kiện voucher**

```
Tổng còn lại = 500k - 200k = 300k
Voucher min_order_amount = 400k
300k < 400k → KHÔNG CÒN ĐỦ ĐIỀU KIỆN!
```

**Bước 3: Truy thu voucher**

```
voucher_penalty = discount_amount của item còn lại = 30k
refund_amount = 180k - 30k = 150k
```

**Kết quả:**

```
ReturnRequest:
| quantity        | 1    |
| refund_amount   | 150k |
| voucher_penalty | 30k  |
```

### Giải thích

- User đã trả 450k cho đơn
- Trả item A → được hoàn 150k (thay vì 180k)
- Phần 30k bị truy thu vì item B không còn đủ điều kiện hưởng voucher
- Tổng user nhận về: 150k + item B (giá trị 270k) = 420k
- Hệ thống không lỗ: user không được hưởng voucher "sái"
