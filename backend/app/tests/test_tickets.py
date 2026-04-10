import pytest
from fastapi import status
from app.models import Ticket, Tag


class TestTicketCRUD:
    """Ticket CRUD操作测试"""
    
    def test_create_ticket_success(self, client):
        """测试成功创建Ticket"""
        response = client.post(
            "/api/v1/tickets",
            json={
                "title": "新Ticket",
                "description": "Ticket描述",
                "tag_ids": []
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["ticket"]["title"] == "新Ticket"
        assert data["ticket"]["description"] == "Ticket描述"
        assert data["ticket"]["is_completed"] is False
        assert "id" in data["ticket"]
        assert "created_at" in data["ticket"]
    
    def test_create_ticket_with_tags(self, client, sample_tag):
        """测试创建带标签的Ticket"""
        response = client.post(
            "/api/v1/tickets",
            json={
                "title": "带标签的Ticket",
                "description": "描述",
                "tag_ids": [sample_tag.id]
            }
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert len(data["ticket"]["tags"]) == 1
        assert data["ticket"]["tags"][0]["id"] == sample_tag.id
    
    def test_create_ticket_empty_title(self, client):
        """测试创建Ticket时标题为空（应失败）"""
        response = client.post(
            "/api/v1/tickets",
            json={
                "title": "",
                "description": "描述"
            }
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_all_tickets(self, client, sample_ticket):
        """测试获取所有Ticket"""
        response = client.get("/api/v1/tickets")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) >= 1
        assert any(t["id"] == sample_ticket.id for t in data["tickets"])
    
    def test_get_ticket_by_id(self, client, sample_ticket):
        """测试根据ID获取Ticket（存在）"""
        response = client.get(f"/api/v1/tickets/{sample_ticket.id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["ticket"]["id"] == sample_ticket.id
        assert data["ticket"]["title"] == sample_ticket.title
    
    def test_get_ticket_not_found(self, client):
        """测试获取不存在的Ticket（应返回404）"""
        response = client.get("/api/v1/tickets/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_ticket(self, client, sample_ticket):
        """测试更新Ticket"""
        response = client.put(
            f"/api/v1/tickets/{sample_ticket.id}",
            json={
                "title": "更新后的标题",
                "description": "更新后的描述"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["ticket"]["title"] == "更新后的标题"
        assert data["ticket"]["description"] == "更新后的描述"
    
    def test_update_ticket_not_found(self, client):
        """测试更新不存在的Ticket（应返回404）"""
        response = client.put(
            "/api/v1/tickets/99999",
            json={"title": "新标题"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_ticket(self, client, db):
        """测试删除Ticket"""
        # 先创建一个Ticket
        create_response = client.post(
            "/api/v1/tickets",
            json={"title": "待删除的Ticket"}
        )
        ticket_id = create_response.json()["ticket"]["id"]
        
        # 删除Ticket
        response = client.delete(f"/api/v1/tickets/{ticket_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # 验证Ticket已被删除
        get_response = client.get(f"/api/v1/tickets/{ticket_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_ticket_not_found(self, client):
        """测试删除不存在的Ticket（应返回404）"""
        response = client.delete("/api/v1/tickets/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTicketStatus:
    """Ticket状态管理测试"""
    
    def test_complete_ticket(self, client, sample_ticket):
        """测试完成Ticket"""
        response = client.patch(f"/api/v1/tickets/{sample_ticket.id}/complete")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["ticket"]["is_completed"] is True
    
    def test_uncomplete_ticket(self, client, db):
        """测试取消完成Ticket"""
        # 先创建一个已完成的Ticket
        create_response = client.post(
            "/api/v1/tickets",
            json={"title": "已完成Ticket"}
        )
        ticket_id = create_response.json()["ticket"]["id"]
        
        # 完成Ticket
        client.patch(f"/api/v1/tickets/{ticket_id}/complete")
        
        # 取消完成
        response = client.patch(f"/api/v1/tickets/{ticket_id}/uncomplete")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["ticket"]["is_completed"] is False
    
    def test_complete_ticket_not_found(self, client):
        """测试完成不存在的Ticket（应返回404）"""
        response = client.patch("/api/v1/tickets/99999/complete")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestTicketSearchAndFilter:
    """Ticket搜索和过滤测试"""
    
    def test_search_tickets_by_keyword(self, client, db):
        """测试按标题搜索Ticket"""
        # 创建几个Ticket
        client.post("/api/v1/tickets", json={"title": "前端bug修复"})
        client.post("/api/v1/tickets", json={"title": "后端API开发"})
        client.post("/api/v1/tickets", json={"title": "数据库优化"})
        
        # 搜索包含"前端"的Ticket
        response = client.get("/api/v1/tickets?keyword=前端")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) >= 1
        assert all("前端" in t["title"] for t in data["tickets"])
    
    def test_filter_tickets_by_tag(self, client, sample_tag, db):
        """测试按标签过滤Ticket"""
        # 创建带标签的Ticket
        create_response = client.post(
            "/api/v1/tickets",
            json={
                "title": "带标签的Ticket",
                "tag_ids": [sample_tag.id]
            }
        )
        ticket_id = create_response.json()["ticket"]["id"]
        
        # 按标签过滤
        response = client.get(f"/api/v1/tickets?tag_id={sample_tag.id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["tickets"]) >= 1
        assert any(t["id"] == ticket_id for t in data["tickets"])
    
    def test_filter_exclude_completed(self, client, db):
        """测试过滤时排除已完成的Ticket"""
        # 创建一个未完成的Ticket
        create_response1 = client.post(
            "/api/v1/tickets",
            json={"title": "未完成Ticket"}
        )
        ticket_id1 = create_response1.json()["ticket"]["id"]
        
        # 创建一个已完成的Ticket
        create_response2 = client.post(
            "/api/v1/tickets",
            json={"title": "已完成Ticket"}
        )
        ticket_id2 = create_response2.json()["ticket"]["id"]
        client.patch(f"/api/v1/tickets/{ticket_id2}/complete")
        
        # 过滤时排除已完成的
        response = client.get("/api/v1/tickets?include_completed=false")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        ticket_ids = [t["id"] for t in data["tickets"]]
        assert ticket_id1 in ticket_ids
        assert ticket_id2 not in ticket_ids
