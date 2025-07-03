import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, PaginatedResponse } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Tasks API functions
const tasksApi = {
  getTasks: async (page = 1, limit = 10): Promise<PaginatedResponse<Task>> => {
    const response = await api.get(`/tasks?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async ({ id, ...updateData }: UpdateTaskRequest & { id: string }): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, updateData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggleTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
};

// Get all tasks hook
export const useTasks = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['tasks', page, limit],
    queryFn: () => tasksApi.getTasks(page, limit),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single task hook
export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
};

// Create task hook
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: `"${newTask.title}" has been added to your tasks`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create task",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    },
  });
};

// Update task hook
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.updateTask,
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      toast({
        title: "Task updated",
        description: `"${updatedTask.title}" has been updated`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update task",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    },
  });
};

// Delete task hook
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: "Task has been removed from your list",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete task",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    },
  });
};

// Toggle task completion hook
export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.toggleTask,
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      toast({
        title: updatedTask.completed ? "Task completed" : "Task reopened",
        description: `"${updatedTask.title}" ${updatedTask.completed ? 'marked as done' : 'marked as pending'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update task",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    },
  });
};