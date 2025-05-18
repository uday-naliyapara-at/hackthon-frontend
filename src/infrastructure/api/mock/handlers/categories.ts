import { http, HttpResponse } from 'msw';
import { MOCK_CATEGORIES } from '../data/categories.data';

export const categoriesHandlers = [
  http.get('/api/categories', () => {
    return HttpResponse.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: MOCK_CATEGORIES,
    });
  }),
]; 