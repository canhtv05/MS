import Link from 'next/link';
import { GradientText } from './animate-ui/primitives/texts/gradient';
import { LeafIcon } from '@/components/animate-ui/icons';

const Logo = () => {
  return (
    <Link href={'/'} className="flex justify-start items-center gap-2">
      <div className="p-2 rounded-md bg-primary/10">
        <LeafIcon className="w-5 h-5 text-primary/90" />
      </div>
      <h1 className="flex items-center">
        <span className="hidden lg:block">
          <GradientText text="LeafHub" className="font-bold text-[18px] tracking-wide" />
        </span>
      </h1>
    </Link>
  );
};

export default Logo;
