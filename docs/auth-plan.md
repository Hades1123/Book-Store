Plan: Auth Module MVP
Mình chốt auth phase đầu theo hướng đủ dùng để mở đường cho toàn bộ backend sau này: local auth, access + refresh token, Google OAuth, Facebook OAuth, endpoint me/profile cơ bản, và RBAC nền. Điểm quan trọng là giữ auth gọn trong NestJS feature modules, không làm clean architecture nặng tay lúc này.

Steps

Phase 1: chuẩn bị auth infrastructure.
Thêm các package còn thiếu trong package.json: @nestjs/jwt, @nestjs/passport, passport, passport-jwt, passport-google-oauth20, passport-facebook, bcryptjs, cùng type packages tương ứng. Mở rộng config trong src/config/index.ts và src/config/env.validation.ts cho JWT, refresh token, Google, Facebook, frontend redirect URL. Step này chặn mọi step còn lại.

Phase 1: chỉnh schema cho auth.
Hiện prisma/schema.prisma mới có User cơ bản, nhưng chưa đủ cho refresh token và social login. Cần:
thêm chỗ lưu refresh token đã hash hoặc token version,
cân nhắc emailVerified, lastLoginAt,
sửa naming create_at, update_at,
giữ rule link account rõ ràng: nếu Google/Facebook trả về email trùng user local thì link vào user cũ, không tạo user mới.

Phase 1: chia module hợp lý.
Tách auth và users thành 2 feature modules:

auth: login, register, refresh, logout, social login
users: me, update profile
Phần guard/decorator dùng chung thì đưa về common.
Phase 2: làm local auth trước.
Implement theo thứ tự:
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
Ở đây xử lý hash password, check duplicate email, reject account bị khóa, sinh access/refresh token, lưu refresh token an toàn.
Phase 2: dựng guard và decorator dùng lại toàn project.
Tạo:
JwtAuthGuard
RefreshAuthGuard
RolesGuard
@CurrentUser()
@Roles()
Sau đó mở endpoint GET /auth/me hoặc GET /users/me để test toàn bộ auth pipeline.
Phase 3: làm Google OAuth.
Tạo Google strategy, endpoint redirect và callback. Callback không nên tự xử lý business logic sâu trong strategy; nó chỉ lấy profile rồi đẩy về auth service để:
tìm user theo providerId hoặc email
link tài khoản nếu cần
tạo token
redirect về frontend kèm token
Phase 3: làm Facebook OAuth theo cùng pattern.
Giữ lifecycle giống Google để code đỡ lệch: mapping profile riêng, nhưng logic create/link user vẫn nằm ở auth service.

Phase 4: làm profile tối thiểu.
Thêm:

GET /users/me
PATCH /users/me
Chỉ cho sửa fullName, phone, avatarUrl. Chưa đụng password reset, address hay verify email trong phase này.
Phase 4: chốt RBAC nền.
Role mặc định khi signup là CUSTOMER. Các route admin sau này sẽ dùng ADMIN và SUPER_ADMIN qua RolesGuard. Check isActive nên đặt ở tầng auth/service hoặc guard, không lặp ở từng controller.

Phase 5: test xong rồi mới sang catalog.
Phải có test cho:

register/login
refresh/logout
me endpoint
inactive user
Google/Facebook login
role guard
Auth xong mới nên mở tiếp product/category/cart.
Tổ chức file nên đi theo kiểu này

auth
src/modules/users
common
config
src/database/prisma.service.ts
Trong auth, mình khuyên chia:

auth.module.ts
auth.controller.ts
auth.service.ts
dto/
guards/
strategies/
interfaces/
types/ nếu cần
constants/ nếu cần map provider/callback name
Trong users:

users.module.ts
users.controller.ts
users.service.ts
dto/
Trong common:

decorators/current-user.decorator.ts
decorators/roles.decorator.ts
guards/jwt-auth.guard.ts
guards/refresh-auth.guard.ts
guards/roles.guard.ts
interfaces/jwt-payload.interface.ts
Relevant files

package.json
prisma/schema.prisma
src/app.module.ts
src/config/index.ts
src/config/env.validation.ts
src/database/prisma.service.ts
Verification

Register tạo user CUSTOMER, password được hash, trả access + refresh token.
Login reject đúng các case sai email, sai password, account inactive.
Refresh token hoạt động đúng và bị invalidate khi logout.
me endpoint chỉ chạy khi có access token hợp lệ.
Google/Facebook callback tạo hoặc link user đúng theo email/provider.
Route admin test bị chặn nếu user không có role phù hợp.
Plan này mình đã lưu vào /memories/session/plan.md để dùng cho handoff.

Nếu muốn, bước kế tiếp mình có thể lên luôn:

Cây file auth module chi tiết tới từng file DTO/guard/strategy cần tạo.
API contract auth đầy đủ: request/response cho register, login, refresh, oauth callback, me.
