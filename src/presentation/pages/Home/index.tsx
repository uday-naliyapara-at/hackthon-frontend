import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { KudoCard } from '@/components/ui/KudoCard';
import { KudoFilters } from '@/components/ui/KudoFilters';
import { kudosRepository } from '@/infrastructure/api/kudos/KudosRepository';
import { Alert, AlertTitle, AlertDescription } from '@/presentation/shared/atoms/Alert';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner/LoadingSpinner';
import { Kudos } from '@/domain/models/kudos/types';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import styles from './Home.module.css';
import { Button } from '@/components/ui/button';
import { HiArrowLongRight, HiArrowLongDown } from 'react-icons/hi2';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GiveKudoModal } from '@/presentation/features/kudos/components/GiveKudoModal';

// Define breakpoints for responsive masonry layout
const breakpointColumns = {
  default: 3,    // Default number of columns
  1536: 3,       // 2xl screens
  1280: 3,       // xl screens
  1024: 3,       // lg screens
  768: 2,        // md screens
  640: 1,        // sm screens
};

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  teamId: number;
}

export const HomePage: React.FC = () => {
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // Modal state
  const [isGiveKudoModalOpen, setIsGiveKudoModalOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(0);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get user info from localStorage
  const getUserInfo = (): UserInfo | null => {
    const userInfoStr = localStorage.getItem('auth_user');
    console.log('User Info String:', userInfoStr);
    if (!userInfoStr) return null;
    try {
      const parsed = JSON.parse(userInfoStr);
      console.log('Parsed User Info:', parsed);
      return parsed;
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  };

  const userInfo = getUserInfo();
  console.log('Current User Role:', userInfo?.role);
  const canGiveKudos = userInfo?.role === 'TECH_LEAD';

  const fetchKudos = async (teamId?: number, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      const response = await kudosRepository.getAllKudos({
        teamId,
        sortOrder: sortOrder === 'recent' ? 'asc' : 'desc',
        page,
        limit: PAGE_SIZE
      });

      // Update hasMore based on whether we received less items than the page size
      setHasMore(response.length === PAGE_SIZE);

      // If loading more, append to existing kudos, otherwise replace
      setKudos(prevKudos => isLoadMore ? [...prevKudos, ...response] : response);
    } catch (err) {
      setError('Failed to fetch kudos. Please try again later.');
      console.error('Error fetching kudos:', err);
    } finally {
      if (!isLoadMore) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchKudos(selectedTeamId);
  }, [selectedTeamId, sortOrder]);

  // Handle search
  useEffect(() => {
    const searchKudos = async () => {
      if (!debouncedSearchQuery) {
        // If search query is empty, fetch all kudos
        setPage(1);
        setHasMore(true);
        fetchKudos(selectedTeamId);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);
        const results = await kudosRepository.searchKudos(debouncedSearchQuery, {
          teamId: selectedTeamId,
          page: 1,
          limit: PAGE_SIZE
        });
        setKudos(results);
        setHasMore(results.length === PAGE_SIZE);
        setPage(1);
      } catch (err) {
        setError('Failed to search kudos. Please try again later.');
        console.error('Error searching kudos:', err);
      } finally {
        setIsSearching(false);
      }
    };

    searchKudos();
  }, [debouncedSearchQuery, selectedTeamId]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isSearching) return;

    setPage(prevPage => prevPage + 1);
    if (debouncedSearchQuery) {
      // Handle load more for search
      setIsLoadingMore(true);
      kudosRepository.searchKudos(debouncedSearchQuery, {
        teamId: selectedTeamId,
        page: page + 1,
        limit: PAGE_SIZE
      }).then(results => {
        setKudos(prevKudos => [...prevKudos, ...results]);
        setHasMore(results.length === PAGE_SIZE);
      }).catch(err => {
        console.error('Error loading more search results:', err);
      }).finally(() => {
        setIsLoadingMore(false);
      });
    } else {
      // Handle load more for regular kudos
      fetchKudos(selectedTeamId, true);
    }
  }, [hasMore, isLoadingMore, isSearching, page, debouncedSearchQuery, selectedTeamId]);

  // Sort kudos client-side when in search mode
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
      <div className="flex justify-end justify-between items-center">
        {canGiveKudos && (
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
            onClick={() => setIsGiveKudoModalOpen(true)}
          >
            <span>Give Kudos</span>
            <Icon icon={HiArrowLongRight} className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
        <KudoFilters
          onSearch={handleSearch}
          onTeamFilter={handleTeamFilter}
          onSort={setSortOrder}
        />
      </div>

      {error ? (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="mt-6">
          {(isLoading && !kudos.length) ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <Masonry
                breakpointCols={breakpointColumns}
                className={styles['masonry-grid']}
                columnClassName={styles['masonry-grid-column']}
              >
                {sortedKudos.map((kudo) => (
                  <div key={kudo.id} className={styles['masonry-grid-item']}>
                    <KudoCard kudos={kudo} />
                  </div>
                ))}
              </Masonry>

              {sortedKudos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No kudos found matching your filters.
                </div>
              ) : hasMore && (
                <div className="flex justify-center mt-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-xs"
                  >
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore || isSearching}
                      className={cn(
                        "w-full relative overflow-hidden group",
                        "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
                        "hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
                        "text-white font-semibold tracking-wide",
                        "shadow-lg hover:shadow-xl",
                        "transition-all duration-300 ease-out",
                        "border-none outline-none",
                        "py-6 rounded-xl"
                      )}
                    >
                      <div className="relative flex items-center justify-center gap-3">
                        {isLoadingMore ? (
                          <>
                            <LoadingSpinner size="sm" className="text-white/90 animate-spin" />
                            <span className="animate-pulse">Loading more kudos...</span>
                          </>
                        ) : (
                          <>
                            <span>Load More Kudos</span>
                            <motion.div
                              animate={{
                                y: [0, -4, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Icon
                                icon={HiArrowLongDown}
                                className="w-5 h-5 transition-transform group-hover:scale-110"
                              />
                            </motion.div>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {canGiveKudos && (
        <GiveKudoModal
          isOpen={isGiveKudoModalOpen}
          onClose={() => setIsGiveKudoModalOpen(false)}
        />
      )}
    </div>
  );
}; 