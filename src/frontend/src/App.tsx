import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import WakeUpLayout from './components/WakeUpLayout';
import AuthGuard from './components/AuthGuard';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthGuard>
          <ProfileSetup />
          <WakeUpLayout />
        </AuthGuard>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
