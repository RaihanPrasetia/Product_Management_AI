import React from 'react';

interface ContentBodyProps {
  children?: React.ReactNode;
}

export const ContentBody = ({ children }: ContentBodyProps) => {
  return (
    <div className="shadow-md border-2-gray-500 px-4 rounded-md overflow-hidden bg-white">
      {children}
    </div>
  );
};

export default ContentBody;
