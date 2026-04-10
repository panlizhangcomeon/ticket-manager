import pytest
from fastapi import status
from app.models import Tag


class TestTagCRUD:
    """标签CRUD操作测试"""
    
    def test_create_tag_success(self, client):
        """测试成功创建标签"""
        response = client.post(
            "/api/v1/tags",
            json={
                "name": "新标签",
                "color": "#FF5733"
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["tag"]["name"] == "新标签"
        assert data["tag"]["color"] == "#FF5733"
        assert "id" in data["tag"]
        assert "created_at" in data["tag"]
    
    def test_create_tag_with_default_color(self, client):
        """测试创建标签时使用默认颜色"""
        response = client.post(
            "/api/v1/tags",
            json={"name": "默认颜色标签"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["tag"]["color"] == "#3B82F6"  # 默认颜色
    
    def test_create_tag_empty_name(self, client):
        """测试创建标签时名称为空（应失败）"""
        response = client.post(
            "/api/v1/tags",
            json={"name": ""}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_tag_invalid_color(self, client):
        """测试创建标签时颜色格式无效（应失败）"""
        response = client.post(
            "/api/v1/tags",
            json={
                "name": "标签",
                "color": "invalid-color"
            }
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_all_tags(self, client, sample_tag):
        """测试获取所有标签"""
        response = client.get("/api/v1/tags")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tags"]) >= 1
        assert any(t["id"] == sample_tag.id for t in data["tags"])
    
    def test_get_tag_by_id(self, client, sample_tag):
        """测试根据ID获取标签（存在）"""
        response = client.get(f"/api/v1/tags/{sample_tag.id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["tag"]["id"] == sample_tag.id
        assert data["tag"]["name"] == sample_tag.name
    
    def test_get_tag_not_found(self, client):
        """测试获取不存在的标签（应返回404）"""
        response = client.get("/api/v1/tags/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_tag(self, client, sample_tag):
        """测试更新标签"""
        response = client.put(
            f"/api/v1/tags/{sample_tag.id}",
            json={
                "name": "更新后的标签名",
                "color": "#00FF00"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["tag"]["name"] == "更新后的标签名"
        assert data["tag"]["color"] == "#00FF00"
    
    def test_update_tag_partial(self, client, sample_tag):
        """测试部分更新标签（只更新名称）"""
        response = client.put(
            f"/api/v1/tags/{sample_tag.id}",
            json={"name": "只更新名称"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["tag"]["name"] == "只更新名称"
        # 颜色应该保持不变
        assert data["tag"]["color"] == sample_tag.color
    
    def test_update_tag_not_found(self, client):
        """测试更新不存在的标签（应返回404）"""
        response = client.put(
            "/api/v1/tags/99999",
            json={"name": "新名称"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_tag(self, client, db):
        """测试删除标签"""
        # 先创建一个标签
        create_response = client.post(
            "/api/v1/tags",
            json={"name": "待删除的标签"}
        )
        tag_id = create_response.json()["tag"]["id"]
        
        # 删除标签
        response = client.delete(f"/api/v1/tags/{tag_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # 验证标签已被删除
        get_response = client.get(f"/api/v1/tags/{tag_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_tag_cascade(self, client, db, sample_tag):
        """测试删除标签时级联删除关联关系"""
        # 创建一个带标签的Ticket
        create_response = client.post(
            "/api/v1/tickets",
            json={
                "title": "带标签的Ticket",
                "tag_ids": [sample_tag.id]
            }
        )
        ticket_id = create_response.json()["ticket"]["id"]
        
        # 删除标签
        client.delete(f"/api/v1/tags/{sample_tag.id}")
        
        # 验证Ticket仍然存在，但标签关联已删除
        ticket_response = client.get(f"/api/v1/tickets/{ticket_id}")
        assert ticket_response.status_code == status.HTTP_200_OK
        ticket_data = ticket_response.json()
        assert len(ticket_data["ticket"]["tags"]) == 0
    
    def test_delete_tag_not_found(self, client):
        """测试删除不存在的标签（应返回404）"""
        response = client.delete("/api/v1/tags/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
