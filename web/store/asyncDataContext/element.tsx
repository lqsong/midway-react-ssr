import { memo, useState } from 'react';
import { AsyncDataContext, AsyncDataUpateContext } from './index';
import { IAsyncDataContext } from '@/@types/store';

export default memo(
  ({
    value,
    children,
  }: {
    value: IAsyncDataContext<any>;
    children: React.ReactNode;
  }) => {
    const [data, setData] = useState<IAsyncDataContext<any>>(value);

    const updateData = (val: IAsyncDataContext<any>) => {
      setData(val);
    };

    return (
      <AsyncDataContext.Provider value={data}>
        <AsyncDataUpateContext.Provider value={updateData}>
          {children}
        </AsyncDataUpateContext.Provider>
      </AsyncDataContext.Provider>
    );
  }
);
