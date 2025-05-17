import { Kudos, KudosTheme, KudosType } from '@/domain/models/kudos/types';

/**
 * Theme configuration for each kudos type
 */
export const KUDOS_THEMES: Record<KudosType, KudosTheme> = {
  'Well Done': {
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    textColor: 'text-purple-700'
  },
  'Great Teamwork': {
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-700'
  },
  'Proud of You': {
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    textColor: 'text-green-700'
  },
  'Outstanding Achievement': {
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    textColor: 'text-red-700'
  },
  'Brilliant Idea': {
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-700'
  },
  'Amazing Support': {
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-500',
    textColor: 'text-teal-700'
  }
};

/**
 * Mock kudos data
 */
export const MOCK_KUDOS: Kudos[] = [
  {
    id: '1',
    type: 'Well Done',
    recipient: {
      id: 1,
      name: 'Sarah Chen',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen'
    },
    message: 'Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!',
    sender: {
      id: 2,
      name: 'Michael Thompson',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Thompson'
    },
    createdAt: new Date('2025-03-15')
  },
  {
    id: '2',
    type: 'Great Teamwork',
    recipient: {
      id: 3,
      name: 'David Kumar',
      team: 'Engineering Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=David+Kumar'
    },
    message: 'Incredible job debugging the production issue! Your quick thinking and problem-solving skills saved us hours of downtime. You\'re a true asset to the team!',
    sender: {
      id: 4,
      name: 'Emily Rodriguez',
      team: 'Engineering Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Emily+Rodriguez'
    },
    createdAt: new Date('2025-03-14')
  },
  {
    id: '3',
    type: 'Proud of You',
    recipient: {
      id: 5,
      name: 'Lisa Park',
      team: 'Sales Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Lisa+Park'
    },
    message: 'Phenomenal work closing the enterprise deal! Your persistence and relationship-building skills are truly impressive. Congratulations on this huge win!',
    sender: {
      id: 6,
      name: 'James Wilson',
      team: 'Sales Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=James+Wilson'
    },
    createdAt: new Date('2025-03-13')
  },
  {
    id: '4',
    type: 'Outstanding Achievement',
    recipient: {
      id: 7,
      name: 'Rachel Green',
      team: 'Product Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Rachel+Green'
    },
    message: 'Your leadership in the product launch was exceptional! The way you handled the challenges and kept the team motivated was truly inspiring.',
    sender: {
      id: 8,
      name: 'Alex Martinez',
      team: 'Product Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Martinez'
    },
    createdAt: new Date('2025-03-12')
  },
  {
    id: '5',
    type: 'Brilliant Idea',
    recipient: {
      id: 9,
      name: 'Tom Anderson',
      team: 'Innovation Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Tom+Anderson'
    },
    message: 'Your innovative solution to our customer onboarding process is game-changing! This will significantly improve our user experience.',
    sender: {
      id: 10,
      name: 'Chris Wong',
      team: 'Innovation Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Chris+Wong'
    },
    createdAt: new Date('2025-03-11')
  },
  {
    id: '6',
    type: 'Amazing Support',
    recipient: {
      id: 11,
      name: 'Kevin Smith',
      team: 'Support Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Kevin+Smith'
    },
    message: 'Thank you for going above and beyond in helping our enterprise clients. Your dedication to customer success is truly remarkable!',
    sender: {
      id: 12,
      name: 'Sarah Johnson',
      team: 'Support Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson'
    },
    createdAt: new Date('2025-03-10')
  }
]; 