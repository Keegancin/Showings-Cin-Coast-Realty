import React from 'react';

const MobileLayout = ({ children, header, bottomNav }) => {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {header && (
        <header className="safe-area-top sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-border">
          {header}
        </header>
      )}

      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {bottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 pt-1 safe-area-bottom bg-gradient-to-t from-brand-dark via-brand-dark to-transparent">
          {bottomNav}
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
