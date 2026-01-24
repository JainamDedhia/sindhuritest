// lib/apiClient.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
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
 * Enhanced fetch wrapper with error handling, retries, and toast notifications
 */
export async function apiClient<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    showToast = true,
    retries = 0,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new ApiError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          errorData.code
        );
      }

      // Success - return data
      const data = await response.json();
      return data as T;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // All retries failed
  if (showToast && typeof window !== "undefined") {
    // Import toast dynamically to avoid SSR issues
    import("@/app/store/uiStore").then(({ useUIStore }) => {
      const showToast = useUIStore.getState().showToast;
      showToast(
        lastError?.message || "Something went wrong",
        "error"
      );
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

// ============= USAGE EXAMPLES =============
/*
// Basic usage
const products = await api.get('/api/products');

// With error handling
try {
  const result = await api.post('/api/cart', { productId: '123' });
  console.log('Added to cart:', result);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Redirect to login
    } else if (error.code === 'SOLD_OUT') {
      // Show sold out message
    }
  }
}

// With retries
const data = await api.get('/api/unstable-endpoint', { 
  retries: 3 
});

// Without toast notification
const silent = await api.post('/api/analytics', data, { 
  showToast: false 
});
*/