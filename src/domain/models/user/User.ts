import { EmailVO, NameVO, PasswordVO, User } from './types';

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

export class UserEntity implements User {
  constructor(
    private readonly _id: string,
    private readonly _email: Email,
    private readonly _firstName: Name,
    private readonly _lastName: Name,
    private readonly _emailVerified: boolean = false,
    private readonly _role?: 'Admin' | 'User',
    private readonly _status: 'Pending' | 'Active' | 'Deactive' = 'Pending',
    private readonly _statusChangedBy?: string,
    private readonly _statusChangedAt?: string,
    private readonly _registrationDate?: string,
    private readonly _createdAt?: string,
    private readonly _avatarUrl?: string
  ) {
    this.validateState();
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email.value;
  }

  get firstName(): string {
    return this._firstName.value;
  }

  get lastName(): string {
    return this._lastName.value;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  get role(): 'Admin' | 'User' | undefined {
    return this._role;
  }

  get status(): 'Pending' | 'Active' | 'Deactive' {
    return this._status;
  }

  get statusChangedBy(): string | undefined {
    return this._statusChangedBy;
  }

  get statusChangedAt(): string | undefined {
    return this._statusChangedAt;
  }

  get registrationDate(): string | undefined {
    return this._registrationDate;
  }

  get createdAt(): string | undefined {
    return this._createdAt;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  private validateState(): void {
    if (!this._email.isValid()) {
      throw new Error('Invalid email');
    }
    if (!this._firstName.isValid()) {
      throw new Error('Invalid first name');
    }
    if (!this._lastName.isValid()) {
      throw new Error('Invalid last name');
    }
  }

  static create(params: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified?: boolean;
    role?: 'Admin' | 'User';
    status?: 'Pending' | 'Active' | 'Deactive';
    statusChangedBy?: string;
    statusChangedAt?: string;
    registrationDate?: string;
    createdAt?: string;
    avatarUrl?: string;
  }): UserEntity {
    return new UserEntity(
      params.id,
      new Email(params.email),
      new Name(params.firstName),
      new Name(params.lastName),
      params.emailVerified,
      params.role,
      params.status ?? 'Pending',
      params.statusChangedBy,
      params.statusChangedAt,
      params.registrationDate,
      params.createdAt,
      params.avatarUrl
    );
  }
}
