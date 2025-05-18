import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Button } from '@/presentation/shared/atoms/Button';
import { Input } from '@/presentation/shared/atoms/Input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useTeams } from '@/presentation/hooks/useTeams';
import { useTeamContext } from '@/presentation/features/team/context/TeamContext';

interface KudoFiltersProps {
  onSearch: (query: string) => void;
  onTeamFilter: (teamId: number) => void;
  onSort: (order: 'recent' | 'oldest') => void;
}

export const KudoFilters: React.FC<KudoFiltersProps> = ({
  onSearch,
  onTeamFilter,
  onSort,
}) => {
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'oldest'>('recent');
  const { teamService } = useTeamContext();
  const { data: teams, isLoading: isLoadingTeams, error: teamsError } = useTeams(teamService);

  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-4 items-center" style={{ flexDirection: 'row-reverse' }}>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] justify-between bg-gray-50 hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span>
                  {selectedSort === 'recent' ? 'Most Recent' : 'Oldest First'}
                </span>
              </div>
              <MdKeyboardArrowDown className="w-5 h-5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[280px] bg-white shadow-lg rounded-md"
          >
            <div className="py-2 px-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Sort By</h3>
            </div>
            <div className="py-2">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSort('recent');
                  onSort('oldest');
                }}
                className="py-2.5 px-3 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSort('oldest');
                  onSort('recent');
                }}
                className="py-2.5 px-3 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                Oldest First
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Team Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] justify-between bg-gray-50 hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span className="truncate">
                  {isLoadingTeams ? 'Loading teams...' : selectedTeam}
                </span>
              </div>
              <MdKeyboardArrowDown className="w-5 h-5 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[280px] bg-white shadow-lg rounded-md"
          >
            <div className="py-2 px-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Select Team</h3>
            </div>
            <div className="py-2">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTeam('All Teams');
                  onTeamFilter(0);
                }}
                className="py-2.5 px-3 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                All Teams
              </DropdownMenuItem>
              {teams?.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team.name);
                    onTeamFilter(team.id);
                  }}
                  className="py-2.5 px-3 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="w-full">
          <div className="w-full flex invisible">
            Search
          </div>
          <Input
            type="text"
            placeholder="Search kudos..."
            className=" w-full bg-gray-50 focus:bg-white transition-colors"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}; 