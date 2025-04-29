export class NoProjectsFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ProjectCreationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
