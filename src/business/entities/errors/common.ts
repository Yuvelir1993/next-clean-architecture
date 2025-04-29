export class InputParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ProjectError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
