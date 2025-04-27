import React from 'react';
import { BarChart3, RefreshCcw, ServerCog } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-xl font-semibold text-neutral-900">
              VPS Monitor
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;