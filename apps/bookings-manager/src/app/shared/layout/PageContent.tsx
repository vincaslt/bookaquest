import { Layout } from 'antd';
import { BasicProps } from 'antd/lib/layout/layout';
import * as React from 'react';
import styled from 'styled-components';
import { PageContentLoading } from '../components/PageContentLoading';

const Container = styled.div`
  padding-top: 64px;
`;

interface Props extends BasicProps {
  header?: React.ReactNode;
  noBackground?: boolean;
  loading?: boolean;
}

export function PageContent({
  header,
  loading,
  noBackground,
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <Container>
      {header && <div className="bg-white">{header}</div>}
      {loading ? (
        <PageContentLoading {...rest} />
      ) : (
        <Layout.Content
          className={`m-6 ${noBackground ? '' : 'p-6 bg-white'} ${className}`}
          {...rest}
        >
          {children}
        </Layout.Content>
      )}
    </Container>
  );
}
