import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { CategoriesService } from '@/application/features/categories/CategoriesService';
import { CategoriesRepository } from '@/infrastructure/api/categories/CategoriesRepository';
import { createHttpClient } from '@/infrastructure/utils/http/httpClientFactory';

interface CategoriesContextType {
    categoriesService: CategoriesService;
}

interface CategoriesProviderProps {
    children: ReactNode;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
    const services = useMemo(() => {
        // Create HTTP client
        const httpClient = createHttpClient(async () => ''); // Simple refresh token for now

        // Create repository
        const categoriesRepository = new CategoriesRepository(httpClient);

        // Create service
        const categoriesService = new CategoriesService(categoriesRepository);

        return {
            categoriesService,
        };
    }, []);

    return <CategoriesContext.Provider value={services}>{children}</CategoriesContext.Provider>;
};

export const useCategoriesContext = () => {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategoriesContext must be used within a CategoriesProvider');
    }
    return context;
}; 