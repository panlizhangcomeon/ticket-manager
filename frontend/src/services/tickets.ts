import { apiClient } from './api';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest, TicketListResponse } from '../types/ticket';

export const ticketService = {
  async getTickets(params?: {
    include_completed?: boolean;
    tag_id?: number;
    keyword?: string;
  }): Promise<Ticket[]> {
    const response = await apiClient.get<TicketListResponse>('/api/v1/tickets', { params });
    return response.data.tickets;
  },

  async getTicket(id: number): Promise<Ticket> {
    const response = await apiClient.get<{ ticket: Ticket } | Ticket>(`/api/v1/tickets/${id}`);
    // 兼容两种返回格式：{ ticket: Ticket } 或直接返回 Ticket
    const ticket = (response.data as { ticket: Ticket }).ticket || (response.data as Ticket);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  },

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<{ ticket: Ticket }>('/api/v1/tickets', data);
    return response.data.ticket;
  },

  async updateTicket(id: number, data: UpdateTicketRequest): Promise<Ticket> {
    const response = await apiClient.put<{ ticket: Ticket }>(`/api/v1/tickets/${id}`, data);
    return response.data.ticket;
  },

  async deleteTicket(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/tickets/${id}`);
  },

  async completeTicket(id: number): Promise<Ticket> {
    const response = await apiClient.patch<{ ticket: Ticket }>(`/api/v1/tickets/${id}/complete`);
    return response.data.ticket;
  },

  async uncompleteTicket(id: number): Promise<Ticket> {
    const response = await apiClient.patch<{ ticket: Ticket }>(`/api/v1/tickets/${id}/uncomplete`);
    return response.data.ticket;
  },
};
