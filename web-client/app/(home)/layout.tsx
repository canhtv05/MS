import { ReactNode } from 'react';
interface IRootHomeLayoutProps {
  children: ReactNode;
  header: ReactNode;
}

const RootHomeLayout = ({ children, header }: IRootHomeLayoutProps) => {
  return (
    <div className="min-h-screen">
      {header}
      {children}
    </div>
  );
};

export default RootHomeLayout;
