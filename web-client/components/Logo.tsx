import Link from 'next/link';
import CustomImage from './customs/custom-image';

const Logo = () => {
  return (
    <Link href={'/'} className="flex justify-start items-center gap-2">
      <CustomImage
        width={35}
        height={35}
        src={'/imgs/logo.png'}
        alt="LeafHub Logo"
        loading="eager"
      />
      <h1 className="font-bold text-lg bg-linear-to-tr from-primary to-secondary bg-clip-text text-transparent tracking-wide">
        LeafHub
      </h1>
    </Link>
  );
};

export default Logo;
