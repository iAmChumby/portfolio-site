import { ApiResponse, ApiError } from './types';

// API Client Configuration
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

class ApiClient {
  private config: ApiClientConfig;
  private abortController: AbortController | null = null;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    // Create new AbortController for this request
    this.abortController = new AbortController();
    
    const requestOptions: RequestInit = {
      ...options,
      signal: this.abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add timeout
    const timeoutId = setTimeout(() => {
      if (this.abortController) {
        this.abortController.abort();
      }
    }, this.config.timeout);

    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || 'HTTP_ERROR',
          status: response.status,
          details: errorData,
        };
        throw apiError;
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // Handle network errors and retry
      if (attempt < this.config.retries && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay * attempt);
        return this.makeRequest<T>(endpoint, options, attempt + 1);
      }

      // Re-throw API errors
      if (this.isApiError(error)) {
        throw error;
      }

      // Handle other errors
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private shouldRetry(error: unknown): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error instanceof Error && error.message.includes('timeout')) return true;
    if (this.isApiError(error) && error.status >= 500) return true;
    return false;
  }

  private isApiError(error: unknown): error is ApiError {
    return !!(error && 
             typeof error === 'object' && 
             'status' in error && 
             'message' in error && 
             typeof (error as ApiError).status === 'number' && 
             typeof (error as ApiError).message === 'string');
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}` : endpoint;
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  // Cancel current request
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  // Update configuration
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };

// Utility function for handling API errors in components
export const handleApiError = (error: unknown): string => {
  if (error && 
      typeof error === 'object' && 
      'message' in error && 
      typeof (error as ApiError).message === 'string') {
    return (error as ApiError).message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export const createLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
});