import {
  formatDate,
  convertDateInDDMMYYYY,
  convertStringDateInDDMMYYYY,
  parseFloatBR,
  convertStringDateToYYYYMMDD,
} from '~/helpers/convert_data';

describe('convert_data helpers', () => {
  test('formatDate should format date to YYYY-MM-DD', () => {
    const date = new Date(2023, 9, 5); // October 5, 2023
    expect(formatDate(date)).toBe('2023-10-05');
  });

  test('convertDateInDDMMYYYY should format date to DD/MM/YYYY', () => {
    const date = new Date(2023, 9, 5); // October 5, 2023
    expect(convertDateInDDMMYYYY(date)).toBe('5/10/2023');
  });

  test('convertStringDateInDDMMYYYY should convert YYYY-MM-DD to DD/MM/YYYY', () => {
    const date = '2023-10-05';
    expect(convertStringDateInDDMMYYYY(date)).toBe('05/10/2023');
  });

  test('parseFloatBR should format number to Brazilian format', () => {
    const value = 1234.56;
    expect(parseFloatBR(value)).toBe('1.234,56');
  });

  test('convertStringDateToYYYYMMDD should convert DD/MM/YYYY to YYYY-MM-DD', () => {
    const dateString = '05/10/2023';
    expect(convertStringDateToYYYYMMDD(dateString)).toBe('2023-10-05');
  });
});
