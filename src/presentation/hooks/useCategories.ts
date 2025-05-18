import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/application/features/categories/CategoriesService';
import { Category } from '@/infrastructure/api/mock/data/categories.data';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

/**
 * Hook for fetching and managing categories data
 * Uses React Query for data fetching and caching
 */
export const useCategories = (categoriesService: CategoriesService) => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesService.getCategories(),
  });
}; 