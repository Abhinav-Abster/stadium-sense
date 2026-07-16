import { render, screen, waitFor } from '@testing-library/react';
import CrowdStatusPanel from '@/components/CrowdStatusPanel';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('CrowdStatusPanel Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const mockCrowdData = {
    summary: 'The concourses are crowded.',
    recommendation: 'Redirect incoming fans.',
    alertLevel: 'medium',
    scenario: 'normal',
    timestamp: new Date().toISOString(),
    zones: [
      {
        zoneId: 'north',
        zoneName: 'North Stand',
        currentOccupancy: 8000,
        capacity: 10000,
        percentFull: 80,
      },
      {
        zoneId: 'south',
        zoneName: 'South Stand',
        currentOccupancy: 3000,
        capacity: 10000,
        percentFull: 30,
      },
    ],
  };

  it('renders title and triggers initial fetch', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCrowdData,
    });

    render(<CrowdStatusPanel />);
    expect(screen.getByRole('heading', { name: /crowd.title/i })).toBeInTheDocument();

    // Wait for the async useEffect fetch to fire
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/crowd-status', expect.anything());
    });
  });

  it('renders zones and AI insights when fetch completes', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCrowdData,
    });

    render(<CrowdStatusPanel />);

    await waitFor(() => {
      // Check zone titles
      expect(screen.getByText('North Stand')).toBeInTheDocument();
      expect(screen.getByText('South Stand')).toBeInTheDocument();

      // Check percentage text
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();

      // Check summary
      expect(screen.getByText('The concourses are crowded.')).toBeInTheDocument();
      expect(screen.getByText('Redirect incoming fans.')).toBeInTheDocument();
    });
  });
});
