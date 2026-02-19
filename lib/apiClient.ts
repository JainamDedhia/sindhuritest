// lib/apiClient.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public retryAfter?: number // seconds until retry is safe
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  showToast?: boolean;
  retries?: number;
}

/**
 * Enhanced fetch wrapper with error handling, retries, and toast notifications.
 * Handles 429 Rate Limit responses with Retry-After header support.
 */
export async function apiClient<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { showToast = true, retries = 0, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Parse Retry-After header for rate limit errors
        const retryAfter = response.headers.get("Retry-After")
          ? parseInt(response.headers.get("Retry-After")!, 10)
          : undefined;

        throw new ApiError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData.code,
          retryAfter
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) — including 429
      if (
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        break;
      }

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // Show toast for rate limit with a specific message
  if (showToast && typeof window !== "undefined") {
    import("@/app/store/uiStore").then(({ useUIStore }) => {
      const showToastFn = useUIStore.getState().showToast;

      if (lastError instanceof ApiError && lastError.status === 429) {
        const retryMsg = lastError.retryAfter
          ? ` Try again in ${lastError.retryAfter}s.`
          : "";
        showToastFn(`Too many requests.${retryMsg}`, "error");
      } else {
        showToastFn(lastError?.message || "Something went wrong", "error");
      }
    });
  }

  throw lastError;
}

// ============= CONVENIENCE METHODS =============

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
};