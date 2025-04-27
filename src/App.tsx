import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';

function App() {
  const handleRefresh = () => {
    // In real implementation this would trigger a refresh of all dashboard data
    console.log('Refresh triggered from App component');
    // Could dispatch a global refresh action here
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-50">
        <Header onRefresh={handleRefresh} />
        <main>
          <Dashboard />
        </main>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;