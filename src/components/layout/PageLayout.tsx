import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="pt-28">
          <h1 className="text-h1 mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}; 