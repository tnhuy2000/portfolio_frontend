import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { httpLink } from './httpLink';
import { errorLink } from './errorLink';
import { authLink } from './authLink';

// Combine links: auth → error → http
const link = from([authLink, errorLink, httpLink]);

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache configuration for better performance
          companies: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          services: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          teamMembers: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  ssrMode: typeof window === 'undefined',
});
