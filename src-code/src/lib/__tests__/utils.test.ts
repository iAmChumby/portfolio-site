import {
  cn,
  formatDate,
  calculateReadingTime,
  debounce,
  throttle,
  generateSlug,
  isValidEmail,
  formatFileSize,
  getContrastColor,
} from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('handles Tailwind conflicts', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });

  describe('formatDate', () => {
    it('formats Date object correctly', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date);
      expect(result).toMatch(/January \d{1,2}, 2024/);
    });

    it('formats string date correctly', () => {
      const result = formatDate('2024-01-15T12:00:00.000Z');
      expect(result).toMatch(/January \d{1,2}, 2024/);
    });

    it('handles invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('calculateReadingTime', () => {
    it('calculates reading time correctly', () => {
      const content = 'word '.repeat(200); // 200 words
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('rounds up partial minutes', () => {
      const content = 'word '.repeat(250); // 250 words
      expect(calculateReadingTime(content)).toBe(2);
    });

    it('handles empty content', () => {
      expect(calculateReadingTime('')).toBe(0);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('limits function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('generateSlug', () => {
    it('converts text to slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world');
    });

    it('trims leading and trailing dashes', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('getContrastColor', () => {
    it('returns black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
      expect(getContrastColor('ffffff')).toBe('#000000');
    });

    it('returns white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
      expect(getContrastColor('000000')).toBe('#ffffff');
    });
  });
});