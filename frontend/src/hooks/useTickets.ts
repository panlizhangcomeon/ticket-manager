import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/tickets';
import type { CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';

export function useTickets(params?: {
  include_completed?: boolean;
  tag_id?: number;
  keyword?: string;
}) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketService.getTickets(params),
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTicketRequest }) =>
      ticketService.updateTicket(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ticketService.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useToggleComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_completed }: { id: number; is_completed: boolean }) =>
      is_completed ? ticketService.completeTicket(id) : ticketService.uncompleteTicket(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
}
