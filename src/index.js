import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ContextProvider } from './context/ContextProvider';
const queryClient = new QueryClient();

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop />
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
