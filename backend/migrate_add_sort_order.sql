-- 已有库升级：为 tags 增加排序字段（任选其一执行）

-- MySQL / MariaDB
-- ALTER TABLE tags ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER color;
-- CREATE INDEX idx_sort_order ON tags(sort_order);

-- SQLite
-- ALTER TABLE tags ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
