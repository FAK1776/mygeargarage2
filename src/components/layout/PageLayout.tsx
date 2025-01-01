import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[896px] mx-auto pt-20">
          <h1 className="text-h1 mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}; 