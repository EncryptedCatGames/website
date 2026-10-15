// Platform tags used to filter the catalogue.
export const platforms = {
  browser: 'Browser',
  desktop: 'Desktop',
  mobile: 'Mobile',
} as const;
export type Platform = keyof typeof platforms;
