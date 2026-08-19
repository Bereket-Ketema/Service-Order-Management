export function cn(...inputs: (string | boolean | null | undefined | Record<string, boolean>)[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([, val]) => Boolean(val))
          .map(([key]) => key)
          .join(' ');
      }
      return item;
    })
    .join(' ')
    .trim();
}