import React, { useState } from 'react';

interface HeaderProps {
  onFetch: (year: number) => void;
  isFetching: boolean;
  isIntegrationMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onFetch, isFetching, isIntegrationMode }) => {
  const years = Array.from({ length: 5 }, (_, i) => 2025 + i); // FIX: e.g., 2025-2029
  
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);

  if (isIntegrationMode) {
    return null; // Don't show the header in integration mode
  }

  const handleFetch = () => {
    onFetch(selectedYear);
  };

  return (
    <header className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[var(--component-text-primary)]">Holistic Transformation Dashboard</h1>
        <p className="text-md text-[var(--component-text-muted)]">Live Data for {selectedYear}</p>
      </div>
      <div className="flex items-center gap-4 bg-[var(--component-panel-bg)] border border-[var(--component-panel-border)] p-2 rounded-lg shadow-md">
        <div className="relative">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none bg-transparent text-[var(--component-text-primary)] py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--component-panel-bg)] focus:ring-[var(--component-text-accent)]"
            aria-label="Select year for dashboard data"
          >
            {years.map(year => (
              <option key={year} value={year} style={{ backgroundColor: 'var(--component-panel-bg)' }}>{year}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--component-text-muted)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <button
          onClick={handleFetch}
          disabled={isFetching}
          className="bg-[var(--component-text-accent)] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {isFetching ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching...
            </>
          ) : (
            'Fetch Data'
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;