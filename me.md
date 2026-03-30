Hiện tại chúng ta sẽ nghiên cứu phần cart trước nhé:

- THứ nhất: Chúng ta có 2 đối tượng là guest với customer(đã đăng kí và verified email thành công)
- Thứ 2: cả 2 đều có thể thêm vào cart: Hiện tại guest tui chưa biết FE nên lưu ở đâu cái cart đó vì tui ko mún lưu cart của guest trong database. Tuii mún lưu vào localstorage hoặc lưu ở react context(cái này thì reload sẽ bị mất)
- Thứ 3: Giả sử : sau khi thêm vào cart xong, người dùng muốn thanh toán sẽ có 2 trường hợp:

* Guest: có cần logic merge cart ở đây ko? Tôi nghĩ nếu có thì sẽ lưu vào localstorage rồi merge?
* Còn người đã có tài khoản nhưng chưa đăng nhập ? chắc cx lưu cart vào localstorage nhỉ ?, đăng nhập xong thì merge cart ?
  -> merge cart là vì tui ko mún bất kì ai chưa thanh toán mà chưa đăng kí cả !

- Đây là luồng suy nghĩ của tôi, còn bạn thì sao ?
