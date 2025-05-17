import { v4 as uuidv4 } from 'uuid';

import type { StoredUser } from '../types/auth.types';
import { hashPassword } from '../utils/auth.utils';
import { authStore } from './auth.store';

export const TEST_USERS = {
  // Login test users
  VALID_USER: {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'StrongP@ss123',
  },
  UNVERIFIED_USER: {
    email: 'unverified@example.com',
    firstName: 'Unverified',
    lastName: 'User',
    password: 'StrongP@ss123',
  },
  LOCKED_USER: {
    email: 'locked@example.com',
    firstName: 'Locked',
    lastName: 'User',
    password: 'StrongP@ss123',
  },
  // Registration test users
  EXISTING_USER: {
    email: 'existing@example.com',
    firstName: 'Existing',
    lastName: 'User',
    password: 'StrongP@ss123',
  },
  // Test data for new registrations
  NEW_USER_TEMPLATE: {
    email: 'new.user@example.com',
    firstName: 'New',
    lastName: 'User',
    password: 'StrongP@ss123',
  },
};

export const seedAuthStore = async () => {
  // Check if store is already seeded by looking for the valid test user
  const existingUser = await authStore.getUserByEmail(TEST_USERS.VALID_USER.email);
  if (existingUser) {
    return; // Store is already seeded
  }

  // Reset store only if it's not seeded
  await authStore.reset();

  const hashedPassword = await hashPassword('StrongP@ss123');

  // Create all test users
  const users: StoredUser[] = [
    {
      id: uuidv4(),
      email: TEST_USERS.VALID_USER.email,
      firstName: TEST_USERS.VALID_USER.firstName,
      lastName: TEST_USERS.VALID_USER.lastName,
      password: hashedPassword,
      emailVerified: true,
      failedLoginAttempts: 0,
    },
    {
      id: uuidv4(),
      email: TEST_USERS.UNVERIFIED_USER.email,
      firstName: TEST_USERS.UNVERIFIED_USER.firstName,
      lastName: TEST_USERS.UNVERIFIED_USER.lastName,
      password: hashedPassword,
      emailVerified: false,
      failedLoginAttempts: 0,
    },
    {
      id: uuidv4(),
      email: TEST_USERS.LOCKED_USER.email,
      firstName: TEST_USERS.LOCKED_USER.firstName,
      lastName: TEST_USERS.LOCKED_USER.lastName,
      password: hashedPassword,
      emailVerified: true,
      failedLoginAttempts: 5,
      lastFailedLogin: new Date(),
      lockoutUntil: new Date(Date.now() + 15 * 60 * 1000), // locked for 15 minutes
    },
    {
      id: uuidv4(),
      email: TEST_USERS.EXISTING_USER.email,
      firstName: TEST_USERS.EXISTING_USER.firstName,
      lastName: TEST_USERS.EXISTING_USER.lastName,
      password: hashedPassword,
      emailVerified: true,
      failedLoginAttempts: 0,
    },
  ];

  // Create all test users
  await Promise.all(users.map((user) => authStore.createUser(user)));
};

// Call seed function when in development
if (process.env.NODE_ENV === 'development') {
  seedAuthStore().catch(console.error);
}
