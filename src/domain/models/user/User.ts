import { EmailVO, NameVO, PasswordVO, User, UserRole } from './types';

export class Email implements EmailVO {
  constructor(private readonly email: string) {}

  get value(): string {
    return this.email;
  }

  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }
}

export class Password implements PasswordVO {
  constructor(private readonly password: string) {}

  get value(): string {
    return this.password;
  }

  isValid(): boolean {
    return this.password.length >= 8 && this.meetsComplexityRequirements();
  }

  meetsComplexityRequirements(): boolean {
    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasLowerCase = /[a-z]/.test(this.password);
    const hasNumbers = /\d/.test(this.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>[\];~`+=\-_]/.test(this.password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }
}

export class Name implements NameVO {
  constructor(private readonly name: string) {}

  get value(): string {
    return this.name;
  }

  isValid(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      return false;
    }
    return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(this.name);
  }
}

export class UserEntity {
  private constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly role: UserRole,
    public readonly teamId: number | null,
    public readonly emailVerified: boolean = true
  ) {}

  static create(data: User): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.firstName,
      data.lastName,
      data.fullName,
      data.role,
      data.teamId,
      data.emailVerified ?? true
    );
  }
}
