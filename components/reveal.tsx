'use client';

import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function Reveal({ children, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
