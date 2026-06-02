import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size = 'md', muted = false, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'font-body',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
          muted && 'text-neutral-400',
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
