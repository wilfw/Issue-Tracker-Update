'use client';

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useRef } from 'react';

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <ReactQueryClientProvider client={queryClientRef.current}>
      {children}
    </ReactQueryClientProvider>
  )
}

export default QueryClientProvider