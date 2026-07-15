import { POST } from '@/app/api/transport-tip/route';
import { NextRequest } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import { apiRateLimiter } from '@/lib/rate-limiter';

jest.mock('@/lib/gemini', () => ({
  generateResponse: jest.fn(),
  transportTipResponseSchema: {},
}));

describe('POST /api/transport-tip', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    apiRateLimiter.reset();
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/transport-tip', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  it('should generate sustainable transport tip with CO2 savings', async () => {
    (generateResponse as jest.Mock).mockResolvedValue({
      suggestion: 'Take NJ Transit Meadowlands Rail from Penn Station directly to the stadium.',
      estimatedCO2Saving: '3.4 kg CO2',
    });

    const req = createRequest({ origin: 'Penn Station', stadiumId: 'metlife-stadium' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.suggestion).toBe('Take NJ Transit Meadowlands Rail from Penn Station directly to the stadium.');
    expect(data.estimatedCO2Saving).toBe('3.4 kg CO2');
  });

  it('should reject missing origin', async () => {
    const req = createRequest({ origin: '', stadiumId: 'metlife-stadium' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
