/**
 * Tests for UserEntity which represents the core user domain model.
 * Verifies entity creation, validation rules, immutability, and property access.
 * Ensures domain invariants are maintained for user data.
 */
import { Email, Name, UserEntity } from '../User';

describe('Domain > Models > User > UserEntity', () => {
  // Test data factory for common test scenarios
  const validUserParams = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    emailVerified: false,
  };

  /**
   * Tests entity creation through factory method and constructor
   * Verifies proper initialization and default values
   */
  describe('creation', () => {
    it('should create valid user with factory method', () => {
      const user = UserEntity.create(validUserParams);

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toBe(validUserParams.id);
      expect(user.email).toBe(validUserParams.email);
      expect(user.firstName).toBe(validUserParams.firstName);
      expect(user.lastName).toBe(validUserParams.lastName);
      expect(user.emailVerified).toBe(validUserParams.emailVerified);
    });

    it('should create valid user with constructor', () => {
      const user = new UserEntity(
        validUserParams.id,
        new Email(validUserParams.email),
        new Name(validUserParams.firstName),
        new Name(validUserParams.lastName),
        validUserParams.emailVerified
      );

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toBe(validUserParams.id);
      expect(user.email).toBe(validUserParams.email);
      expect(user.firstName).toBe(validUserParams.firstName);
      expect(user.lastName).toBe(validUserParams.lastName);
      expect(user.emailVerified).toBe(validUserParams.emailVerified);
    });

    it('should default emailVerified to false', () => {
      const { ...params } = validUserParams;
      const user = UserEntity.create(params);
      expect(user.emailVerified).toBe(false);
    });
  });

  /**
   * Tests validation rules for all entity properties
   * Ensures business rules are enforced during creation
   */
  describe('validation', () => {
    it('should throw on invalid email', () => {
      expect(() =>
        UserEntity.create({
          ...validUserParams,
          email: 'invalid-email',
        })
      ).toThrow('Invalid email');
    });

    it('should throw on invalid first name', () => {
      expect(() =>
        UserEntity.create({
          ...validUserParams,
          firstName: '',
        })
      ).toThrow('Invalid first name');
    });

    it('should throw on invalid last name', () => {
      expect(() =>
        UserEntity.create({
          ...validUserParams,
          lastName: '',
        })
      ).toThrow('Invalid last name');
    });

    it('should throw on invalid first name with numbers', () => {
      expect(() =>
        UserEntity.create({
          ...validUserParams,
          firstName: 'John123',
        })
      ).toThrow('Invalid first name');
    });

    it('should throw on invalid last name with special characters', () => {
      expect(() =>
        UserEntity.create({
          ...validUserParams,
          lastName: 'Doe@123',
        })
      ).toThrow('Invalid last name');
    });
  });

  /**
   * Tests entity immutability guarantees
   * Ensures properties cannot be modified after creation
   */
  describe('immutability', () => {
    it('should have read-only properties', () => {
      const user = UserEntity.create(validUserParams);

      expect(() => {
        (user as any).email = 'new@example.com';
      }).toThrow(TypeError);

      expect(() => {
        (user as any).firstName = 'Jane';
      }).toThrow(TypeError);

      expect(() => {
        (user as any).lastName = 'Smith';
      }).toThrow(TypeError);
    });

    it('should allow emailVerified to be read but not written', () => {
      const user = UserEntity.create(validUserParams);
      expect(() => {
        (user as any).emailVerified = true;
      }).toThrow(TypeError);
    });
  });

  /**
   * Tests property access and getter functionality
   * Verifies proper encapsulation and value exposure
   */
  describe('property access', () => {
    it('should expose getters for all properties', () => {
      const user = UserEntity.create(validUserParams);

      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(user.emailVerified).toBeDefined();
    });

    it('should return correct values from getters', () => {
      const user = UserEntity.create(validUserParams);

      expect(user.id).toBe(validUserParams.id);
      expect(user.email).toBe(validUserParams.email);
      expect(user.firstName).toBe(validUserParams.firstName);
      expect(user.lastName).toBe(validUserParams.lastName);
      expect(user.emailVerified).toBe(validUserParams.emailVerified);
    });
  });
});
