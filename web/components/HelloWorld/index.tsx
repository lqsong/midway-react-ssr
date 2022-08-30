import { memo, useState } from 'react';

export interface HelloWorldProps {
  msg: string;
}

export default memo<HelloWorldProps>(({ msg }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <h1>{msg}</h1>

      <p>
        See <code>README.md</code> for more information.
      </p>

      <p>
        <a href="http://midway-react-ssr.liqingsong.cc/" target="_blank">
          Docs
        </a>
        |
        <a href="http://www.midwayjs.org/" target="_blank">
          Midway Docs
        </a>
        |
        <a href="https://zh-hans.reactjs.org/" target="_blank">
          React Docs
        </a>
        |
        <a href="https://ant.design/index-cn" target="_blank">
          Ant Design Docs
        </a>
        |
        <a href="https://cn.vitejs.dev/" target="_blank">
          Vite Docs
        </a>
      </p>
      <button type="button" onClick={() => setCount(count + 1)}>
        count is: {count}
      </button>
      <p>
        Edit
        <code>components/HelloWorld</code> to test hot module replacement.
      </p>
    </>
  );
});
