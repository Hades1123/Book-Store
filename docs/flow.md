Auth + Users trước.
Lý do: gần như mọi bảng và use case đều phụ thuộc user. Giai đoạn này nên có đăng ký, đăng nhập JWT, Google OAuth, Facebook OAuth, lấy thông tin tôi, cập nhật profile cơ bản, role và isActive.

Category + Product + Variant sau đó.
Lý do: chưa có catalog thì cart/order không có gì để chạy. Ở phase này nên làm category cây cha-con, product, media, variant, attribute, public list/detail/search/filter và admin CRUD cơ bản.

Cart + Order cơ bản tiếp theo.
Lý do: đây là luồng tạo giá trị chính của shop. Nên làm add/remove/update cart, checkout từ cart, snapshot địa chỉ giao hàng vào order, snapshot item vào order item, status history, COD trước.

Voucher chỉ thêm sau khi order flow đã ổn.
Lý do: voucher làm sớm rất dễ kéo theo logic phức tạp. MVP chỉ cần validate lúc checkout: còn hạn, đủ số tiền tối thiểu, số lượt dùng, per-user limit, max discount.

Address + Wishlist + Order history.
Lý do: ít rủi ro, nâng trải nghiệm user, có thể làm khá độc lập sau auth và catalog.

Admin operations.
Lý do: khi customer flow chạy được rồi mới thêm CRUD vận hành: category, product, voucher, lock user, đổi trạng thái đơn.

Để sau cùng:
Return/refund, review moderation, VNPay hoàn chỉnh, notification delivery, shipping provider, reporting. Đặc biệt return/refund trong DB.md có logic voucher penalty khá nhạy cảm, không nên lôi vào MVP sớm.
