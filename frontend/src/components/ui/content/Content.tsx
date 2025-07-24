import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

export const Content = ({ children }: ContentProps) => {
  return <>{children}</>;
};

export default Content;
