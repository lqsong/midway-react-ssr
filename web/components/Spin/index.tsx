import { memo } from 'react';
import classnames from 'classnames';
import style from './index.module.less';

export interface ISpinProps {
  size?: 'sm' | 'lg' | 'default';
}

export default memo(({ size = 'default' }: ISpinProps) => (
  <div
    className={classnames(style.spin, style['spin-spinning'], {
      [style['spin-sm']]: size === 'sm',
      [style['spin-lg']]: size === 'lg',
    })}
    aria-live="polite"
    aria-busy="true"
  >
    <span className={classnames(style['spin-dot'], style['spin-dot-spin'])}>
      <i className={style['spin-dot-item']}></i>
      <i className={style['spin-dot-item']}></i>
      <i className={style['spin-dot-item']}></i>
      <i className={style['spin-dot-item']}></i>
    </span>
  </div>
));
