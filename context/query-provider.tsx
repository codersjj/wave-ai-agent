'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

interface Props {
  children: React.ReactNode
}

const QueryProvider = ({ children }: Props) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider