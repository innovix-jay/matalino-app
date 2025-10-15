import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  generateImage,
  updateImage,
  deleteImage,
  searchImages,
  createVariation,
  createCollection,
  addToCollection,
} from '@/lib/actions/ai-images';
import { GeneratedImage, ImageStyleType } from '@/types/ai';

// Query keys
export const imageKeys = {
  all: ['ai-images'] as const,
  lists: () => [...imageKeys.all, 'list'] as const,
  list: (filters: any) => [...imageKeys.lists(), filters] as const,
  details: () => [...imageKeys.all, 'detail'] as const,
  detail: (id: string) => [...imageKeys.details(), id] as const,
  collections: () => [...imageKeys.all, 'collections'] as const,
};

// ===== Queries =====

export function useImages(filters?: {
  query?: string;
  tags?: string[];
  modelId?: string;
  style?: string;
  isFavorite?: boolean;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: imageKeys.list(filters || {}),
    queryFn: async () => {
      const result = await searchImages(filters || {});
      if (result.error) throw result.error;
      return result.data!;
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useFavoriteImages() {
  return useImages({ isFavorite: true });
}

// ===== Mutations =====

export function useGenerateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      prompt: string;
      negativePrompt?: string;
      style?: ImageStyleType;
      size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
      quality?: 'standard' | 'hd';
      count?: number;
      tags?: string[];
      collectionId?: string;
    }) => {
      const result = await generateImage(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      // Invalidate all image lists to show new image
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });

      // Invalidate usage stats
      queryClient.invalidateQueries({ queryKey: ['ai-usage-stats'] });
      queryClient.invalidateQueries({ queryKey: ['ai-daily-budget'] });

      toast.success('Image generated successfully!', {
        description: `Used ${data.model_id} model - $${(data.cost_cents / 100).toFixed(4)}`,
      });
    },
    onError: (error: Error) => {
      if (error.message.includes('quota exceeded')) {
        toast.error('Image generation quota exceeded', {
          description: 'Upgrade your plan to generate more images',
        });
      } else if (error.message.includes('budget limit')) {
        toast.error('Daily budget limit reached', {
          description: error.message,
        });
      } else {
        toast.error('Failed to generate image', {
          description: error.message,
        });
      }
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      imageId: string;
      tags?: string[];
      isFavorite?: boolean;
      isPublic?: boolean;
    }) => {
      const result = await updateImage(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onMutate: async ({ imageId, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: imageKeys.lists() });

      // Snapshot previous value
      const previousImages = queryClient.getQueriesData({ queryKey: imageKeys.lists() });

      // Optimistically update
      queryClient.setQueriesData<GeneratedImage[]>(
        { queryKey: imageKeys.lists() },
        (old) => old?.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
      );

      return { previousImages };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousImages) {
        context.previousImages.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to update image: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
      toast.success('Image updated');
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const result = await deleteImage({ imageId });
      if (result.error) throw result.error;
    },
    onMutate: async (imageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: imageKeys.lists() });

      // Snapshot previous value
      const previousImages = queryClient.getQueriesData({ queryKey: imageKeys.lists() });

      // Optimistically remove
      queryClient.setQueriesData<GeneratedImage[]>(
        { queryKey: imageKeys.lists() },
        (old) => old?.filter((img) => img.id !== imageId)
      );

      return { previousImages };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousImages) {
        context.previousImages.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Failed to delete image: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
      toast.success('Image deleted');
    },
  });
}

export function useCreateVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const result = await createVariation({ imageId });
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['ai-usage-stats'] });

      toast.success('Variation created!', {
        description: `Cost: $${(data.cost_cents / 100).toFixed(4)}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create variation', {
        description: error.message,
      });
    },
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const result = await createCollection(input);
      if (result.error) throw result.error;
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.collections() });
      toast.success('Collection created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create collection: ${error.message}`);
    },
  });
}

export function useAddToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { collectionId: string; imageId: string }) => {
      const result = await addToCollection(input);
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.collections() });
      toast.success('Added to collection');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add to collection: ${error.message}`);
    },
  });
}

// Optimistic toggle favorite
export function useToggleFavorite() {
  const updateMutation = useUpdateImage();

  return {
    toggleFavorite: (imageId: string, currentFavorite: boolean) => {
      updateMutation.mutate({
        imageId,
        isFavorite: !currentFavorite,
      });
    },
    isPending: updateMutation.isPending,
  };
}
