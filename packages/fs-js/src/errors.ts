export class InvalidStateError extends Error {
  constructor() {
    super("seeking position failed.");
    this.name = "InvalidStateError";
  }
}

export class NotFoundError extends Error {
  constructor() {
    super(
      "A requested file or directory could not be found at the time an operation was processed."
    );
    this.name = "NotFoundError";
  }
}

export class TypeMismatchError extends Error {
  constructor() {
    super("The path supplied exists, but was not an entry of requested type.");
    this.name = "TypeMismatchError";
  }
}

export class InvalidModificationError extends Error {
  constructor() {
    super("The object can not be modified in this way.");
    this.name = "InvalidModificationError";
  }
}

export class SyntaxError extends Error {
  constructor(m: string) {
    super(
      `Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${m}`
    );
    this.name = "SyntaxError";
  }
}

export class SecurityError extends Error {
  constructor() {
    super(
      "It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources."
    );
    this.name = "SecurityError";
  }
}

export class NotAllowedError extends Error {
  constructor() {
    super(
      "The request is not allowed by the user agent or the platform in the current context."
    );
    this.name = "NotAllowedError";
  }
}
