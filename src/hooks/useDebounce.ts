// filepath: /Users/arnavbhattacharya/Documents/CODES/coversume/src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update debounced value after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500); // Default delay is 500ms

    // Cleanup function to clear the timeout if value changes before delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run effect if value or delay changes

  return debouncedValue;
}
