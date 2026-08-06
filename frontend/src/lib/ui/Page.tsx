import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Hero pages own their top spacing; everything else clears the fixed nav. */
  flush?: boolean;
  className?: string;
};

/**
 * Page shell. Owns the surface tokens and the nav offset so pages never
 * hand-roll a top margin — the old code used mt-10/mt-20/mt-24 across
 * different pages, none of which matched the real navbar height.
 */
const Page = ({ children, flush = false, className = '' }: Props) => (
  <main
    data-surface="graphite"
    className={`flex-grow ${flush ? '' : 'pt-nav'} ${className}`}
  >
    {children}
  </main>
);

export default Page;
