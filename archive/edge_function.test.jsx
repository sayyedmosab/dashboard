// Edge Function Integration Test
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchDashboardData } from './api/database';

// Mock the database API to use our edge function
jest.mock('./api/database', () => ({
  fetchDashboardData: jest.fn(),
}));

const MOCK_RESPONSE = {
  dimensions: [
    {
      id: "dim1",
      title: "Operational Efficiency",
      health: 85,
      kpi: "93%",
      label: "Utilization",
      trend: {
        baseline: 75,
        actual: 93,
        target: 95,
        bands: [70, 90]
      }
    },
    // Mock data truncated for brevity...
  ],
  // More mock data would go here
};

describe('Edge Function Integration Test', () => {
  beforeEach(() => {
    // Reset the mock
    fetchDashboardData.mockReset();
  });

  test('App loads dashboard data from edge function', async () => {
    // Mock the fetchDashboardData to return the edge function response
    fetchDashboardData.mockResolvedValue(MOCK_RESPONSE);

    // Render the App component
    render(<App />);

    // Check if the app is loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the data to load
    await waitFor(() => {
      expect(fetchDashboardData).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Operational Efficiency')).toBeInTheDocument();
    });

    // Check if data from edge function is displayed
    expect(screen.getByText('93%')).toBeInTheDocument();
  });

  test('App handles edge function errors gracefully', async () => {
    // Mock the fetchDashboardData to simulate an error
    fetchDashboardData.mockRejectedValue(new Error('Edge function error'));

    // Render the App component
    render(<App />);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(fetchDashboardData).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
    });
  });
});
