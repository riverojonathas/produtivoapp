'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar/Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background-primary)]">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main 
        className={`
          flex-1 p-6 transition-all duration-300
          ${isSidebarOpen 
            ? 'ml-[var(--sidebar-width-expanded)]' 
            : 'ml-[var(--sidebar-width-collapsed)]'
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}; 