import { CategoriesRepository } from '@/infrastructure/api/categories/CategoriesRepository';
import { Category } from '@/infrastructure/api/mock/data/categories.data';

export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.getCategories();
  }
} 