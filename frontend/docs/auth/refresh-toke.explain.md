# Planning

- Tiếng Anh khá kém nên tạm viết bằng tiếng Việt vậy.
- Trong project này tôi sử dụng chiến lực queue + flag để mà xử lí failed request khi mà accessToken bị hết hạn.
- Khi mà hết hạn accessToken ấy, có thể có nhiều hơn 1 req bị failed.
- Chiến lược là chỉ gọi api refresh-token cho req bị failed đầu tiên, nếu thành công thì sẽ retry toàn bộ req , nếu thất bại thì reject hết luôn (redirect về trang login).
- Cái queue thì lưu lại các promise (reject, resolve) để có thể kích hoạt tùy vào việc gọi api refresh-token có thành công hay là ko.
