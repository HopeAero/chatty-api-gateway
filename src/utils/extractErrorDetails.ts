export function extractErrorDetails(error: any): {
  status: number;
  message: string;
} {
  const status =
    error.status ||
    error.error?.response?.statusCode ||
    error.error?.status ||
    500;
  const message =
    error.message ||
    error.error?.response?.message ||
    error.error?.message ||
    "An unexpected error occurred";
  return { status, message };
}
