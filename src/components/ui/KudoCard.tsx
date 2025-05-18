import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

import { type Kudos } from '@/domain/models/kudos/types'
import { cn } from '@/lib/utils';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { HiSparkles, HiHeart, HiLightBulb, HiStar, HiFire } from 'react-icons/hi2';

type KudosTheme = {
  bgColor: string;
  iconColor: string;
  textColor: string;
  icon: IconType;
  borderColor: string;
};

type KudosThemeMap = {
  [key: string]: KudosTheme;
};

// Kudos themes for different types
const KUDOS_THEMES: KudosThemeMap = {
  appreciation: {
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    iconColor: 'text-pink-500',
    textColor: 'text-purple-700',
    icon: HiHeart,
    borderColor: 'border-pink-200'
  },
  achievement: {
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-500',
    textColor: 'text-orange-700',
    icon: HiStar,
    borderColor: 'border-yellow-200'
  },
  innovation: {
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconColor: 'text-blue-500',
    textColor: 'text-cyan-700',
    icon: HiLightBulb,
    borderColor: 'border-blue-200'
  },
  teamwork: {
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconColor: 'text-green-500',
    textColor: 'text-emerald-700',
    icon: HiFire,
    borderColor: 'border-green-200'
  }
};

// Default theme for unknown kudos types
const DEFAULT_THEME: KudosTheme = {
  bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
  iconColor: 'text-gray-500',
  textColor: 'text-gray-700',
  icon: HiSparkles,
  borderColor: 'border-gray-200'
};

interface KudoCardProps {
  kudos: Kudos;
  className?: string;
}

export const KudoCard: React.FC<KudoCardProps> = ({ kudos, className }) => {
  const theme = KUDOS_THEMES[kudos.type.toLowerCase()] || DEFAULT_THEME;
  const KudosIcon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'rounded-xl p-6 shadow-lg border backdrop-blur-sm',
        theme.bgColor,
        theme.borderColor,
        'hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Header with kudos type and icon */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'p-2 rounded-full',
            'bg-white/50 backdrop-blur-sm shadow-sm',
            theme.borderColor
          )}
        >
          <Icon
            icon={KudosIcon}
            className={cn('w-6 h-6', theme.iconColor)}
          />
        </motion.div>
        <h3 className={cn('text-lg font-semibold', theme.textColor)}>
          {kudos.type}
        </h3>
      </div>

      {/* Decorative separator with shine effect */}
      <div className="relative py-4">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={cn(
            'h-[1px] w-full',
            'bg-gradient-to-r',
            'from-transparent',
            { 'via-pink-200 to-purple-200': theme.icon === HiHeart },
            { 'via-yellow-200 to-orange-200': theme.icon === HiStar },
            { 'via-blue-200 to-cyan-200': theme.icon === HiLightBulb },
            { 'via-green-200 to-emerald-200': theme.icon === HiFire },
            { 'via-gray-200 to-slate-200': theme.icon === HiSparkles }
          )}
        />
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: 0.5 }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className={cn(
            'absolute top-4 left-0 h-[1px] w-1/3',
            'bg-gradient-to-r from-transparent via-white to-transparent'
          )}
        />
      </div>

      {/* Recipient info */}
      <div className="flex items-center gap-4 mb-4">
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={kudos.recipient.avatarUrl}
          alt={kudos.recipient.name}
          className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
        />
        <div>
          <h4 className={cn('font-medium text-lg', theme.textColor)}>{kudos.recipient.name}</h4>
          <p className="text-sm text-gray-600">{kudos.recipient.team}</p>
        </div>
      </div>

      {/* Message */}
      <div className="relative">
        <p className={cn('text-gray-700 mb-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm', 'border', theme.borderColor)}>
          "{kudos.message}"
        </p>
      </div>

      {/* Footer with sender info and date */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
        <span>From:</span>
        <div className="flex items-center gap-2">
          {/* <motion.img
            whileHover={{ scale: 1.1 }}
            src={kudos.sender.avatarUrl}
            alt={kudos.sender.name}
            className="w-8 h-8 rounded-full ring-1 ring-white shadow-sm"
          /> */}
          <span className="font-medium">{kudos.sender.name}</span>
        </div>
        <span className="ml-auto">{format(kudos.createdAt, 'MMM d, yyyy')}</span>
      </div>
    </motion.div>
  );
}; 