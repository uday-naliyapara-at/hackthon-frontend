import {
  HiArrowRightOnRectangle,
  HiBell,
  HiBookOpen,
  HiBuildingOffice2,
  HiChartPie,
  HiChatBubbleLeftRight,
  HiCog,
  HiCreditCard,
  HiDocument,
  HiFolderOpen,
  HiPaperAirplane,
  HiSparkles,
  HiUserCircle,
  HiUserPlus,
} from 'react-icons/hi2';

import { NavSectionItem } from '@/presentation/shared/molecules';

export const ORGANIZATION = {
  name: 'Efficia',
  type: 'Enterprise',
} as const;

export const PLATFORM_NAV_ITEMS: NavSectionItem[] = [
  { name: 'Chat', icon: HiChatBubbleLeftRight, 'data-testid': 'platform-chat', to: '/chat' },
  {
    name: 'User Management',
    icon: HiUserPlus,
    'data-testid': 'user-management',
    to: '/users',
    requiredRole: 'Admin',
  },
  {
    name: 'Platform Settings',
    icon: HiCog,
    'data-testid': 'platform-settings',
    requiredRole: 'Admin',
    subItems: [
      { name: 'Models', icon: HiCog, 'data-testid': 'models-settings', to: '/settings/models' },
    ],
  },
];

export const DEVELOPER_DOCS_NAV_ITEMS: NavSectionItem[] = [
  {
    name: 'Documentation Hub',
    icon: HiBookOpen,
    'data-testid': 'developer-docs-hub',
    to: '/docs',
  },
];

export const PROJECTS_NAV_ITEMS: NavSectionItem[] = [
  { name: 'All Projects', icon: HiFolderOpen, 'data-testid': 'projects-folder' },
  { name: 'Documentation', icon: HiDocument, 'data-testid': 'projects-filetext' },
  { name: 'Organizations', icon: HiBuildingOffice2, 'data-testid': 'projects-building2' },
  { name: 'Analytics', icon: HiChartPie, 'data-testid': 'projects-piechart' },
  { name: 'Deployments', icon: HiPaperAirplane, 'data-testid': 'projects-plane' },
  { name: 'Project Settings', icon: HiCog, 'data-testid': 'projects-settings' },
];

export const USER_NAV_ITEMS = [
  { name: 'Upgrade to Pro', icon: HiSparkles, 'data-testid': 'user-nav-upgrade' },
  { name: 'Account', icon: HiUserCircle, 'data-testid': 'user-nav-account' },
  { name: 'Billing', icon: HiCreditCard, 'data-testid': 'user-nav-billing' },
  { name: 'Notifications', icon: HiBell, 'data-testid': 'user-nav-notifications' },
  { name: 'Log out', icon: HiArrowRightOnRectangle, 'data-testid': 'user-nav-logout' },
] as const;

export const NAV_SECTIONS = {
  platform: {
    title: 'Platform',
    items: PLATFORM_NAV_ITEMS,
  },
  developerDocs: {
    title: 'Developer Docs',
    items: DEVELOPER_DOCS_NAV_ITEMS,
  },
} as const;
