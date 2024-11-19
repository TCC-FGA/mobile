import { capitalizeWords, stringToFloat } from '~/helpers/utils';

describe('capitalizeWords', () => {
  it('should capitalize the first letter of each word in a string', () => {
    const input = 'hello world';
    const output = 'Hello World';
    expect(capitalizeWords(input)).toBe(output);
  });

  it('should handle an empty string', () => {
    const input = '';
    const output = '';
    expect(capitalizeWords(input)).toBe(output);
  });

  it('should handle a single word', () => {
    const input = 'typescript';
    const output = 'Typescript';
    expect(capitalizeWords(input)).toBe(output);
  });

  it('should handle multiple spaces between words', () => {
    const input = 'hello   world';
    const output = 'Hello   World';
    expect(capitalizeWords(input)).toBe(output);
  });

  it('should handle words with mixed case', () => {
    const input = 'hElLo WoRLd';
    const output = 'HElLo WoRLd';
    expect(capitalizeWords(input)).toBe(output);
  });

  describe('capitalizeWords', () => {
    it('should capitalize the first letter of each word in a string', () => {
      const input = 'hello world';
      const output = 'Hello World';
      expect(capitalizeWords(input)).toBe(output);
    });

    it('should handle an empty string', () => {
      const input = '';
      const output = '';
      expect(capitalizeWords(input)).toBe(output);
    });

    it('should handle a single word', () => {
      const input = 'typescript';
      const output = 'Typescript';
      expect(capitalizeWords(input)).toBe(output);
    });

    it('should handle multiple spaces between words', () => {
      const input = 'hello   world';
      const output = 'Hello   World';
      expect(capitalizeWords(input)).toBe(output);
    });

    it('should handle words with mixed case', () => {
      const input = 'hElLo WoRLd';
      const output = 'HElLo WoRLd';
      expect(capitalizeWords(input)).toBe(output);
    });
  });

  describe('stringToFloat', () => {
    it('should convert a valid money string to a float', () => {
      const input = 'R$ 1.234,56';
      const output = 1234.56;
      expect(stringToFloat(input)).toBe(output);
    });

    it('should handle a string without currency symbol', () => {
      const input = '1.234,56';
      const output = 1234.56;
      expect(stringToFloat(input)).toBe(output);
    });

    it('should handle a string with spaces', () => {
      const input = ' R$  1.234,56 ';
      const output = 1234.56;
      expect(stringToFloat(input)).toBe(output);
    });

    it('should throw an error for an invalid input', () => {
      const input = 'invalid';
      expect(() => stringToFloat(input)).toThrow('Unable to convert string to a valid number.');
    });

    it('should throw an error for an empty string', () => {
      const input = '';
      expect(() => stringToFloat(input)).toThrow(
        'Invalid input. Please provide a valid money string.'
      );
    });

    it('should throw an error for a non-string input', () => {
      const input = 1234 as any;
      expect(() => stringToFloat(input)).toThrow(
        'Invalid input. Please provide a valid money string.'
      );
    });
  });
});
