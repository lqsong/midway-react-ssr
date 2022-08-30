import { memo } from 'react';
import Spin from '@/components/Spin';
import style from './index.module.less';

export default memo(() => (
  <div className={style.result}>
    <Spin size="lg" />
  </div>
));
