import type { Tag } from './tag';

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  tag_ids?: number[];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  tag_ids?: number[];
}

export interface TicketListResponse {
  tickets: Ticket[];
}
