import { ChatThread } from './types';

/**
 * Entity representing a chat thread in the system
 * Implements domain validation and business rules for chat threads
 */
export class ChatThreadEntity implements ChatThread {
  constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _modelId: string,
    private readonly _userId: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validateState();
  }

  // Getters for immutable properties
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get modelId(): string {
    return this._modelId;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Factory method to create a new ChatThreadEntity
   * @throws Error if required fields are missing or invalid
   */
  static create(params: {
    id: string;
    title: string;
    modelId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): ChatThreadEntity {
    return new ChatThreadEntity(
      params.id,
      params.title,
      params.modelId,
      params.userId,
      params.createdAt,
      params.updatedAt
    );
  }

  /**
   * Validates the title according to business rules
   * @throws Error if title is invalid
   */
  static validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Thread title cannot be empty');
    }
    if (title.length > 100) {
      throw new Error('Thread title exceeds maximum length of 100 characters');
    }
  }

  /**
   * Validates the state of the chat thread
   * @throws Error if validation fails
   */
  private validateState(): void {
    if (!this._id) {
      throw new Error('Thread ID is required');
    }

    // Use shared title validation
    ChatThreadEntity.validateTitle(this._title);

    if (!this._modelId) {
      throw new Error('Model ID is required');
    }
    if (!this._userId) {
      throw new Error('User ID is required');
    }
    if (!this._createdAt) {
      throw new Error('Created timestamp is required');
    }
    if (!this._updatedAt) {
      throw new Error('Updated timestamp is required');
    }
  }

  /**
   * Returns a plain object representation of the chat thread
   */
  toJSON(): ChatThread {
    return {
      id: this._id,
      title: this._title,
      modelId: this._modelId,
      userId: this._userId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Creates a new ChatThreadEntity with an updated title
   * @param newTitle The new title for the thread
   * @returns A new ChatThreadEntity with the updated title and current timestamp
   */
  withUpdatedTitle(newTitle: string): ChatThreadEntity {
    // Validate the new title
    ChatThreadEntity.validateTitle(newTitle);

    // Create a new entity with the updated title and current timestamp
    return new ChatThreadEntity(
      this._id,
      newTitle,
      this._modelId,
      this._userId,
      this._createdAt,
      new Date() // Update the updatedAt timestamp
    );
  }

  /**
   * Creates a new ChatThreadEntity with an updated model
   * @param newModelId The new model ID for the thread
   * @returns A new ChatThreadEntity with the updated model ID and current timestamp
   * @throws Error if model ID is empty
   */
  withUpdatedModel(newModelId: string): ChatThreadEntity {
    // Validate model ID
    if (!newModelId) {
      throw new Error('Model ID is required');
    }

    // Create a new entity with the updated model ID and current timestamp
    return new ChatThreadEntity(
      this._id,
      this._title,
      newModelId,
      this._userId,
      this._createdAt,
      new Date() // Update the updatedAt timestamp
    );
  }
}
