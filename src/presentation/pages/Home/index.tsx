import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { KudoCard } from '@/components/ui/KudoCard';
import { KudoFilters } from '@/components/ui/KudoFilters';
import { kudosRepository } from '@/infrastructure/api/kudos/KudosRepository';
import { Alert, AlertTitle, AlertDescription } from '@/presentation/shared/atoms/Alert';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner/LoadingSpinner';
import { Kudos } from '@/domain/models/kudos/types';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { Link } from '../../shared/atoms/Link/index.tsx';
import { HiChartPie } from 'react-icons/hi2';

export const HomePage: React.FC = () => {
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(0);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchKudos = async (teamId?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await kudosRepository.getAllKudos({ teamId });
      setKudos(response);
    } catch (err) {
      setError('Failed to fetch kudos. Please try again later.');
      console.error('Error fetching kudos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchKudos(selectedTeamId);
  }, [selectedTeamId]);

  // Handle search
  useEffect(() => {
    const searchKudos = async () => {
      if (!debouncedSearchQuery) {
        // If search query is empty, fetch all kudos
        fetchKudos(selectedTeamId);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);
        const results = await kudosRepository.searchKudos(debouncedSearchQuery, { teamId: selectedTeamId });
        setKudos(results);
      } catch (err) {
        setError('Failed to search kudos. Please try again later.');
        console.error('Error searching kudos:', err);
      } finally {
        setIsSearching(false);
      }
    };

    searchKudos();
  }, [debouncedSearchQuery, selectedTeamId]);

  // Sort kudos
  const sortedKudos = useMemo(() => {
    const sorted = [...kudos];
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [kudos, sortOrder]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTeamFilter = useCallback((teamId: number) => {
    setSelectedTeamId(teamId);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kudos Wall</h1>
        <Link 
          to="/analytics" 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <HiChartPie />
          Analytics Dashboard
        </Link>
      </div>
      <KudoFilters
        onSearch={handleSearch}
        onTeamFilter={handleTeamFilter}
        onSort={setSortOrder}
      />
      
      {error ? (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {(isLoading || isSearching) ? (
            <div className="col-span-full flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {sortedKudos.map((kudo) => (
                <KudoCard
                  key={kudo.id}
                  kudos={kudo}
                />
              ))}
              {sortedKudos.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No kudos found matching your filters.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}; 