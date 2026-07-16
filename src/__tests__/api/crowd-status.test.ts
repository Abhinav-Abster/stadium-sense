import { POST } from '@/app/api/crowd-status/route';
import { NextRequest } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import { apiRateLimiter } from '@/lib/rate-limiter';

jest.mock('@google/genai', () => ({
  Type: { OBJECT: 'OBJECT', STRING: 'STRING' },
}));

jest.mock('@/lib/gemini', () => ({
  generateResponse: jest.fn(),
}));

describe('POST /api/crowd-status', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    apiRateLimiter.reset();
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/crowd-status', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('should analyze crowd data and return AI insight summary and recommendation', async () => {
    (generateResponse as jest.Mock).mockResolvedValue({
      summary: 'North Stand is highly congested.',
      recommendation: 'Direct fans to East Gate.',
      alertLevel: 'high',
    });

    const req = createRequest({ stadiumId: 'metlife-stadium' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.summary).toBe('North Stand is highly congested.');
    expect(data.recommendation).toBe('Direct fans to East Gate.');
    expect(data.alertLevel).toBe('high');
    expect(data.zones).toBeDefined();
    expect(data.scenario).toBeDefined();
  });

  it('should reject invalid stadium ID', async () => {
    const req = createRequest({ stadiumId: '' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
