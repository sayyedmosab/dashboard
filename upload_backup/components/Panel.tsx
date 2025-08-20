import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`bg-[var(--component-panel-bg)] border border-[var(--component-panel-border)] rounded-2xl p-6 shadow-lg flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};

export default Panel;
