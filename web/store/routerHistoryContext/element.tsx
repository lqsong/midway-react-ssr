import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Location } from 'history';
import { RouterHistoryContext, RouterHistoryUpateContext } from './index';

export default memo(
  ({
    value = [],
    children,
  }: {
    value?: Location[];
    children: React.ReactNode;
  }) => {
    const location = useLocation();
    const [data, setData] = useState<Location[]>(value);

    const updateData = (val: Location[]) => {
      setData(val);
    };

    useEffect(() => {
      console.log('routerHistoryContext useEffect');
    }, [location]);

    return (
      <RouterHistoryContext.Provider value={data}>
        <RouterHistoryUpateContext.Provider value={updateData}>
          {children}
        </RouterHistoryUpateContext.Provider>
      </RouterHistoryContext.Provider>
    );
  }
);
