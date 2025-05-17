import { IconType } from 'react-icons';
import { BsApple, BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@/lib/utils';

import { Icon } from '../Icon';

export type SocialProvider = 'apple' | 'google' | 'meta';

const PROVIDER_ICONS: Record<SocialProvider, IconType> = {
  apple: BsApple,
  google: FcGoogle,
  meta: BsFacebook,
};

export interface SocialIconProps {
  provider: SocialProvider;
  className?: string;
  size?: string | number;
  'data-testid'?: string;
}

export const SocialIcon = ({
  provider,
  className,
  size = 20,
  'data-testid': dataTestId,
  ...props
}: SocialIconProps) => {
  const IconComponent = PROVIDER_ICONS[provider];
  return (
    <Icon
      icon={IconComponent}
      className={cn('h-5 w-5', className)}
      style={{ fontSize: size }}
      data-testid={dataTestId}
      role="presentation"
      aria-hidden="true"
      {...props}
    />
  );
};
