#!/bin/bash

# 运行后端测试脚本

echo "=========================================="
echo "运行 Ticket 管理系统后端测试"
echo "=========================================="

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装测试依赖..."
pip install -q -r requirements.txt

# 运行测试
echo ""
echo "运行测试..."
pytest app/tests/ -v --tb=short

# 显示测试覆盖率（如果安装了pytest-cov）
if pip show pytest-cov > /dev/null 2>&1; then
    echo ""
    echo "生成测试覆盖率报告..."
    pytest app/tests/ --cov=app --cov-report=term-missing
fi

echo ""
echo "=========================================="
echo "测试完成"
echo "=========================================="
