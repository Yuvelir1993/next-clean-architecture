export class ProjectCreationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
      super(message, options);
    }
  }