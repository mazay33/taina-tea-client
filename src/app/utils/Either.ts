export class Left<T> {
  readonly error: T;

  private constructor(error: T) {
    this.error = error;
  }

  isError(): this is Left<T> {
    return true;
  }

  isRight(): this is Right<never> {
    return false;
  }

  static create<U>(error: U): Left<U> {
    return new Left(error);
  }
}

export class Right<T> {
  readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  isError(): this is Left<never> {
    return false;
  }

  isRight(): this is Right<T> {
    return true;
  }

  static create<U>(value: U): Right<U> {
    return new Right(value);
  }
}

export type Either<T, U> = Left<T> | Right<U>;
