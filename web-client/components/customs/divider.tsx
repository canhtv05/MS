import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface IDivider extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

const Divider = ({ content, className }: IDivider) => {
  return (
    <div className={cn('my-4', className)}>
      <div className="flex items-center">
        <div className="flex-1 h-px bg-foreground/70"></div>
        <span className="px-4 text-foreground/70 text-sm">{content}</span>
        <div className="flex-1 h-px bg-foreground/70"></div>
      </div>
    </div>
  );
};

export default Divider;
