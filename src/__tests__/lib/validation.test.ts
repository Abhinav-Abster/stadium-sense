import {
  ChatInputSchema,
  CrowdStatusInputSchema,
  TransportTipInputSchema,
  validateInput,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('ChatInputSchema', () => {
    it('should validate correct inputs', () => {
      const input = { message: 'Hello, where is Gate A?', stadiumId: 'metlife', locale: 'en' };
      const result = validateInput(ChatInputSchema, input);
      expect(result.success).toBe(true);
    });

    it('should reject empty messages', () => {
      const input = { message: '', stadiumId: 'metlife' };
      const result = validateInput(ChatInputSchema, input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.message).toBe('Message is required');
      }
    });

    it('should reject oversized messages', () => {
      const longMessage = 'a'.repeat(501);
      const input = { message: longMessage, stadiumId: 'metlife' };
      const result = validateInput(ChatInputSchema, input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.message).toBe('Message must be 500 characters or less');
      }
    });

    it('should reject unsupported locales', () => {
      const input = { message: 'Hello', stadiumId: 'metlife', locale: 'de' };
      const result = validateInput(ChatInputSchema, input);
      expect(result.success).toBe(false);
    });
  });

  describe('CrowdStatusInputSchema', () => {
    it('should validate correct inputs', () => {
      const input = { stadiumId: 'sofi' };
      const result = validateInput(CrowdStatusInputSchema, input);
      expect(result.success).toBe(true);
    });

    it('should reject missing stadium ID', () => {
      const input = {};
      const result = validateInput(CrowdStatusInputSchema, input);
      expect(result.success).toBe(false);
    });
  });

  describe('TransportTipInputSchema', () => {
    it('should validate correct inputs', () => {
      const input = { origin: 'Downtown', stadiumId: 'metlife' };
      const result = validateInput(TransportTipInputSchema, input);
      expect(result.success).toBe(true);
    });

    it('should reject empty origin', () => {
      const input = { origin: '', stadiumId: 'metlife' };
      const result = validateInput(TransportTipInputSchema, input);
      expect(result.success).toBe(false);
    });

    it('should reject oversized origin', () => {
      const longOrigin = 'o'.repeat(201);
      const input = { origin: longOrigin, stadiumId: 'metlife' };
      const result = validateInput(TransportTipInputSchema, input);
      expect(result.success).toBe(false);
    });
  });
});
