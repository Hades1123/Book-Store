# Online Shopping Web

## TechStack:

- FE: React, Vite, Typescript, Tailwindcss, Antd design
- BE: NestJS, prisma
- Database: Postgress

Chuyên bán các mặt hàng điện tử như: máy tính, điện thoại, laptop và các phụ kiện đi kèm.

## Actor

- **Guest**: Người chưa đăng nhập, chỉ có thể xem sản phẩm, có thể thêm sản phẩm vào giỏ hàng nhưng khi muốn thanh toán phải bắt buộc đăng kí tài khoản
- **Customer**: Người đã có tài khoản
- **Admin**: Người điều hành toàn bộ hệ thống
- **External systems**: bao gồm cổng thanh toán, đơn vị vận chuyển (Grab...)

## [Use Case](https://drive.google.com/file/d/1N728IVqy2h1ozOryh7xruja4ZXg3hf14/view?usp=sharing)

### Guest

- **Xem danh sách sản phẩm**: Xem sản phẩm theo danh mục
- **Tìm kiếm và lọc sản phẩm**: Tìm kiếm theo tên, theo giá, lọc sản phẩm đang khuyến mãi,...
- **Xem chi tiết sản phẩm**: Vào trang mới để xem chi tiết về thống số kỹ thuật, video/ảnh, xem review về sản phẩm,...
- **Thêm sản phẩm vào giỏ hàng**: thêm sản phẩm vào giỏ, xóa sản phẩm khỏi giỏ, tăng / giảm số lượng sản phẩm,...
- **Đăng nhập/ Đăng kí/ Đăng xuất**: đăng nhập bằng JWT, OAuth
- **Quên mật khẩu**

### Customer

- **Kế thừa mọi tính năng của Guest**
- **Quản lí tài khoản**: Cập nhật thông tin tài khoản như thay đổi avatar, sửa số điện thoại, thêm địa chỉ, chọn địa chỉ mặc định (fast checkout),...
- **Thêm sản phẩm vào Wishlist**: thêm sản phẩm để mua sau hoặc để theo dõi coi có giảm giá hay không
- **Thanh toán**: Nhập địa chỉ giao hàng, điều chỉnh lại sản phẩm muốn mua, lựa chọn cách trả tiền, lựa chọn đơn vị vận chuyển
- **Theo dõi đơn hàng**: Theo dõi trạng thái đơn hàng: (đang vận chuyển, đã xác nhận, đã hủy)
- **Xem lịch sử mua hàng**
- **Đánh giá và nhận xét sản phẩm**: rating với bình luận vô sản phẩm đã mua
- **Đổi mật khẩu**
- **Áp dụng Voucher khi thanh toán**
- **Hủy đơn hàng**
- **Xem và quản lí thông báo**
- **Tạo yêu cầu đổi trả hàng**

### Admin

- **Quản lí danh mục sản phẩm (categories)**: máy tính, điện thoại, ipad (CRUD)
- **Quản lí sản phẩm**: CRUD
- **Xử lí đơn hàng**: Duyệt đơn
- **Mở / khóa tài khoản người dùng**
- **Phân quyền**: Có thể sẽ có 1 super Admin và nhiều admin nhỏ hơn :D
- **Quản lí Voucher**
- **Báo cáo và thống kê**: Thống kê doanh thu, số lượng người dùng mới, số hàng còn lại, sản phẩm bán chạy,...
- **Quản lí review**: Duyệt, ẩn review...
- **Quản lí thông báo**: gửi notification/ email cho người dùng
- **Xử lí yêu cầu đổi/ trả hàng**

### External Systems

- Lưu trữ hình ảnh và video sản phẩm -> Cloudinary
- Dịch vụ email và sms
- Cổng thanh toán -> vnpay
- Dịch vụ vận chuyển -> cái này để sau

## Về trạng thái đơn hàng

- Chờ xác nhận → Đã xác nhận → Đang chuẩn bị hàng → Đang vận chuyển → Đã giao → Hoàn thành (nhánh phụ: Đã hủy, Yêu cầu trả hàng, Đã hoàn tiền)
