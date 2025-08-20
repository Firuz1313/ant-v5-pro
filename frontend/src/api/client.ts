import { APIResponse, PaginatedResponse, FilterOptions } from "../types";

// Force recompilation - 2025-01-30

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, any>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
    public errorType?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private activeRequests: Map<string, Promise<any>> = new Map();

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let fullUrl: string;

    // Check if baseUrl is absolute (starts with http)
    if (this.baseUrl.startsWith("http")) {
      // Direct connection to backend
      fullUrl = `${this.baseUrl}${endpoint}`;
      console.log(`🔗 Building direct URL: ${fullUrl}`);
    } else {
      // Relative URL for proxy
      fullUrl = `${this.baseUrl}${endpoint}`;
      if (!fullUrl.startsWith("/")) {
        fullUrl = `/${fullUrl}`;
      }
      console.log(`🔗 Building relative URL: ${fullUrl}`);
    }

    // Add query parameters if present
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      const separator = fullUrl.includes("?") ? "&" : "?";
      fullUrl = `${fullUrl}${separator}${searchParams.toString()}`;
    }

    console.log(`✅ Final API URL: ${fullUrl}`);
    return fullUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
    retryCount = 0,
  ): Promise<T> {
    const { params, timeout = this.timeout, ...fetchOptions } = options;

    const url = this.buildUrl(endpoint, params);
    const method = fetchOptions.method || "GET";

    // Create unique key for request deduplication (only for GET requests)
    const requestKey = `${method}:${url}:${fetchOptions.body || ""}`;

    // For GET requests, check if there's already a pending request
    if (method === "GET" && this.activeRequests.has(requestKey)) {
      console.log(`🔄 Deduplicating GET request to: ${url}`);
      return this.activeRequests.get(requestKey) as Promise<T>;
    }

    console.log(
      `🚀 Making ${method} request to: ${url}${retryCount > 0 ? ` (retry ${retryCount})` : ""}`,
    );

    const headers = {
      ...this.defaultHeaders,
      ...fetchOptions.headers,
    };

    console.log(`📤 Request headers:`, headers);
    console.log(`📤 Request body:`, fetchOptions.body ? "Has body" : "No body");
    console.log(`📤 Request method:`, method);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Create the actual request promise
    const requestPromise = this.executeRequest<T>(
      url,
      fetchOptions,
      headers,
      controller,
      timeoutId,
      endpoint,
      options,
      retryCount,
    );

    // Store promise for GET requests to enable deduplication
    if (method === "GET") {
      this.activeRequests.set(requestKey, requestPromise);

      // Clean up after request completes (success or failure)
      requestPromise.finally(() => {
        this.activeRequests.delete(requestKey);
      });
    }

    return requestPromise;
  }

  private async executeRequest<T>(
    url: string,
    fetchOptions: RequestInit,
    headers: Record<string, string>,
    controller: AbortController,
    timeoutId: NodeJS.Timeout,
    endpoint: string,
    options: RequestOptions,
    retryCount: number,
  ): Promise<T> {
    try {
      console.log(`📡 Sending fetch request...`);
      console.log(`📡 URL: ${url}`);
      console.log(`📡 Method: ${fetchOptions.method || "GET"}`);
      console.log(`📡 Headers:`, headers);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      console.log(`📡 Fetch completed with status: ${response.status}`);
      clearTimeout(timeoutId);

      // Read response body only once before any other operations
      let responseData: any = null;
      let responseText = "";

      try {
        // Check if body is already used before attempting to read
        if (response.bodyUsed) {
          console.error(`📡 Response body already consumed - providing fallback error`);
          responseText = JSON.stringify({
            error: `HTTP ${response.status}`,
            message: `Request failed with status ${response.status}`,
            errorType: "RESPONSE_ALREADY_USED",
          });
        } else {
          // Clone the response first to prevent body consumption issues
          const responseClone = response.clone();
          responseText = await responseClone.text();
          console.log(
            `📡 Response text (first 100 chars): ${responseText.substring(0, 100)}`,
          );
        }
      } catch (textError) {
        console.error(`📡 Failed to read response text:`, textError);
        // If reading failed, create a basic error response based on status
        responseText = JSON.stringify({
          error: `HTTP ${response.status}`,
          message: textError.message.includes("body stream") || textError.message.includes("already read")
            ? `Request failed with status ${response.status}`
            : `Failed to read response: ${textError.message}`,
          errorType: "RESPONSE_READ_ERROR",
        });
      }

      // Try to parse JSON if we have text
      if (responseText.trim()) {
        try {
          responseData = JSON.parse(responseText);
          console.log(`📡 Successfully parsed JSON`);
        } catch (parseError) {
          console.log(`📡 Not JSON, using as text`);
          responseData = { message: responseText };
        }
      } else {
        console.log(`📡 Empty response`);
        responseData = {};
      }

      // Handle 429 rate limiting with retry AFTER reading body
      if (response.status === 429 && retryCount < 3) {
        const retryAfter = response.headers.get("Retry-After") || "2";
        const delayMs = parseInt(retryAfter) * 1000;
        console.log(`⏳ Rate limited, retrying after ${delayMs}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      // Check for HTTP errors AFTER reading the body
      if (!response.ok) {
        const errorMessage =
          responseData?.error ||
          responseData?.message ||
          `HTTP ${response.status}`;
        console.error(`📡 HTTP Error ${response.status}: ${errorMessage}`);
        throw new ApiError(
          `HTTP ${response.status}: ${errorMessage}`,
          response.status,
          responseData,
        );
      }

      console.log(`✅ API call successful`);
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(`📡 Request Error:`, error.message);
        console.error(`📡 Error name:`, error.name);
        console.error(`📡 Error stack:`, error.stack);
        console.error(`📡 Request URL:`, url);
        console.error(`📡 Request method:`, fetchOptions.method || "GET");

        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408);
        }

        // Handle network connectivity errors with retry logic
        if (error.message === "Failed to fetch" || error.name === "TypeError") {
          console.error(`📡 Network error detected - checking connectivity`);

          // Retry for network failures (up to 2 retries)
          if (retryCount < 2) {
            console.log(`🔄 Retrying network request (attempt ${retryCount + 1}/2) after 1s delay...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.makeRequest<T>(endpoint, options, retryCount + 1);
          }

          throw new ApiError("Network connection failed after 2 retries - please check your internet connection and try again", 0);
        }

        // Handle specific body stream errors
        if (
          error.message.includes("body stream") ||
          error.message.includes("already read")
        ) {
          throw new ApiError("Response reading error - please try again", 0);
        }

        throw new ApiError(error.message, 0);
      }

      throw new ApiError("Unknown error occurred", 0);
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Utility methods
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setAuthToken(token: string): void {
    this.setDefaultHeader("Authorization", `Bearer ${token}`);
  }

  clearAuth(): void {
    this.removeDefaultHeader("Authorization");
  }
}

// Create default API client instance
const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const port = window.location.port;

    console.log("🌐 Current location:", window.location.href);

    // В облачной среде fly.dev/builder.codes
    if (hostname.includes("builder.codes") || hostname.includes("fly.dev")) {
      // Сначала пробуем proxy
      const proxyUrl = "/api";
      console.log("🌩️ Cloud environment - trying proxy URL:", proxyUrl);
      return proxyUrl;
    }

    // Локальн��я разработка - пря��ое подключение к бэ��енду
    if (hostname === "localhost" && port === "8080") {
      const directUrl = "http://localhost:3000/api";
      console.log("🏠 Local development - using direct connection:", directUrl);
      return directUrl;
    }
  }

  // Default fallback
  const defaultUrl = "/api";
  console.log("🔄 Using default API URL:", defaultUrl);
  return defaultUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log("=== API Configuration ===");
console.log("API Base URL:", API_BASE_URL);
console.log("========================");

export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
});

// Helper functions for common API patterns
export const createPaginatedRequest = (
  page: number = 1,
  limit: number = 20,
  filters?: FilterOptions,
) => {
  return {
    page,
    limit,
    ...filters,
  };
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export default apiClient;
