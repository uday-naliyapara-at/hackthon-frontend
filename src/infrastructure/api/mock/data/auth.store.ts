/**
 * Authentication Store
 *
 * This class implements a localStorage-based data store for the authentication system.
 * It manages:
 * - User accounts and profiles
 * - Email verification tokens
 * - Password reset tokens
 * - User sessions
 * - Token revocation
 *
 * Note: This is a mock implementation for development and testing.
 * In production, this would be replaced with a real database.
 */
import { Session, StoredUser, VerificationToken } from '../types/auth.types';

const STORAGE_KEYS = {
  USERS: 'mock_auth_users',
  VERIFICATION_TOKENS: 'mock_auth_verification_tokens',
  SESSIONS: 'mock_auth_sessions',
  REVOKED_TOKENS: 'mock_auth_revoked_tokens',
} as const;

class AuthStore {
  /**
   * In-memory storage using Maps and Sets
   * - users: Stores user accounts indexed by ID
   * - verificationTokens: Stores email verification and password reset tokens
   * - sessions: Stores active user sessions indexed by refresh token
   * - revokedTokens: Tracks revoked access tokens
   */
  private users: Map<string, StoredUser>;
  private verificationTokens: Map<string, VerificationToken>;
  private sessions: Map<string, Session>;
  private revokedTokens: Set<string>;

  constructor() {
    // Initialize with data from localStorage if available
    this.users = new Map(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'));
    this.verificationTokens = new Map(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFICATION_TOKENS) || '[]')
    );

    // Fix session loading from localStorage
    const storedSessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    this.sessions = new Map();
    storedSessions.forEach(([token, session]: [string, Session]) => {
      // Convert date string back to Date object
      session.expiresAt = new Date(session.expiresAt);
      this.sessions.set(token, session);
    });

    this.revokedTokens = new Set(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.REVOKED_TOKENS) || '[]')
    );
  }

  private persistUsers() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(Array.from(this.users.entries())));
  }

  private persistVerificationTokens() {
    localStorage.setItem(
      STORAGE_KEYS.VERIFICATION_TOKENS,
      JSON.stringify(Array.from(this.verificationTokens.entries()))
    );
  }

  private persistSessions() {
    const sessions = Array.from(this.sessions.entries());
    console.log('Persisting sessions:', sessions);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  private persistRevokedTokens() {
    localStorage.setItem(
      STORAGE_KEYS.REVOKED_TOKENS,
      JSON.stringify(Array.from(this.revokedTokens))
    );
  }

  // ==================== User Operations ====================
  /**
   * Creates a new user account
   * @param user The user data to store
   * @returns The stored user object
   */
  async createUser(user: StoredUser): Promise<StoredUser> {
    this.users.set(user.id, user);
    this.persistUsers();
    return user;
  }

  /**
   * Retrieves a user by their ID
   * @param id The user's unique identifier
   * @returns The user object if found, undefined otherwise
   */
  async getUserById(id: string): Promise<StoredUser | undefined> {
    return this.users.get(id);
  }

  /**
   * Retrieves a user by their email address
   * @param email The user's email address
   * @returns The user object if found, undefined otherwise
   */
  async getUserByEmail(email: string): Promise<StoredUser | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  /**
   * Updates a user's information
   * @param id The user's unique identifier
   * @param updates Partial user object with fields to update
   * @returns The updated user object if found, undefined otherwise
   */
  async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | undefined> {
    const user = await this.getUserById(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    this.persistUsers();
    return updatedUser;
  }

  // ==================== Verification Token Operations ====================
  /**
   * Creates a new verification token (email verification or password reset)
   * @param token The token data to store
   * @returns The stored token object
   */
  async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
    this.verificationTokens.set(token.token, token);
    this.persistVerificationTokens();
    return token;
  }

  /**
   * Retrieves a verification token
   * @param token The token string
   * @returns The token object if found, undefined otherwise
   */
  async getVerificationToken(token: string): Promise<VerificationToken | undefined> {
    return this.verificationTokens.get(token);
  }

  /**
   * Deletes a verification token after use
   * @param token The token string to delete
   */
  async deleteVerificationToken(token: string): Promise<void> {
    this.verificationTokens.delete(token);
    this.persistVerificationTokens();
  }

  // ==================== Session Operations ====================
  /**
   * Creates a new user session
   * @param session The session data to store
   * @returns The stored session object
   */
  async createSession(session: Session): Promise<Session> {
    console.log('Creating session:', session);

    // Clean up ALL old sessions for this user
    const oldSessions = Array.from(this.sessions.entries()).filter(
      ([_, s]) => s.userId === session.userId
    );

    console.log('Found old sessions for user:', oldSessions.length);

    if (oldSessions.length > 0) {
      console.log('Cleaning up old sessions');
      // Delete old sessions
      oldSessions.forEach(([token, _]) => {
        console.log('Deleting old session with token:', token);
        this.sessions.delete(token);
      });

      // Also clean up MSW cookie store
      try {
        const mswCookieStore = localStorage.getItem('__msw-cookie-store__');
        if (mswCookieStore) {
          const cookieStore = JSON.parse(mswCookieStore);
          if (Array.isArray(cookieStore)) {
            const newCookieStore = cookieStore.filter(
              (cookie) => cookie.key !== 'token' || cookie.value === session.refreshToken
            );
            localStorage.setItem('__msw-cookie-store__', JSON.stringify(newCookieStore));
          }
        }
      } catch (error) {
        console.log('Error cleaning MSW cookie store:', error);
      }
    }

    // Create new session
    this.sessions.set(session.refreshToken, session);
    this.persistSessions();

    console.log('Current sessions after cleanup:', Array.from(this.sessions.entries()));
    return session;
  }

  /**
   * Retrieves a session by refresh token
   * @param refreshToken The refresh token string
   * @returns The session object if found, undefined otherwise
   */
  async getSessionByRefreshToken(refreshToken: string): Promise<Session | undefined> {
    console.log('Getting session for refresh token:', refreshToken);
    console.log('Available sessions:', Array.from(this.sessions.entries()));
    const session = this.sessions.get(refreshToken);
    console.log('Found session:', session);
    return session;
  }

  /**
   * Deletes a session (used during logout)
   * @param refreshToken The refresh token of the session to delete
   */
  async deleteSession(refreshToken: string): Promise<void> {
    console.log('Deleting session for refresh token:', refreshToken);
    this.sessions.delete(refreshToken);
    this.persistSessions();
  }

  /**
   * Deletes all sessions for a specific user
   * Used when changing password or during account compromise
   * @param userId The user's unique identifier
   */
  async deleteUserSessions(userId: string): Promise<void> {
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }
    this.persistSessions();
  }

  /**
   * Retrieves all active sessions
   * @returns Map of all sessions
   */
  async getAllSessions(): Promise<Map<string, Session>> {
    return this.sessions;
  }

  // ==================== Token Operations ====================
  /**
   * Marks an access token as revoked
   * @param token The access token to revoke
   */
  async revokeToken(token: string): Promise<void> {
    this.revokedTokens.add(token);
    this.persistRevokedTokens();
  }

  /**
   * Checks if an access token has been revoked
   * @param token The access token to check
   * @returns True if the token is revoked, false otherwise
   */
  async isTokenRevoked(token: string): Promise<boolean> {
    return this.revokedTokens.has(token);
  }

  // ==================== Maintenance Operations ====================
  /**
   * Cleans up expired tokens and sessions
   * Should be run periodically in a real implementation
   */
  async cleanup(): Promise<void> {
    const now = new Date();

    // Clean expired verification tokens
    for (const [token, vt] of this.verificationTokens.entries()) {
      if (vt.expiresAt < now) {
        this.verificationTokens.delete(token);
      }
    }
    this.persistVerificationTokens();

    // Clean expired sessions
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token);
      }
    }
    this.persistSessions();
  }

  /**
   * Resets all data stores
   * Used primarily for testing purposes
   */
  async reset(): Promise<void> {
    this.users.clear();
    this.verificationTokens.clear();
    this.sessions.clear();
    this.revokedTokens.clear();

    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATION_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.REVOKED_TOKENS);
  }
}

// Singleton instance for consistent state across imports
export const authStore = new AuthStore();
