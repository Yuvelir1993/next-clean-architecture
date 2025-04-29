export class ProjectCreationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
      super(message, options);
    }
  }

export class NoProjectsFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
export class AuthenticationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ProjectError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

