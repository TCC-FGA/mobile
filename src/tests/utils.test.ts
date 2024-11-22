import { capitalizeWords } from '~/helpers/utils';

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
