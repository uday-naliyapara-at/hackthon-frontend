import React from 'react';
import { KudoCard } from '@/components/ui/KudoCard';
import { MOCK_KUDOS } from '@/infrastructure/api/mock/data/kudos.data';
import { Link } from 'react-router-dom';
import { HiChartPie } from 'react-icons/hi';

interface Kudo {
  id: string;
  title: string;
  recipient: {
    name: string;
    team: string;
    avatarUrl: string;
  };
  message: string;
  sender: {
    name: string;
    avatarUrl: string;
  };
  date: Date;
}

// Mock data - replace with actual data fetching logic
const mockKudos: Kudo[] = [
  {
    id: '1',
    title: 'Well Done',
    recipient: {
      name: 'Sarah Chen',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen'
    },
    message: 'Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!',
    sender: {
      name: 'Michael Thompson',
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Thompson'
    },
    date: new Date('2025-03-15')
  },
  {
    id: '1',
    title: 'Well Done',
    recipient: {
      name: 'Sarah Chen',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen'
    },
    message: 'Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!',
    sender: {
      name: 'Michael Thompson',
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Thompson'
    },
    date: new Date('2025-03-15')
  },
  {
    id: '1',
    title: 'Well Done',
    recipient: {
      name: 'Sarah Chen',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen'
    },
    message: 'Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!',
    sender: {
      name: 'Michael Thompson',
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Thompson'
    },
    date: new Date('2025-03-15')
  },
  {
    id: '1',
    title: 'Well Done',
    recipient: {
      name: 'Sarah Chen',
      team: 'Marketing Team',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen'
    },
    message: 'Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!',
    sender: {
      name: 'Michael Thompson',
      avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Thompson'
    },
    date: new Date('2025-03-15')
  }
  // Add more mock data as needed
];

export const HomePage: React.FC = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_KUDOS.map((kudos) => (
          <KudoCard
            key={kudos.id}
            kudos={kudos}
          />
        ))}
      </div>
    </div>
  );
}; 