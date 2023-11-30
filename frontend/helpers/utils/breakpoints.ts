export type CurrentBreakpoint =
  | 'smallMobile'
  | 'mobile'
  | 'tablet'
  | 'desktop'
  | 'mediumDesktop'
  | 'largeDesktop'
  | 'hugeDesktop';

type Breakpoints = Array<{ breakpoint: number; value: CurrentBreakpoint }>;

export const breakpoints: Breakpoints = [
  { breakpoint: 1280, value: 'mediumDesktop' },
  { breakpoint: 1440, value: 'largeDesktop' },
  { breakpoint: 1666, value: 'hugeDesktop' },
  { breakpoint: 1024, value: 'desktop' },
  { breakpoint: 768, value: 'tablet' },
  { breakpoint: 480, value: 'mobile' },
  { breakpoint: 320, value: 'smallMobile' },
];
