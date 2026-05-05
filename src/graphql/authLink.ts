import { setContext } from '@apollo/client/link/context';

/**
 * Auth Link - Adds authentication token to requests
 *
 * For production auth flow:
 * - Get access token from localStorage/cookie
 * - Add to Authorization header
 * - Handle token refresh if needed
 */
export const authLink = setContext((_, { headers }) => {
  // Get token from storage (localStorage, cookie, etc.)
  // const token = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : '',
    },
  };
});
