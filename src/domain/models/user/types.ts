/**
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's full name */
  fullName: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: UserRole;
  /** User's team ID */
  teamId: number | null;
  /** Whether the user's email is verified */
  emailVerified?: boolean;
  /** URL to the user's avatar image */
  avatarUrl?: string;
  /** User's status in the system */
  status?: "Pending" | "Active" | "Deactive";
  /** Date when user registered (for pending users) */
  registrationDate?: string;
  /** ID or name of the admin who changed the status */
  statusChangedBy?: string;
  /** Date when the status was last changed */
  statusChangedAt?: string;
  /** Date when the user was created in the system */
  createdAt?: string;
}

export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

// Value Objects - for validation and business rules
export interface EmailVO {
  value: string;
  isValid(): boolean;
}

export interface PasswordVO {
  value: string;
  isValid(): boolean;
  meetsComplexityRequirements(): boolean;
}

export interface NameVO {
  value: string;
  isValid(): boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Data transfer object for forgot password request
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * Data transfer object for password reset request
 */
export interface ResetPasswordDTO {
  token: string;
  password: string;
}

// User role and status types
export const USER_ROLES = ["ADMIN", "TEAM_MEMBER", "TECH_LEAD"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["Pending", "Active", "Deactive"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];
