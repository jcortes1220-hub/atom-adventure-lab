'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import { cn } from '../../lib/utils';

function Progress({
  className,
  value,
  max = 100,
  ...props
}: ProgressPrimitive.Root.Props) {
  const percentage =
    value != null ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
