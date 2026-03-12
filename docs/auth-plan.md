Mình sẽ bóc riêng auth module từ cấu trúc hiện tại và dependency đang có, rồi chốt một plan đủ chi tiết để có thể handoff sang implementation ngay.

Auth module discovery

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/docs/flow.md)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/app.service.ts)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/docs)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/modules)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/config/app.config.ts)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/package.json)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/prisma/schema.prisma)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/app.module.ts)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/config/env.validation.ts#1-1), lines 1 to 50

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/docs/flow.md)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/modules/auth)

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/docs/DB.md#1-1), lines 1 to 100

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/config/env.validation.ts#40-40), lines 40 to 61

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/docs/README.md#1-1), lines 1 to 50

Read [](file:///home/hades/Code/Project/Shoppe-Fake/backend/src/config/database.config.ts)

Có hai chỗ cần chốt sớm để auth plan không bị mơ hồ lúc implementation: refresh token có làm ngay không, và OAuth callback trả token kiểu nào cho frontend.

Analyzing your answers...

Mình đã chốt được 2 quyết định quan trọng: auth phase đầu sẽ dùng access + refresh token, và OAuth sẽ redirect về frontend kèm token. Giờ mình cập nhật plan theo scope này và trình bày thành các bước implementation rõ dependency.

Read memory [](file:///home/hades/.config/Code/User/workspaceStorage/8d60d7c5b57623f0ca9678a29d7288ca/GitHub.copilot-chat/memory-tool/memories/NGJkY2VjMjUtZjFhMS00MDEyLWI0MjQtODU3ZGIyOWVkNzc0/plan.md)

Deleted memory [](file:///home/hades/.config/Code/User/workspaceStorage/8d60d7c5b57623f0ca9678a29d7288ca/GitHub.copilot-chat/memory-tool/memories/NGJkY2VjMjUtZjFhMS00MDEyLWI0MjQtODU3ZGIyOWVkNzc0/plan.md)

Created memory file [](file:///home/hades/.config/Code/User/workspaceStorage/8d60d7c5b57623f0ca9678a29d7288ca/GitHub.copilot-chat/memory-tool/memories/NGJkY2VjMjUtZjFhMS00MDEyLWI0MjQtODU3ZGIyOWVkNzc0/plan.md)

## Plan: Auth Module MVP

Mình chốt auth phase đầu theo hướng đủ dùng để mở đường cho toàn bộ backend sau này: local auth, access + refresh token, Google OAuth, Facebook OAuth, endpoint me/profile cơ bản, và RBAC nền. Điểm quan trọng là giữ auth gọn trong NestJS feature modules, không làm clean architecture nặng tay lúc này.

**Steps**

1. Phase 1: chuẩn bị auth infrastructure.
   Thêm các package còn thiếu trong package.json: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `passport-google-oauth20`, `passport-facebook`, `bcryptjs`, cùng type packages tương ứng. Mở rộng config trong src/config/index.ts và src/config/env.validation.ts cho JWT, refresh token, Google, Facebook, frontend redirect URL. Step này chặn mọi step còn lại.

2. Phase 1: chỉnh schema cho auth.
   Hiện prisma/schema.prisma mới có `User` cơ bản, nhưng chưa đủ cho refresh token và social login. Cần:
   thêm chỗ lưu refresh token đã hash hoặc token version,
   cân nhắc `emailVerified`, `lastLoginAt`,
   sửa naming `create_at`, `update_at`,
   giữ rule link account rõ ràng: nếu Google/Facebook trả về email trùng user local thì link vào user cũ, không tạo user mới.

3. Phase 1: chia module hợp lý.
   Tách `auth` và `users` thành 2 feature modules:

- `auth`: login, register, refresh, logout, social login
- `users`: `me`, update profile
  Phần guard/decorator dùng chung thì đưa về `common`.

4. Phase 2: làm local auth trước.
   Implement theo thứ tự:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
  Ở đây xử lý hash password, check duplicate email, reject account bị khóa, sinh access/refresh token, lưu refresh token an toàn.

5. Phase 2: dựng guard và decorator dùng lại toàn project.
   Tạo:

- `JwtAuthGuard`
- `RefreshAuthGuard`
- `RolesGuard`
- `@CurrentUser()`
- `@Roles()`
  Sau đó mở endpoint `GET /auth/me` hoặc `GET /users/me` để test toàn bộ auth pipeline.

6. Phase 3: làm Google OAuth.
   Tạo Google strategy, endpoint redirect và callback. Callback không nên tự xử lý business logic sâu trong strategy; nó chỉ lấy profile rồi đẩy về auth service để:

- tìm user theo providerId hoặc email
- link tài khoản nếu cần
- tạo token
- redirect về frontend kèm token

7. Phase 3: làm Facebook OAuth theo cùng pattern.
   Giữ lifecycle giống Google để code đỡ lệch: mapping profile riêng, nhưng logic create/link user vẫn nằm ở auth service.

8. Phase 4: làm profile tối thiểu.
   Thêm:

- `GET /users/me`
- `PATCH /users/me`
  Chỉ cho sửa `fullName`, `phone`, `avatarUrl`. Chưa đụng password reset, address hay verify email trong phase này.

9. Phase 4: chốt RBAC nền.
   Role mặc định khi signup là `CUSTOMER`. Các route admin sau này sẽ dùng `ADMIN` và `SUPER_ADMIN` qua `RolesGuard`. Check `isActive` nên đặt ở tầng auth/service hoặc guard, không lặp ở từng controller.

10. Phase 5: test xong rồi mới sang catalog.
    Phải có test cho:

- register/login
- refresh/logout
- me endpoint
- inactive user
- Google/Facebook login
- role guard
  Auth xong mới nên mở tiếp product/category/cart.

**Tổ chức file nên đi theo kiểu này**

- auth
- src/modules/users
- common
- config
- src/database/prisma.service.ts

Trong `auth`, mình khuyên chia:

- `auth.module.ts`
- `auth.controller.ts`
- `auth.service.ts`
- `dto/`
- `guards/`
- `strategies/`
- `interfaces/`
- `types/` nếu cần
- `constants/` nếu cần map provider/callback name

Trong `users`:

- `users.module.ts`
- `users.controller.ts`
- `users.service.ts`
- `dto/`

Trong `common`:

- `decorators/current-user.decorator.ts`
- `decorators/roles.decorator.ts`
- `guards/jwt-auth.guard.ts`
- `guards/refresh-auth.guard.ts`
- `guards/roles.guard.ts`
- `interfaces/jwt-payload.interface.ts`

**Relevant files**

- package.json
- prisma/schema.prisma
- src/app.module.ts
- src/config/index.ts
- src/config/env.validation.ts
- src/database/prisma.service.ts

**Verification**

1. Register tạo user `CUSTOMER`, password được hash, trả access + refresh token.
2. Login reject đúng các case sai email, sai password, account inactive.
3. Refresh token hoạt động đúng và bị invalidate khi logout.
4. `me` endpoint chỉ chạy khi có access token hợp lệ.
5. Google/Facebook callback tạo hoặc link user đúng theo email/provider.
6. Route admin test bị chặn nếu user không có role phù hợp.

Plan này mình đã lưu vào `/memories/session/plan.md` để dùng cho handoff.

Nếu muốn, bước kế tiếp mình có thể lên luôn:

1. Cây file auth module chi tiết tới từng file DTO/guard/strategy cần tạo.
2. API contract auth đầy đủ: request/response cho register, login, refresh, oauth callback, me.
