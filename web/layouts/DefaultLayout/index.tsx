import { memo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { useAsyncDataMetaContext } from '@/store/asyncDataContext';

import './css/index.less';

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default memo(({ children }: DefaultLayoutProps) => {
  const meta = useAsyncDataMetaContext();
  return (
    <>
      <nav>
        <Link
          to={'/'}
          className={classnames({ active: meta.navActive === 'home' })}
        >
          Home
        </Link>
        |
        <Link
          to={'/about'}
          className={classnames({ active: meta.navActive === 'about' })}
        >
          About
        </Link>
        |
        <Link
          to={{ pathname: '/localapi', search: 'uid=10' }}
          className={classnames({ active: meta.navActive === 'localapi' })}
        >
          LocalApi
        </Link>
      </nav>
      {children}
    </>
  );
});
