TRUNCATE TABLE foods RESTART IDENTITY CASCADE;

INSERT INTO foods (name, price, category, description)
VALUES
    ('Cơm Tấm Sườn Bì', 45000, 'Cơm', 'Sườn nướng mật ong kèm bì chả truyền thống'),
    ('Bún Bò Huế Đặc Biệt', 55000, 'Bún', 'Bún bò gốc Huế, đầy đủ topping giò chả'),
    ('Phở Bò Tái Lăn', 50000, 'Phở', 'Thịt bò xào gừng tỏi thơm nức'),
    ('Trà Sữa Thái Xanh', 30000, 'Nước', 'Trà sữa thơm mùi trà Thái, thạch giòn'),
    ('Gà Rán Giòn', 35000, 'Ăn vặt', 'Gà rán tẩm bột chiên xù phong cách Hàn Quốc');