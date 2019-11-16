import * as React from 'react';
import styled from 'styled-components';
import { SectionTitle } from '../components/SectionTitle';

const Container = styled.div`
  background-color: white;
  padding: 24px;
  margin-bottom: 24px;
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  extra?: React.ReactNode;
}

export function Section({ title, extra, children, ...rest }: Props) {
  return (
    <Container {...rest}>
      {title && <SectionTitle extra={extra}>{title}</SectionTitle>}
      {children}
    </Container>
  );
}
