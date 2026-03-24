select * from products p ;

select * from categories;

insert into categories (id, name, description , "imagePublicId" , "isActive" , "parentId", "createdAt", "updatedAt")
values
(gen_random_uuid(),'Văn học Việt Nam','Sách văn học', null, true, 'e5c012cf-b7fe-4a90-8b5f-cc17fce82397', now(),now() ),
(gen_random_uuid(),'Văn học nước ngoài', 'Sách văn học', null, true, 'e5c012cf-b7fe-4a90-8b5f-cc17fce82397',now(), now());

insert into products(id, name, description, 
author , publisher, isbn, pages, language, price, "discountPrice", 
"stockQuantity" , "coverPublicId" , "soldCount", "isActive", "createdAt" , "updatedAt", "categoryId" ) 
values 
(gen_random_uuid(), 'book1', 'this is a description', 'Hades', 'nxb', 'isbn', 1000, 'english', 200000, null, 10, null, 0, true, now(), now(), 'e5c012cf-b7fe-4a90-8b5f-cc17fce82397'),
(gen_random_uuid(), 'Số Đỏ', 'Tác phẩm văn học nổi tiếng của Vũ Trọng Phụng', 'Vũ Trọng Phụng', 'NXB Văn Học', '9786049764515', 256, 'Tiếng Việt', 85000, 75000, 100, null, 0, true, now(), now(), 'e5c012cf-b7fe-4a90-8b5f-cc17fce82397'),
(gen_random_uuid(), 'Cha Giàu Cha Nghèo', 'Bài học về tài chính', 'Robert Kiyosaki', 'NXB Trẻ', '9786041065415', 336, 'Tiếng Việt', 120000, 100000, 50, null, 0, true, now(), now(), 'ed509362-fd27-4c04-81bf-dc75857f1b87'),
(gen_random_uuid(), 'Lược Sử Thời Gian', 'Khám phá vũ trụ', 'Stephen Hawking', 'NXB Trẻ', '9786041123456', 220, 'Tiếng Việt', 150000, null, 30, null, 0, true, now(), now(), 'd8c6b887-4a9d-44ba-a8a0-7986321772da'),
(gen_random_uuid(), 'Dế Mèn Phiêu Lưu Ký', 'Truyện thiếu nhi kinh điển', 'Tô Hoài', 'NXB Kim Đồng', '9786042123456', 180, 'Tiếng Việt', 45000, 40000, 200, null, 0, true, now(), now(), '7fad5959-fd98-4e29-8696-bafbadbcd50c'),
(gen_random_uuid(), 'Đắc Nhân Tâm', 'Kỹ năng giao tiếp', 'Dale Carnegie', 'NXB Tổng hợp', '9786045888888', 320, 'Tiếng Việt', 95000, 80000, 150, null, 0, true, now(), now(), 'bf2cde48-1a67-4716-b432-728bfc42cc04'),
(gen_random_uuid(), 'Việt Nam Sử Lược', 'Lịch sử Việt Nam', 'Trần Trọng Kim', 'NXB Văn Học', '9786049760001', 600, 'Tiếng Việt', 250000, 220000, 40, null, 0, true, now(), now(), '47807b6d-0bd9-43f7-ade4-ac090cc83cc3'),
(gen_random_uuid(), 'Tư Duy Nhanh Và Chậm', 'Tâm lý học hành vi', 'Daniel Kahneman', 'NXB Thế Giới', '9786047746156', 600, 'Tiếng Việt', 190000, 170000, 60, null, 0, true, now(), now(), '20a264d8-1905-46a6-991b-3e73a023c62f'),
(gen_random_uuid(), 'Câu Chuyện Nghệ Thuật', 'Lịch sử nghệ thuật', 'E.H. Gombrich', 'NXB Dân Trí', '9786048881234', 688, 'Tiếng Việt', 500000, 450000, 20, null, 0, true, now(), now(), '258bb6a5-4fc8-45ef-9100-12534bfa6be0'),
(gen_random_uuid(), 'Xách Ba Lô Lên Và Đi', 'Ký sự du lịch', 'Huyền Chip', 'NXB Quảng Văn', '9786049001234', 300, 'Tiếng Việt', 80000, null, 80, null, 0, true, now(), now(), 'ebed3976-e802-4262-b567-4e03cc34d489'),
(gen_random_uuid(), 'Kỹ Thuật Chế Biến Món Ăn', 'Hướng dẫn nấu ăn', 'Nhiều tác giả', 'Nieu XB Phụ Nữ', '9786045612345', 400, 'Tiếng Việt', 110000, 90000, 100, null, 0, true, now(), now(), '20b8bf7e-5a3a-4c52-8d44-90aa8aee8a7e');