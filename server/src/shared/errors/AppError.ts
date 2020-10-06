export default class AppError {
  public readonly message: string;
  public readonly statusCode: number; // ex: 404

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};