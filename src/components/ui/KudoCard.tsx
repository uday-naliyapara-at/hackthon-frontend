import React from 'react';
import { format } from 'date-fns';

import { type Kudos } from '@/domain/models/kudos/types'
import { cn } from '@/lib/utils';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { HiSparkles } from 'react-icons/hi2';

// Default theme for unknown kudos types
const DEFAULT_THEME = {
  bgColor: 'bg-gray-50',
  iconColor: 'text-gray-500',
  textColor: 'text-gray-700'
};


interface KudoCardProps {
  kudos: Kudos;
  className?: string;
}

export const KudoCard: React.FC<KudoCardProps> = ({ kudos, className }) => {
  const theme = DEFAULT_THEME;
  const KudosIcon = HiSparkles;

  return (
    <div 
      className={cn(
        'rounded-lg p-6 shadow-sm border',
        theme.bgColor,
        className
      )}
    >
      {/* Header with kudos type and icon */}
      <div className="flex items-center gap-2 mb-4">
        <Icon 
          icon={KudosIcon} 
          className={cn('w-5 h-5', theme.iconColor)}
        />
        <h3 className={cn('text-lg font-semibold', theme.textColor)}>
          {kudos.type}
        </h3>
      </div>

      {/* Recipient info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={kudos.recipient.avatarUrl}
          alt={kudos.recipient.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-medium text-gray-900">{kudos.recipient.name}</h4>
          <p className="text-sm text-gray-500">{kudos.recipient.team}</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-700 mb-4">{kudos.message}</p>

      {/* Footer with sender info and date */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>From:</span>
        <div className="flex items-center gap-2">
          <img
            src={kudos.sender.avatarUrl}
            alt={kudos.sender.name}
            className="w-6 h-6 rounded-full"
          />
          <span>{kudos.sender.name}</span>
        </div>
        <span className="ml-auto">{format(kudos.createdAt, 'MMM d, yyyy')}</span>
      </div>
    </div>
  );
}; 