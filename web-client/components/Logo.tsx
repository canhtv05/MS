import Link from 'next/link';
// import CustomImage from './customs/custom-image';
// import images from '@/public/imgs';
import { GradientText } from './animate-ui/primitives/texts/gradient';

const Logo = () => {
  return (
    <Link href={'/'} className="flex justify-start items-center gap-2">
      {/* <CustomImage width={35} height={35} src={images.logo} alt="LeafHub Logo" loading="eager" /> */}
      <h1 className="flex items-center">
        <span className="lg:hidden">
          <GradientText text="LH" className="font-bold text-lg tracking-wide" />
        </span>
        <span className="hidden lg:block">
          <GradientText text="LeafHub" className="font-bold text-lg tracking-wide" />
        </span>
      </h1>
    </Link>
  );
};

export default Logo;
