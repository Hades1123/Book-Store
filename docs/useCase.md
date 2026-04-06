# Online Bookstore

## TechStack:

- FE: React, Vite, Typescript, Sass/Scss, Material UI
- BE: NestJS, Prisma
- Database: PostgreSQL

Chuyên bán các loại sách: Văn học, Khoa học, Thiếu nhi, Kinh tế, Kỹ năng sống, Ngoại ngữ,...

## Actor

- **Guest**: Người chưa đăng nhập, có thể xem sách, thêm vào giỏ hàng nhưng phải đăng ký tài khoản để thanh toán
- **Customer**: Người đã có tài khoản
- **Admin**: Người quản lý toàn bộ hệ thống
- **External systems**: Cloudinary, Email service, VNPay

## Use Case

### Guest

- **Xem danh sách sách**: Xem sách theo danh mục (Văn học, Khoa học,...)
- **Tìm kiếm và lọc sách**: Tìm theo tên sách, tác giả, lọc theo giá
- **Xem chi tiết sách**: Xem ảnh bìa, mô tả, tác giả, NXB, số trang, ISBN
- **Thêm sách vào giỏ hàng**: Thêm, xóa, tăng/giảm số lượng
- **Đăng nhập / Đăng ký / Đăng xuất**: JWT (HttpOnly Cookie) + OAuth

### Customer

- **Kế thừa mọi tính năng của Guest**
- **Quản lý tài khoản**: Cập nhật avatar, SĐT, quản lý địa chỉ giao hàng (tối đa 3, chọn mặc định)
- **Thanh toán**: Chọn địa chỉ giao hàng, chọn phương thức thanh toán (COD / VNPay)
- **Theo dõi đơn hàng**: Xem trạng thái đơn hàng
- **Hủy đơn hàng**: Chỉ khi đơn chưa được giao cho vận chuyển
- **Xem lịch sử mua hàng**
- **Đổi mật khẩu**

### Admin

- **Quản lý danh mục sách (Categories)**: CRUD
- **Quản lý sách (Products)**: CRUD
- **Xử lý đơn hàng**: Duyệt đơn, cập nhật trạng thái
- **Mở / Khóa tài khoản người dùng**
- **Xem danh sách đơn hàng**

### External Systems

- Lưu trữ ảnh bìa sách → Cloudinary
- Dịch vụ email (OTP xác thực) → Gmail SMTP
- Cổng thanh toán → VNPay

## Trạng thái đơn hàng

```
PENDING → CONFIRMED → SHIPPING → DELIVERED → COMPLETED
                                      ↘ CANCELLED
```

> **Lưu ý**: `CANCELLED` chỉ cho phép ở `PENDING` hoặc `CONFIRMED`. Sau khi `SHIPPING` thì không huỷ được.
