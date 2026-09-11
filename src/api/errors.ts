export class NotFoundError extends Error {
  constructor(message:string){
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message:string){
    super(message);
  }
}

export class AuthenticationError extends Error {
  constructor(message:string){
    super(message);
  }
}

export class AuthorizationError extends Error {
  constructor(message:string){
    super(message);
  }
}
