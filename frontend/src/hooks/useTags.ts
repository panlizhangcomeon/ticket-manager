import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tags';
import type { CreateTagRequest, UpdateTagRequest } from '../types/tag';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagRequest }) =>
      tagService.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useReorderTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagIds: number[]) => tagService.reorderTags(tagIds),
    onSuccess: (nextTags) => {
      queryClient.setQueryData(['tags'], nextTags);
    },
  });
}
