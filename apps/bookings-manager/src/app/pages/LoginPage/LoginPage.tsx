import { RouteComponentProps } from '@reach/router';
import { Row, Col } from 'antd';
import * as React from 'react';
import Logo from '../../shared/components/Logo';
import { LoginForm } from './LoginForm';

export function LoginPage(props: RouteComponentProps) {
  return (
    <Row>
      <Col span={8} offset={8}>
        <div className="flex justify-center my-16">
          <Logo type="dark" />
        </div>
        <div className="bg-white shadow-md border-gray-100 border p-8 rounded">
          <LoginForm />
        </div>
      </Col>
    </Row>
  );
}
