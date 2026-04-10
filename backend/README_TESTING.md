# 后端测试说明

## 测试框架

使用 `pytest` 作为测试框架，配合 `httpx` 进行 API 测试。

## 运行测试

### 方式一：使用测试脚本

```bash
chmod +x run_tests.sh
./run_tests.sh
```

### 方式二：手动运行

```bash
# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行所有测试
pytest app/tests/ -v

# 运行特定测试文件
pytest app/tests/test_tickets.py -v

# 运行特定测试用例
pytest app/tests/test_tickets.py::TestTicketCRUD::test_create_ticket_success -v
```

## 测试覆盖率

如果需要查看测试覆盖率，需要先安装 `pytest-cov`：

```bash
pip install pytest-cov
pytest app/tests/ --cov=app --cov-report=term-missing
```

## 测试说明

### 测试数据库

测试使用 SQLite 内存数据库，不会影响开发数据库。每个测试用例运行前会创建新的数据库，运行后会自动清理。

### 测试用例

- **test_tickets.py**: Ticket CRUD 操作、状态管理、搜索和过滤测试
- **test_tags.py**: 标签 CRUD 操作测试

### Fixtures

- `db`: 数据库会话
- `client`: FastAPI 测试客户端
- `sample_tag`: 示例标签
- `sample_ticket`: 示例 Ticket（包含标签）

## 注意事项

1. 测试使用 SQLite 内存数据库，某些 MySQL 特定功能可能无法测试
2. 每个测试用例都是独立的，不会相互影响
3. 测试会自动清理数据，无需手动清理
