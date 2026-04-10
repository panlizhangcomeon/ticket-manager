import { apiClient } from './api';
import type { Tag, CreateTagRequest, UpdateTagRequest, TagListResponse } from '../types/tag';

export const tagService = {
  async getTags(): Promise<Tag[]> {
    const response = await apiClient.get<TagListResponse>('/api/v1/tags');
    return response.data.tags;
  },

  async getTag(id: number): Promise<Tag> {
    const response = await apiClient.get<{ tag: Tag }>(`/api/v1/tags/${id}`);
    return response.data.tag;
  },

  async createTag(data: CreateTagRequest): Promise<Tag> {
    const response = await apiClient.post<{ tag: Tag }>('/api/v1/tags', data);
    return response.data.tag;
  },

  async updateTag(id: number, data: UpdateTagRequest): Promise<Tag> {
    const response = await apiClient.put<{ tag: Tag }>(`/api/v1/tags/${id}`, data);
    return response.data.tag;
  },

  async deleteTag(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/tags/${id}`);
  },
};
