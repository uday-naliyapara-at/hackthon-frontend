export interface Category {
  id: number;
  name: string;
  description: string;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Teamwork',
    description: 'Recognition for outstanding collaboration and team spirit',
  },
  {
    id: 2,
    name: 'Innovation',
    description: 'Acknowledgment for creative solutions and innovative thinking',
  },
  {
    id: 3,
    name: 'Helping Hand',
    description: 'Recognition for going above and beyond to help others',
  },
  {
    id: 4,
    name: 'Leadership',
    description: 'Acknowledgment for exemplary leadership and guidance',
  },
  {
    id: 5,
    name: 'Problem Solving',
    description: 'Recognition for effectively resolving complex challenges',
  },
  {
    id: 6,
    name: 'Customer Focus',
    description: 'Acknowledgment for exceptional customer service',
  },
  {
    id: 7,
    name: 'Quality',
    description: 'Recognition for maintaining high standards of excellence',
  },
]; 