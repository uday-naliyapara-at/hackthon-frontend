/**
 * Tests for User domain value objects (Email, Password, Name).
 * Verifies validation rules, immutability, and business rules for each value object.
 * Ensures proper encapsulation and type safety for user data.
 */
import { Email, Name, Password } from '../User';

describe('Domain > Models > User > Value Objects', () => {
  /**
   * Tests Email value object
   * Validates email format rules and ensures immutability
   */
  describe('Email', () => {
    // Test data for email validation scenarios
    const VALID_EMAILS = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.com',
      'first.last@subdomain.example.com',
    ];

    const INVALID_EMAILS = [
      '',
      'invalid-email',
      '@missing-local.com',
      'missing-at.com',
      'missing-domain@',
      'spaces in@email.com',
      'unicode@☃️.com',
    ];

    describe('validation', () => {
      it.each(VALID_EMAILS)('should validate correct email: %s', (email) => {
        const emailVO = new Email(email);
        expect(emailVO.isValid()).toBe(true);
      });

      it.each(INVALID_EMAILS)('should invalidate incorrect email: %s', (email) => {
        const emailVO = new Email(email);
        expect(emailVO.isValid()).toBe(false);
      });
    });

    describe('immutability', () => {
      it('should not allow value modification', () => {
        const email = new Email('test@example.com');
        expect(() => {
          (email as any).value = 'new@example.com';
        }).toThrow(TypeError);
      });

      it('should preserve original value', () => {
        const emailStr = 'test@example.com';
        const email = new Email(emailStr);
        expect(email.value).toBe(emailStr);
      });
    });
  });

  /**
   * Tests Password value object
   * Validates password complexity rules and security requirements
   */
  describe('Password', () => {
    // Test data for password validation scenarios
    const VALID_PASSWORDS = ['StrongP@ss123', 'C0mpl3x!Pass', 'Sup3r$3cur3', 'MyP@ssw0rd!'];

    const INVALID_PASSWORDS = [
      '', // empty
      'short', // too short
      'onlylowercase123!', // no uppercase
      'ONLYUPPERCASE123!', // no lowercase
      'NoNumbers!', // no numbers
      'NoSpecials123', // no special chars
      'Almost@Done', // no numbers
    ];

    describe('validation', () => {
      it.each(VALID_PASSWORDS)('should validate correct password: %s', (password) => {
        const passwordVO = new Password(password);
        expect(passwordVO.isValid()).toBe(true);
      });

      it.each(INVALID_PASSWORDS)('should invalidate incorrect password: %s', (password) => {
        const passwordVO = new Password(password);
        expect(passwordVO.isValid()).toBe(false);
      });
    });

    describe('complexity requirements', () => {
      it('should require minimum length of 8', () => {
        const password = new Password('Sh0rt@');
        expect(password.isValid()).toBe(false);
      });

      it('should require at least one uppercase letter', () => {
        const password = new Password('lowercase123!');
        expect(password.isValid()).toBe(false);
      });

      it('should require at least one lowercase letter', () => {
        const password = new Password('UPPERCASE123!');
        expect(password.isValid()).toBe(false);
      });

      it('should require at least one number', () => {
        const password = new Password('NoNumbers!');
        expect(password.isValid()).toBe(false);
      });

      it('should require at least one special character', () => {
        const password = new Password('NoSpecials123');
        expect(password.isValid()).toBe(false);
      });
    });

    describe('immutability', () => {
      it('should not allow value modification', () => {
        const password = new Password('StrongP@ss123');
        expect(() => {
          (password as any).value = 'NewP@ss123';
        }).toThrow(TypeError);
      });
    });
  });

  /**
   * Tests Name value object
   * Validates name format rules and character restrictions
   */
  describe('Name', () => {
    // Test data for name validation scenarios
    const VALID_NAMES = ['John', 'Mary Jane', "O'Connor", 'Smith-Jones', 'José'];

    const INVALID_NAMES = [
      '', // empty
      '123John', // numbers
      'John@Doe', // special chars
      ' ', // only space
    ];

    describe('validation', () => {
      it.each(VALID_NAMES)('should validate correct name: %s', (name) => {
        const nameVO = new Name(name);
        expect(nameVO.isValid()).toBe(true);
      });

      it.each(INVALID_NAMES)('should invalidate incorrect name: %s', (name) => {
        const nameVO = new Name(name);
        expect(nameVO.isValid()).toBe(false);
      });
    });

    describe('immutability', () => {
      it('should not allow value modification', () => {
        const name = new Name('John');
        expect(() => {
          (name as any).value = 'Jane';
        }).toThrow(TypeError);
      });

      it('should preserve original value', () => {
        const nameStr = 'John';
        const name = new Name(nameStr);
        expect(name.value).toBe(nameStr);
      });
    });
  });
});
