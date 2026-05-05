'use client';

import { ApolloProvider } from '@apollo/client/react/index.js';
import { apolloClient } from '@/graphql/apolloClient';

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}