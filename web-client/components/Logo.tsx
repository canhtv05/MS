import Link from 'next/link';
import { GradientText } from './animate-ui/primitives/texts/gradient';
import { LeafIcon } from '@/components/animate-ui/icons';
import { cn } from '@/lib/utils';

const Logo = ({ responsive = true }: { responsive?: boolean }) => {
  return (
    <Link href={'/'} className="flex justify-start items-center gap-2">
      <div className="p-2 rounded-md bg-primary/10">
        <LeafIcon className="w-5 h-5 text-primary/90" />
      </div>
      <h1 className={cn('flex items-center', responsive ? 'hidden lg:block' : '')}>
        <GradientText text="LeafHub" className="font-bold text-[18px] tracking-wide" />
      </h1>
    </Link>
  );
};

export default Logo;
