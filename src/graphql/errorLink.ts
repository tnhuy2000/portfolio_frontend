import { onError } from '@apollo/client/link/error';

/**
 * Error Link - Global error handling for GraphQL requests
 *
 * Handles:
 * - GraphQL errors (validation, business logic errors)
 * - Network errors (connection issues, server errors)
 * - Authentication errors (token expired, unauthorized)
 */
export const errorLink = onError((errorHandler: any) => {
  if (errorHandler.graphQLErrors) {
    errorHandler.graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );

      // Handle specific error codes
      const code = extensions?.code;

      if (code === 'UNAUTHENTICATED') {
        // Handle authentication errors
        // Redirect to login or refresh token
        console.error('Authentication error - user needs to login');
      }

      if (code === 'FORBIDDEN') {
        // Handle authorization errors
        console.error('Authorization error - insufficient permissions');
      }
    });
  }

  if (errorHandler.networkError) {
    console.error(`[Network error]: ${errorHandler.networkError.message}`);

    // Handle network errors
    // Show toast notification or error message to user
  }
});
