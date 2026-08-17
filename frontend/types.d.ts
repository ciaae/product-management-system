declare module 'next/link' {
  import type { ReactNode } from 'react';
  const Link: (props: { href: string; children?: ReactNode; className?: string }) => any;
  export default Link;
}

declare module 'next/navigation' {
  export function useParams(): Record<string, string | string[] | undefined>;
}

declare module 'next' {
  export type Metadata = {
    title?: string;
    description?: string;
  };
}

declare module 'react' {
  export type ReactNode = any;
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare const process: {
  env: Record<string, string | undefined>;
};
