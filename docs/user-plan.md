Viewed auth.controller.ts:1-50
Listed directory src
Listed directory modules
Listed directory common
Viewed user.prisma:1-31
Listed directory user
Listed directory auth
Viewed user.controller.ts:1-23
Viewed user.service.ts:1-9
Viewed auth.service.ts:1-266
Listed directory guards
Listed directory decorators
Listed directory dto
Viewed jwt-auth.guard.ts:1-45
Listed directory enums

Mình đã đọc xong code Auth module của bạn. Code khá sạch và chuẩn pattern NestJS! Auth đã có đầy đủ: **Register → Verify Email (OTP) → Login → Refresh Token → Logout**, kèm `@Public()` decorator và [JwtGuard](cci:2://file:///home/hades/Code/Project/Shoppe-Fake/backend/src/common/guards/jwt-auth.guard.ts:7:0-43:1) JWT.

Bây giờ nói về **User Module** — hiện tại [user.service.ts](cci:7://file:///home/hades/Code/Project/Shoppe-Fake/backend/src/modules/user/user.service.ts:0:0-0:0) và [user.controller.ts](cci:7://file:///home/hades/Code/Project/Shoppe-Fake/backend/src/modules/user/user.controller.ts:0:0-0:0) gần như trống. Dựa vào README và DB của bạn, mình gợi ý các nhóm API nên làm theo thứ tự ưu tiên:

---

### 👤 User Module — Recommended APIs

#### **Cho Customer (profile cá nhân)**

| Method  | Endpoint                   | Mô tả                                     |
| ------- | -------------------------- | ----------------------------------------- |
| `GET`   | `/user/me`                 | Lấy thông tin profile của mình            |
| `PATCH` | `/user/me`                 | Cập nhật `fullName`, `phone`, `avatarUrl` |
| `PATCH` | `/user/me/change-password` | Đổi mật khẩu (cần xác nhận mật khẩu cũ)   |

#### **Address**

| Method   | Endpoint                      | Mô tả                   |
| -------- | ----------------------------- | ----------------------- |
| `GET`    | `/user/addresses`             | Lấy danh sách địa chỉ   |
| `POST`   | `/user/addresses`             | Thêm địa chỉ mới        |
| `PATCH`  | `/user/addresses/:id`         | Sửa địa chỉ             |
| `DELETE` | `/user/addresses/:id`         | Xóa địa chỉ             |
| `PATCH`  | `/user/addresses/:id/default` | Đặt là địa chỉ mặc định |

#### **Cho Admin (quản lý User)**

| Method  | Endpoint                         | Mô tả                                  |
| ------- | -------------------------------- | -------------------------------------- |
| `GET`   | `/admin/users`                   | Danh sách user (có pagination, filter) |
| `GET`   | `/admin/users/:id`               | Xem chi tiết user                      |
| `PATCH` | `/admin/users/:id/toggle-active` | Mở/khóa tài khoản                      |
| `PATCH` | `/admin/users/:id/role`          | Phân quyền (Super Admin only)          |

---

### 💡 Gợi ý cấu trúc thư mục

Bạn có thể tách rõ ràng theo route:

```
modules/user/
├── dto/
│   ├── update-profile.dto.ts
│   ├── change-password.dto.ts
│   └── address/
│       ├── create-address.dto.ts
│       └── update-address.dto.ts
├── user.controller.ts      ← /user/* (Customer)
├── admin.controller.ts     ← /admin/users/* (Admin)
├── user.service.ts
└── user.module.ts
```

Hoặc nếu bạn muốn gọn hơn, để chung 1 controller và dùng Roles Guard để phân quyền.

---

**Bạn muốn bắt đầu từ phần nào?** Mình suggest làm theo thứ tự:

1. **`GET /user/me` + `PATCH /user/me`** → Đơn giản, dễ kiểm tra
2. **Address CRUD** → Dùng ngay trong checkout sau này
3. **Change password** → Logic OTP verify đã có sẵn rồi
4. **Admin user management** → Cần Roles Guard mới trước
