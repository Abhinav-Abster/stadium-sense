import {
  getChatSystemPrompt,
  getCrowdStatusSystemPrompt,
  getTransportTipSystemPrompt,
  formatZoneDataForPrompt,
  formatTransportPromptContent,
} from '@/lib/prompts';

describe('Prompts Templates', () => {
  it('should generate localized chat system prompt containing stadium info', () => {
    const context = 'Gates: Gate A (accessible)\nZones: North Stand';
    const prompt = getChatSystemPrompt(context);
    expect(prompt).toContain('StadiumSense');
    expect(prompt).toContain('FIFA World Cup 2026');
    expect(prompt).toContain('Spanish');
    expect(prompt).toContain('French');
    expect(prompt).toContain('Portuguese');
    expect(prompt).toContain(context);
  });

  it('should generate crowd status system prompt', () => {
    const prompt = getCrowdStatusSystemPrompt();
    expect(prompt).toContain('StadiumSense Operations AI');
    expect(prompt).not.toContain('undefined');
  });

  it('should generate transport advisor system prompt', () => {
    const prompt = getTransportTipSystemPrompt();
    expect(prompt).toContain('Green Travel Advisor');
    expect(prompt).toContain('CO2');
  });

  it('should format zone data correctly', () => {
    const zones = [
      { name: 'North Stand', currentOccupancy: 8000, capacity: 10000 },
      { name: 'VIP Suite', currentOccupancy: 450, capacity: 500 },
    ];
    const text = formatZoneDataForPrompt(zones);
    expect(text).toContain('- North Stand: 8000/10000 (80% full)');
    expect(text).toContain('- VIP Suite: 450/500 (90% full)');
  });

  it('should format transport user prompt correctly', () => {
    const origin = 'Manhattan';
    const context = 'MetLife Stadium transit: train, bus';
    const content = formatTransportPromptContent(origin, context);
    expect(content).toContain("Fan's starting location: Manhattan");
    expect(content).toContain(context);
  });
});
