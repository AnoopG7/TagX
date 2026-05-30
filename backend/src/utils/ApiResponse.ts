/**
 * Standardized API response wrapper.
 * All successful responses go through this.
 */
export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, data: T, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  // ---- Factory methods ----

  static ok<T>(data: T, message = "Success") {
    return new ApiResponse(200, data, message);
  }

  static created<T>(data: T, message = "Created successfully") {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = "Deleted successfully") {
    return new ApiResponse(204, null, message);
  }
}
