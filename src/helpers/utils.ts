export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function stringToFloat(moneyString: string) {
  if (!moneyString || typeof moneyString !== 'string') {
    throw new Error('Invalid input. Please provide a valid money string.');
  }
  const sanitizedString = moneyString.replace('R$', '').trim();
  const normalizedString = sanitizedString.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(normalizedString);

  if (isNaN(number)) {
    throw new Error('Unable to convert string to a valid number.');
  }

  return number;
}
