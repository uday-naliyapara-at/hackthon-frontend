/**
 * Base error class for user management errors
 */
export class UserManagementError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'UserManagementError';
  }
}

/**
 * Thrown when a user is not found
 */
export class UserNotFoundError extends UserManagementError {
  constructor(message: string = 'User not found') {
    super(message, 'USER_MGMT_001');
    this.name = 'UserNotFoundError';
  }
}

/**
 * Thrown when attempting to change user status with invalid status
 */
export class InvalidUserStatusError extends UserManagementError {
  constructor(
    userId: string,
    currentStatus: string,
    requiredStatus: string,
    message: string = `User ${userId} has status ${currentStatus}, but ${requiredStatus} is required`
  ) {
    super(message, 'USER_MGMT_002');
    this.name = 'InvalidUserStatusError';
  }
}

/**
 * Thrown when user activation fails
 */
export class UserActivationError extends UserManagementError {
  constructor(userId: string, message: string = `Failed to activate user ${userId}`) {
    super(message, 'USER_MGMT_003');
    this.name = 'UserActivationError';
  }
}

/**
 * Thrown when user deactivation fails
 */
export class UserDeactivationError extends UserManagementError {
  constructor(userId: string, message: string = `Failed to deactivate user ${userId}`) {
    super(message, 'USER_MGMT_004');
    this.name = 'UserDeactivationError';
  }
}

/**
 * Thrown when admin privileges are required but not present
 */
export class AdminPrivilegeError extends UserManagementError {
  constructor(message: string = 'Admin privileges required for this operation') {
    super(message, 'USER_MGMT_005');
    this.name = 'AdminPrivilegeError';
  }
} 