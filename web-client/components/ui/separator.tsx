import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  children?: React.ReactNode;
  text?: string;
  start?: React.ReactNode;
  center?: React.ReactNode;
  end?: React.ReactNode;
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  children,
  text,
  start,
  center,
  end,
  ...props
}: SeparatorProps) {
  const hasContent = start || center || end || children || text;
  const centerContent = center || children || text;

  if (hasContent && orientation === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-4 w-full', className)}>
        {start && <div className="shrink-0">{start}</div>}
        <SeparatorPrimitive.Root
          data-slot="separator"
          decorative={decorative}
          orientation={orientation}
          className={cn('bg-border shrink-0 h-px flex-1')}
          {...props}
        />
        {centerContent && (
          <div className="shrink-0">
            {typeof centerContent === 'string' ? (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {centerContent}
              </span>
            ) : (
              centerContent
            )}
          </div>
        )}
        <SeparatorPrimitive.Root
          data-slot="separator"
          decorative={decorative}
          orientation={orientation}
          className={cn('bg-border shrink-0 h-px flex-1')}
          {...props}
        />
        {end && <div className="shrink-0">{end}</div>}
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
