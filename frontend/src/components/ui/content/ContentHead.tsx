import React from 'react';

interface ContentHeadProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ContentHead = ({
  children,
  title,
  subTitle,
}: ContentHeadProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-end justify-between sm:justify-between gap-4 mb-6 mt-0`}
    >
      <div>
        <h1 className="text-2xl text-slate-600 font-medium mb-2">{title}</h1>
        {subTitle && <span className="text-lg text-slate-500">{subTitle}</span>}
      </div>
      <div className="flex space-x-4">{children}</div>
    </div>
  );
};
