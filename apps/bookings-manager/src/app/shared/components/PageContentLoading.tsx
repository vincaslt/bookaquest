import { Spin } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = React.HTMLAttributes<HTMLDivElement>;

export function PageContentLoading(props: Props) {
  return (
    <Container {...props}>
      <Spin />
    </Container>
  );
}
