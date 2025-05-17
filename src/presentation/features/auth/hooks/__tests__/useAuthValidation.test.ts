import { forgotPasswordSchema, loginSchema, signupSchema } from '../useAuthValidation';

/**
 * Test suite for authentication validation schemas
 * Tests validation rules for signup, login, and forgot password forms
 */
describe('Auth Validation Schemas', () => {
  // #region Signup Schema Tests
  describe('signupSchema', () => {
    it('should validate valid signup data with all required fields', () => {
      // Arrange
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
      };

      // Act
      const result = signupSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('should fail validation with empty required fields', () => {
      // Arrange
      const emptyData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };

      // Act
      const result = signupSchema.safeParse(emptyData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.firstName?._errors).toContain('First name is required');
        expect(formattedErrors.lastName?._errors).toContain('Last name is required');
        expect(formattedErrors.email?._errors).toContain('Email is required');
        expect(formattedErrors.password?._errors).toContain(
          'Password must be at least 8 characters'
        );
        expect(formattedErrors.confirmPassword?._errors).toContain('Please confirm your password');
      }
    });

    it('should fail validation with invalid email format', () => {
      // Arrange
      const invalidEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
      };

      // Act
      const result = signupSchema.safeParse(invalidEmailData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.email?._errors).toContain('Invalid email format');
      }
    });

    it('should fail validation when passwords do not match', () => {
      // Arrange
      const mismatchedPasswords = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test123!@#',
        confirmPassword: 'DifferentPass123!@#',
      };

      // Act
      const result = signupSchema.safeParse(mismatchedPasswords);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.confirmPassword?._errors).toContain("Passwords don't match");
      }
    });

    it('should fail validation with weak password', () => {
      // Arrange
      const weakPasswordData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      };

      // Act
      const result = signupSchema.safeParse(weakPasswordData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.password?._errors).toContain(
          'Password must be at least 8 characters'
        );
      }
    });
  });
  // #endregion

  // #region Login Schema Tests
  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      // Arrange
      const validData = {
        email: 'john.doe@example.com',
        password: 'Test123!@#',
      };

      // Act
      const result = loginSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('should fail validation with empty credentials', () => {
      // Arrange
      const emptyData = {
        email: '',
        password: '',
      };

      // Act
      const result = loginSchema.safeParse(emptyData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.email?._errors).toContain('Email is required');
        expect(formattedErrors.password?._errors).toContain(
          'Password must be at least 8 characters'
        );
      }
    });

    it('should fail validation with invalid email format', () => {
      // Arrange
      const invalidEmailData = {
        email: 'invalid-email',
        password: 'Test123!@#',
      };

      // Act
      const result = loginSchema.safeParse(invalidEmailData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.email?._errors).toContain('Invalid email format');
      }
    });
  });
  // #endregion

  // #region Forgot Password Schema Tests
  describe('forgotPasswordSchema', () => {
    it('should validate valid email for password reset', () => {
      // Arrange
      const validData = {
        email: 'john.doe@example.com',
      };

      // Act
      const result = forgotPasswordSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('should fail validation with empty email', () => {
      // Arrange
      const emptyData = {
        email: '',
      };

      // Act
      const result = forgotPasswordSchema.safeParse(emptyData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.email?._errors).toContain('Email is required');
      }
    });

    it('should fail validation with invalid email format', () => {
      // Arrange
      const invalidEmailData = {
        email: 'invalid-email',
      };

      // Act
      const result = forgotPasswordSchema.safeParse(invalidEmailData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.email?._errors).toContain('Invalid email format');
      }
    });
  });
  // #endregion
});
