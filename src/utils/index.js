// @flow
export const parseSalary = (min: number, max: ?number): string => {
  const isFloat = (n: number = 0): boolean => Number(n) === n && n % 1 !== 0;

  const parseLocaleString = (n: number = 0): string =>
    isFloat(n)
      ? n.toLocaleString(undefined, { minimumFractionDigits: 2 })
      : n.toLocaleString();

  if (max) {
    if (min === max) {
      return parseLocaleString(min);
    }

    return `${parseLocaleString(min)}-${parseLocaleString(max)}`;
  }

  return parseLocaleString(min);
};

export const formatCurrency = (amount: string): string => `₹ ${amount}`;

export const parseSalaryFrequency = (
  frequency: string,
  isHindi: boolean = true,
): string => {
  return (
    {
      DAILY: isHindi ? 'हर दिन' : 'per day',
      MONTHLY: isHindi ? 'प्रति माह' : 'per month',
      WEEKLY: isHindi ? 'प्रति सप्ताह' : 'per week',
    }[frequency] ?? frequency
  );
};

export const parseApplicationStatus = (status: string): string => {
  return `${status.charAt(0).toUpperCase()}${status.slice(1).toLowerCase()}`;
};

export const getSizeInMB = (size: number = 1): number => 1000000 * size;
