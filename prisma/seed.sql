-- prisma/seed.sql
-- Set schema to main
SET search_path TO main;

-- ========== CATEGORIES (10 rows) ==========
INSERT INTO "categories" (id, name, description, "isActive", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Văn học', 'Sách văn học Việt Nam và nước ngoài', true, NOW(), NOW()),
  (gen_random_uuid(), 'Kinh tế', 'Sách kinh tế, quản trị, tài chính', true, NOW(), NOW()),
  (gen_random_uuid(), 'Khoa học', 'Sách khoa học, công nghệ, khám phá', true, NOW(), NOW()),
  (gen_random_uuid(), 'Thiếu nhi', 'Sách cho trẻ em', true, NOW(), NOW()),
  (gen_random_uuid(), 'Kỹ năng sống', 'Phát triển bản thân, kỹ năng mềm', true, NOW(), NOW()),
  (gen_random_uuid(), 'Lịch sử', 'Sách lịch sử Việt Nam và thế giới', true, NOW(), NOW()),
  (gen_random_uuid(), 'Tâm lý', 'Sách tâm lý học, chữa lành', true, NOW(), NOW()),
  (gen_random_uuid(), 'Nghệ thuật', 'Sách nghệ thuật, âm nhạc, điện ảnh', true, NOW(), NOW()),
  (gen_random_uuid(), 'Du lịch', 'Cẩm nang du lịch trong và ngoài nước', true, NOW(), NOW()),
  (gen_random_uuid(), 'Nấu ăn', 'Sách nấu ăn, ẩm thực', true, NOW(), NOW());

-- ========== PRODUCTS (10 rows) ==========
INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Đắc Nhân Tâm',
  'Cuốn sách nổi tiếng về nghệ thuật giao tiếp và ứng xử, giúp bạn thành công trong cuộc sống.',
  'Dale Carnegie',
  'NXB Tổng hợp TP.HCM',
  '978-604-58-1234-5',
  320,
  'Tiếng Việt',
  86000,
  69000,
  150,
  1250,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Kỹ năng sống' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Nhà Giả Kim',
  'Tiểu thuyết giàu hình ảnh ẩn dụ về hành trình tìm kiếm kho báu.',
  'Paulo Coelho',
  'NXB Văn học',
  '978-604-58-2345-6',
  288,
  'Tiếng Việt',
  75000,
  NULL,
  200,
  890,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Văn học' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Tư Dụng Nhanh Và Chậm',
  'Khám phá hai hệ thống tư duy của con người.',
  'Daniel Kahneman',
  'NXB Tri thức',
  '978-604-58-3456-7',
  620,
  'Tiếng Việt',
  165000,
  139000,
  80,
  450,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Kinh tế' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Doraemon Tập 1',
  'Truyện tranh nổi tiếng Nhật Bản dành cho trẻ em.',
  'Fujiko F. Fujio',
  'NXB Kim Đồng',
  '978-604-58-4567-8',
  180,
  'Tiếng Việt',
  22000,
  NULL,
  300,
  5000,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Thiếu nhi' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Vũ Trụ Trong Một Vỏ Hạt Dẻ',
  'Khám phá vũ trụ qua lăng kính vật lý lượng tử.',
  'Michio Kaku',
  'NXB Tri thức',
  '978-604-58-5678-9',
  450,
  'Tiếng Việt',
  120000,
  99000,
  60,
  320,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Khoa học' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Lịch Sử Việt Nam',
  'Tổng quan lịch sử Việt Nam từ thời tiền sử đến hiện đại.',
  'Trần Trọng Kim',
  'NXB Giáo dục',
  '978-604-58-6789-0',
  560,
  'Tiếng Việt',
  95000,
  NULL,
  120,
  180,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Lịch sử' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Đàn Ông Sao Hỏa Đàn Bà Kim Tinh',
  'Hiểu về sự khác biệt giữa nam và nữ trong tình yêu.',
  'John Gray',
  'NXB Phụ nữ',
  '978-604-58-7890-1',
  380,
  'Tiếng Việt',
  72000,
  59000,
  90,
  560,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Tâm lý' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Nghệ Thuật Chiến Lược',
  'Binh pháp Tôn Tử và ứng dụng trong kinh doanh.',
  'Tôn Tử',
  'NXB Văn hóa',
  '978-604-58-8901-2',
  180,
  'Tiếng Việt',
  45000,
  35000,
  200,
  890,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Kinh tế' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Hướng Dẫn Du Lịch Đà Lạt',
  'Cẩm nang du lịch Đà Lạt đầy đủ và chi tiết.',
  'Lê Minh',
  'NXB Du lịch',
  NULL,
  120,
  'Tiếng Việt',
  55000,
  NULL,
  75,
  120,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Du lịch' LIMIT 1;

INSERT INTO "products" (id, name, description, author, publisher, isbn, pages, language, price, "discountPrice", "stockQuantity", "soldCount", "isActive", "categoryId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Món Ngon Mỗi Ngày',
  'Tuyển tập 100 công thức nấu ăn đơn giản.',
  'Mai Anh',
  'NXB Phụ nữ',
  '978-604-58-9012-3',
  250,
  'Tiếng Việt',
  85000,
  69000,
  100,
  340,
  true,
  id,
  NOW(),
  NOW()
FROM "categories" WHERE name = 'Nấu ăn' LIMIT 1;