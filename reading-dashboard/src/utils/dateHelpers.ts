import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatYear = (year: number): string => {
  return year.toString();
};

export const formatReadingPeriod = (startYear: number, endYear: number): string => {
  if (startYear === endYear) {
    return `${startYear}`;
  }
  return `${startYear} - ${endYear}`;
};

export const getYearRange = (years: number[]): { start: number; end: number; span: number } => {
  const sortedYears = years.sort((a, b) => a - b);
  const start = sortedYears[0];
  const end = sortedYears[sortedYears.length - 1];
  const span = end - start + 1;
  
  return { start, end, span };
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getYearsArray = (startYear: number, endYear: number): number[] => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

export const formatDateFinished = (dateString: string | null): string => {
  if (!dateString) return 'Date not recorded';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Date not recorded';
  }
};

export const getRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Unknown time';
  
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
};

export const getSeasonFromMonth = (month: number): string => {
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';  
  if (month >= 9 && month <= 11) return 'Fall';
  return 'Winter';
};