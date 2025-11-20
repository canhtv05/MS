import Link from 'next/link';
import CustomImage from './customs/custom-image';
import images from '@/public/imgs';
import { cn } from '@/lib/utils';

interface ILogoProps {
  responsive?: boolean;
}

const Logo = ({ responsive }: ILogoProps) => {
  return (
    <Link href={'/'} className="flex justify-start items-center gap-2">
      <CustomImage width={35} height={35} src={images.logo} alt="LeafHub Logo" loading="eager" />
      <h1
        className={cn(
          'font-bold text-lg bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent tracking-wide',
          responsive && 'lg:block hidden',
        )}
      >
        LeafHub
      </h1>
    </Link>
  );
};

export default Logo;
