import { RouteComponentProps } from '@reach/router';
import { Row, Col } from 'antd';
import * as React from 'react';
import Logo from '../../shared/components/Logo';
import { PrivateRoutes } from '../../constants/routes';
import { LoginForm } from './LoginForm';

export function LoginPage({ location, navigate }: RouteComponentProps) {
  const handleLoginDone = () => {
    navigate?.(PrivateRoutes.Bookings, { state: location?.state ?? undefined });
  };

  return (
    <Row>
      <Col
        sm={{ offset: 4, span: 16 }}
        md={{ offset: 6, span: 12 }}
        lg={{ offset: 7, span: 10 }}
        xl={{ offset: 8, span: 8 }}
      >
        <div className="flex justify-center my-16">
          <Logo type="dark" />
        </div>
        <div className="bg-white shadow-md border-gray-100 border p-8 rounded">
          <LoginForm onLoginDone={handleLoginDone} />
        </div>
      </Col>
    </Row>
  );
}
