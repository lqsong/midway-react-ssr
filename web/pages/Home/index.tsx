import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Button } from 'antd';

import logo from '@/assets/images/logo.png';
import HelloWorld from '@/components/HelloWorld';

import { IServerPage } from '@/@types/server';

const Home: IServerPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('home useEffect');
  }, [location]);

  return (
    <div className="home">
      <img alt="logo" src={logo} />
      <HelloWorld msg="Welcome to Your MIDWAY-REACT-SSR" />
      <Row
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </Row>
    </div>
  );
};

export default memo(Home);
