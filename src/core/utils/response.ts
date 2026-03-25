export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}

export const createResponse = <T>(
  code: number = 200,
  message: string = 'Success',
  data: T | null = null,
  path: string = '',
): ApiResponse<T> => ({
  code,
  message,
  data,
  timestamp: new Date().toISOString(),
  path,
});

export const successResponse = <T>(
  data: T,
  message: string = 'Success',
  path: string = '',
): ApiResponse<T> => createResponse(200, message, data, path);

export const createdResponse = <T>(
  data: T,
  message: string = 'Created successfully',
  path: string = '',
): ApiResponse<T> => createResponse(201, message, data, path);

export const noContentResponse = (path: string = ''): ApiResponse<null> =>
  createResponse(204, 'No content', null, path);
