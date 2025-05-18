import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

import { type Kudos } from '@/domain/models/kudos/types'
import { cn } from '@/lib/utils';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { HiSparkles, HiHeart, HiLightBulb, HiStar, HiFire, HiWrenchScrewdriver, HiUserGroup, HiHandRaised } from 'react-icons/hi2';

type KudosTheme = {
  bgColor: string;
  hoverBg: string;
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
  'Problem Solver': {
    bgColor: 'bg-gradient-to-br from-indigo-50 to-violet-50',
    hoverBg: 'bg-gradient-purple',
    iconColor: 'text-indigo-500',
    textColor: 'text-violet-700',
    icon: HiWrenchScrewdriver,
    borderColor: 'border-indigo-200'
  },
  'Leadership': {
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    hoverBg: 'bg-gradient-yellow',
    iconColor: 'text-amber-500',
    textColor: 'text-yellow-700',
    icon: HiUserGroup,
    borderColor: 'border-amber-200'
  },
  'Helping Hand': {
    bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    hoverBg: 'bg-gradient-teal',
    iconColor: 'text-teal-500',
    textColor: 'text-cyan-700',
    icon: HiHandRaised,
    borderColor: 'border-teal-200'
  },
  'Well Done': {
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    hoverBg: 'bg-gradient-orange',
    iconColor: 'text-yellow-500',
    textColor: 'text-orange-700',
    icon: HiStar,
    borderColor: 'border-yellow-200'
  },
  'Great Teamwork': {
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    hoverBg: 'bg-gradient-green',
    iconColor: 'text-green-500',
    textColor: 'text-emerald-700',
    icon: HiFire,
    borderColor: 'border-green-200'
  },
  'Brilliant Idea': {
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    hoverBg: 'bg-gradient-blue',
    iconColor: 'text-blue-500',
    textColor: 'text-cyan-700',
    icon: HiLightBulb,
    borderColor: 'border-blue-200'
  }
};

// Default theme for unknown kudos types
const DEFAULT_THEME: KudosTheme = {
  bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
  hoverBg: 'bg-gradient-gray',
  iconColor: 'text-gray-500',
  textColor: 'text-gray-700',
  icon: HiSparkles,
  borderColor: 'border-gray-200'
};

// Add styles at the top of the component
const gradientStyles = `
  @keyframes gradient-purple {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .bg-gradient-animated-purple {
    background: linear-gradient(45deg, #e9d5ff, #f3e8ff, #ddd6fe);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-yellow {
    background: linear-gradient(45deg, #fef3c7, #fef9c3, #fde68a);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-teal {
    background: linear-gradient(45deg, #ccfbf1, #cffafe, #a5f3fc);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-orange {
    background: linear-gradient(45deg, #ffedd5, #fed7aa, #fdba74);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-green {
    background: linear-gradient(45deg, #dcfce7, #bbf7d0, #86efac);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-blue {
    background: linear-gradient(45deg, #dbeafe, #bfdbfe, #93c5fd);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }

  .bg-gradient-animated-gray {
    background: linear-gradient(45deg, #f9fafb, #f3f4f6, #e5e7eb);
    background-size: 200% 200%;
    animation: gradient-purple 3s ease infinite;
  }
`;

interface KudoCardProps {
  kudos: Kudos;
  className?: string;
}

export const KudoCard: React.FC<KudoCardProps> = ({ kudos, className }) => {
  const theme = KUDOS_THEMES[kudos.type] || DEFAULT_THEME;
  const KudosIcon = theme.icon;

  // Add styles to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = gradientStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'rounded-xl p-6 shadow-lg border backdrop-blur-sm',
        'transition-all duration-500',
        'group',
        theme.bgColor,
        theme.borderColor,
        'hover:shadow-xl',
        className
      )}
    >
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        theme.hoverBg,
        'animate-gradient bg-[length:400%_400%]'
      )} />
      <div className="relative z-10">
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
            {kudos.message}
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
      </div>
    </motion.div>
  );
}; 