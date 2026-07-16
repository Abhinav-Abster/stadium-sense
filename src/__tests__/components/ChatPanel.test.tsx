import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from '@/components/ChatPanel';

// Polyfill crypto.randomUUID for JSDOM test environment
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...globalThis.crypto,
      randomUUID: () => `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    },
  });
}

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ChatPanel Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders chat header and welcome message', () => {
    render(<ChatPanel />);

    expect(screen.getByRole('heading', { name: /chat.title/i })).toBeInTheDocument();
    expect(screen.getByText('chat.welcome')).toBeInTheDocument();
  });

  it('allows typing and sending a message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ reply: 'Here is Gate A.', language: 'en', cached: false }),
    });

    render(<ChatPanel />);

    const textarea = screen.getByPlaceholderText('chat.placeholder');
    const sendButton = screen.getByLabelText('chat.send');

    // Type a message
    fireEvent.change(textarea, { target: { value: 'where is gate A?' } });
    expect(textarea).toHaveValue('where is gate A?');

    // Send the message
    fireEvent.click(sendButton);

    // Wait for the mock API response to be rendered in the list
    await waitFor(() => {
      expect(screen.getByText('where is gate A?')).toBeInTheDocument();
      expect(screen.getByText('Here is Gate A.')).toBeInTheDocument();
    });
  });

  it('displays error message when API returns 429', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 429,
      ok: false,
    });

    render(<ChatPanel />);

    const textarea = screen.getByPlaceholderText('chat.placeholder');
    const sendButton = screen.getByLabelText('chat.send');

    fireEvent.change(textarea, { target: { value: 'test rate limit' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      // usePostJson uses the errorMessage param which is t('errorGeneric')
      expect(screen.getByText('chat.errorGeneric')).toBeInTheDocument();
    });
  });
});
