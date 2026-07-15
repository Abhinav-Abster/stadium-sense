import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import TransportTipPanel from '@/components/TransportTipPanel';

// Mock fetch for client panels
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Accessibility Audit (WCAG 2.1 AA)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('Header should have no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ChatPanel should have no accessibility violations', async () => {
    const { container } = render(<ChatPanel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TransportTipPanel should have no accessibility violations', async () => {
    const { container } = render(<TransportTipPanel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
